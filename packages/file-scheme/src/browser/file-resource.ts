import { IResourceProvider, IResource, ResourceNeedUpdateEvent } from '@ali/ide-editor';
import { URI, MaybePromise, WithEventBus, localize, MessageType, LRUMap } from '@ali/ide-core-browser';
import { Autowired, Injectable } from '@ali/common-di';
import { LabelService } from '@ali/ide-core-browser/lib/services';
import { IEditorDocumentModelService, DIFF_SCHEME } from '@ali/ide-editor/lib/browser';
import { FILE_SCHEME } from '../common';
import { IFileServiceClient, FileStat } from '@ali/ide-file-service/lib/common';
import { Path } from '@ali/ide-core-common/lib/path';
import { FileChangeType } from '@ali/ide-core-common';
import { IDialogService } from '@ali/ide-overlay';
import { FileTreeSet } from './file-tree-set';

enum AskSaveResult {
  REVERT = 1,
  SAVE = 2,
  CANCEL = 3,
}

@Injectable()
export class FileSystemResourceProvider extends WithEventBus implements IResourceProvider {

  @Autowired()
  protected labelService: LabelService;

  @Autowired(IFileServiceClient)
  protected fileServiceClient: IFileServiceClient;

  @Autowired(IDialogService)
  protected dialogService: IDialogService;

  @Autowired(IEditorDocumentModelService)
  protected documentModelService: IEditorDocumentModelService;

  cachedFileStat = new LRUMap<string, FileStat | undefined>(200, 100);

  private involvedFiles = new FileTreeSet();

  constructor() {
    super();
    this.listen();
  }

  handlesUri(uri: URI) {
    const scheme = uri.scheme;
    if (scheme === FILE_SCHEME || this.fileServiceClient.handlesScheme(scheme)) {
      return 10;
    } else {
      return -1;
    }
  }

  protected listen() {
    this.fileServiceClient.onFilesChanged((e) => {
      e.forEach((change) => {
        if (change.type === FileChangeType.ADDED || change.type === FileChangeType.DELETED) {
          // 对于文件夹的删除，做要传递给子文件
          const effectedPaths = this.involvedFiles.effects(new URI(change.uri).codeUri.fsPath);
          effectedPaths.forEach((p) => {
            const effected = URI.file(p);
            this.cachedFileStat.delete(effected.toString());
            this.eventBus.fire(new ResourceNeedUpdateEvent(effected));
          });
        } else {
          // Linux下，可能 update 事件代表了 create
          // 此时如果 cached 是undefined，就更新
          if (this.cachedFileStat.has(change.uri) && this.cachedFileStat.get(change.uri) === undefined) {
            this.cachedFileStat.delete(change.uri);
            this.eventBus.fire(new ResourceNeedUpdateEvent(new URI(change.uri)));
          }
        }
      });
    });
  }

  async getFileStat(uri: string) {
    if (!this.cachedFileStat.has(uri)) {
      this.cachedFileStat.set(uri, await this.fileServiceClient.getFileStat(uri.toString()));
    }
    return this.cachedFileStat.get(uri);
  }

  provideResource(uri: URI): MaybePromise<IResource<any>> {
    // 获取文件类型 getFileType: (path: string) => string
    this.involvedFiles.add(uri.codeUri.fsPath);
    return Promise.all([
      this.getFileStat(uri.toString()),
      this.labelService.getName(uri),
      this.labelService.getIcon(uri),
    ] as const).then(([stat, name, icon]) => {
      return {
        name: stat ? name : (name + localize('file.resource-deleted', '(已删除)')),
        icon,
        uri,
        metadata: null,
        deleted: !stat,
        supportsRevive: true,
      };
    });
  }

  provideResourceSubname(resource: IResource, groupResources: IResource[]): string | null {
    const shouldDiff: URI[] = [];
    for (const res of groupResources) {
      if (res.uri.scheme === FILE_SCHEME && res.uri.displayName === resource.uri.displayName && res !== resource) {
        // 存在file协议的相同名称的文件
        shouldDiff.push(res.uri);
      }
    }
    if (shouldDiff.length > 0) {
      return '...' + Path.separator + getMinimalDiffPath(resource.uri, shouldDiff);
    } else {
      return null;
    }
  }

  onDisposeResource(resource) {
    this.involvedFiles.delete(resource.uri.codeUri.fsPath);
    this.cachedFileStat.delete(resource.uri.toString());
  }

  async shouldCloseResource(resource: IResource, openedResources: IResource[][]): Promise<boolean> {
    let count = 0;
    for (const resources of openedResources) {
      for (const r of resources) {
        if (r.uri.scheme === DIFF_SCHEME && r.metadata && r.metadata.modified.toString() === resource.uri.toString()) {
          count ++;
        }
        if (r.uri.scheme === FILE_SCHEME && r.uri.toString() === resource.uri.toString()) {
          count ++;
        }
        if (count > 1) {

          return true;
        }
      }
    }
    const documentModelRef = this.documentModelService.getModelReference(resource.uri, 'close-resource-check');
    if (!documentModelRef || !documentModelRef.instance.dirty) {
      if (documentModelRef) {
        documentModelRef.dispose();
      }
      return true;
    }
    // 询问用户是否保存
    const buttons = {
      [localize('file.prompt.dontSave', '不保存')]: AskSaveResult.REVERT,
      [localize('file.prompt.save', '保存')]: AskSaveResult.SAVE,
      [localize('file.prompt.cancel', '取消')]: AskSaveResult.CANCEL,
    };
    const selection = await this.dialogService.open(localize('saveChangesMessage').replace('{0}', resource.name), MessageType.Info, Object.keys(buttons));
    const result = buttons[selection!];
    if (result === AskSaveResult.SAVE) {
      const res = await documentModelRef.instance.save();
      documentModelRef.dispose();
      return res;
    } else if (result === AskSaveResult.REVERT) {
      await documentModelRef.instance.revert();
      documentModelRef.dispose();
      return true;
    } else if (!result || result === AskSaveResult.CANCEL) {
      documentModelRef.dispose();
      return false;
    } else {
      return true;
    }
  }
}

@Injectable()
export class DebugResourceProvider extends FileSystemResourceProvider {

  listen() {
    return; // 不继承 file 的监听逻辑
  }

  handlesUri(uri: URI) {
    return uri.scheme === 'debug' ? 10 : -1;
  }

  provideResource(uri: URI): MaybePromise<IResource<any>> {
    // 获取文件类型 getFileType: (path: string) => string
    return Promise.all([this.labelService.getName(uri), this.labelService.getIcon(uri)]).then(([name, icon]) => {
      return {
        name,
        icon,
        uri,
        metadata: null,
      };
    });
  }
}

/**
 * 找到source文件url和中从末尾开始和target不一样的path
 * @param source
 * @param targets
 */
function getMinimalDiffPath(source: URI, targets: URI[]): string {
  const sourceDirPartsReverse = source.path.dir.toString().split(Path.separator).reverse();
  const targetDirPartsReverses = targets.map((target) => {
    return target.path.dir.toString().split(Path.separator).reverse();
  });
  for (let i = 0; i < sourceDirPartsReverse.length; i ++ ) {
    let foundSame = false;
    for (const targetDirPartsReverse of targetDirPartsReverses) {
      if (targetDirPartsReverse[i] === sourceDirPartsReverse[i]) {
        foundSame = true;
        break;
      }
    }
    if (!foundSame) {
      return sourceDirPartsReverse.slice(0, i + 1).reverse().join(Path.separator);
    }
  }
  return sourceDirPartsReverse.reverse().join(Path.separator);
}
