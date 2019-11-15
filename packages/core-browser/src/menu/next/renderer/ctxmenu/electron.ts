import { Injectable, Autowired } from '@ali/common-di';
import { mnemonicButtonLabel } from '@ali/ide-core-common/lib/utils/strings';
import { Disposable, INativeMenuTemplate, CommandService, IElectronMainMenuService, CommandRegistry} from '@ali/ide-core-common';
import { Event } from '@ali/ide-core-common/lib/event';
import { CtxMenuRenderParams, ICtxMenuRenderer } from './base';
import { MenuNode, IMenubarItem } from '../../base';
import { SeparatorMenuItemNode, SubmenuItemNode, MenuService } from '../../menu-service';
import { electronEnv } from '../../../../utils';
import { AbstractMenubarService } from '../../menubar-service';
import { generateCtxMenu } from '../../menu-util';

export abstract class IElectronCtxMenuRenderer extends ICtxMenuRenderer {
}

export const IElectronMenuFactory = Symbol('IElectronMenuFactory');

export const IElectronMenuBarService = Symbol('IElectronMenuBarService');

export interface IElectronMenuBarService {
  start();
}

@Injectable()
export class ElectronMenuFactory extends Disposable {

  @Autowired(AbstractMenubarService)
  menubarService: AbstractMenubarService;

  public getMenuNodes(id: string): MenuNode[] {
    const menus = this.menubarService.getMenuItem(id);
    if (!menus) {
      return [];
    }
    const result = generateCtxMenu({menus});
    if (result && result.length >= 2) {
      return [...result[0], ...result[1]];
    } else {
      return [];
    }
  }

  public getTemplate(menuNodes: MenuNode[], map: Map<string, () => void>, context?: any[]): INativeMenuTemplate[] | undefined {
    return menuNodes.map((menuNode) => {
      if (menuNode.id === SeparatorMenuItemNode.ID) {
        return { type: 'separator' };
      }
      if (menuNode.id === SubmenuItemNode.ID) {
        return {
          label: `${mnemonicButtonLabel(menuNode.label, true)}`,
          submenu: this.getTemplate(menuNode.items, map, context),
        };
      } else {
        this.bindAction(menuNode, map, context);
        return {
          label: `${mnemonicButtonLabel(menuNode.label, true)} ${menuNode.isKeyCombination ? menuNode.keybinding : ''}`,
          id: menuNode.id,
          action: true,
          role: menuNode.nativeRole,
          disabled: menuNode.disabled,
          accelerator: menuNode.rawKeybinding && !menuNode.isKeyCombination ? toElectronAccelerator(menuNode.rawKeybinding) : undefined,
        };
      }
    });
    // SubmenuItem
    // TODO disabled, enabled等
  }

  private bindAction(menuNode: MenuNode, map: Map<string, () => void>, context?: any[]) {
    if (typeof menuNode.execute === 'function') {
      map.set(menuNode.id, () => {
        menuNode.execute(context);
      });
    }
  }
}

@Injectable()
export class ElectronCtxMenuRenderer implements IElectronCtxMenuRenderer {

  private contextMenuActions = new Map<string, () => void>();

  @Autowired(CommandService) protected readonly commandService: CommandService;

  @Autowired(IElectronMainMenuService)
  private electronMainMenuService: IElectronMainMenuService;

  @Autowired(IElectronMenuFactory)
  factory: ElectronMenuFactory;

  public show(params: CtxMenuRenderParams) {
    const { menuNodes, onHide, context } = params;

    // bind actions in this context
    this.contextMenuActions.clear();
    const template = this.factory.getTemplate(menuNodes, this.contextMenuActions, context);
    this.createNativeContextMenu({submenu: template}, onHide);
  }

  createNativeContextMenu(template: INativeMenuTemplate, onHide?: () => void) {
    this.electronMainMenuService.showContextMenu(template, electronEnv.currentWebContentsId);
    if (onHide) {
      const disposer = this.electronMainMenuService.on('menuClose', (targetId, contextMenuId) => {
        if (targetId !== electronEnv.currentWebContentsId + '-context') {
          return;
        }
        if (contextMenuId === template.id) {
          disposer.dispose();
          onHide();
        }
      });
    }
    const disposer = this.electronMainMenuService.on('menuClick', (targetId, menuId) => {
      if (targetId !== electronEnv.currentWebContentsId + '-context') {
        return;
      }
      const action = this.contextMenuActions.get(menuId);
      if (action) {
        action();
      }
      disposer.dispose();
    });

  }
}

// 应该不会有这种场景?
function toElectronAccelerator(keybinding: string) {
  return keybinding.replace('ctrlcmd', 'CmdOrCtrl');
}

interface IResolvedMenubarItem extends IMenubarItem {
  nodes: MenuNode[];
}

@Injectable()
export class ElectronMenuBarService implements IElectronMenuBarService {

  private menuBarActions = new Map<string, () => void>();

  @Autowired(CommandService) protected readonly commandService: CommandService;

  @Autowired(AbstractMenubarService)
  menubarService: AbstractMenubarService;

  @Autowired(IElectronMainMenuService)
  private electronMainMenuService: IElectronMainMenuService;

  @Autowired(IElectronMenuFactory)
  factory: ElectronMenuFactory;

  start() {
    this.electronMainMenuService.on('menuClick', (targetId, menuId) => {
      if (targetId !== electronEnv.currentWindowId + '-app') {
        return;
      }
      const action = this.menuBarActions.get(menuId);
      if (action) {
        action();
      }
    });
    this.updateMenuBar();
    // 同时监听 onDidMenuBarChange/onDidMenuChange
    this.menubarService.onDidMenuBarChange(() => {
      this.updateMenuBar();
    });
    this.menubarService.onDidMenuChange(() => {
      this.updateMenuBar();
    });
  }

  updateMenuBar() {
    this.menuBarActions.clear();
    const menubarItems = this.menubarService.getMenubarItems();
    const appMenuTemplate: INativeMenuTemplate[] = [];
    menubarItems.forEach((item) => {
      const menuId = item.id;
      const menuNodes = this.menubarService.getNewMenuItem(menuId);
      const templates = this.factory.getTemplate(menuNodes, this.menuBarActions);
      if (templates && templates.length > 0) {
        appMenuTemplate.push({
          label: mnemonicButtonLabel(item.label, true),
          submenu: templates,
        });
      }
    });
    this.electronMainMenuService.setApplicationMenu({submenu: appMenuTemplate}, electronEnv.currentWindowId);
  }

  getResolvedMenuItems(): IResolvedMenubarItem[] {
    const menubarItems = this.menubarService.getMenubarItems();
    return menubarItems.map((item) => this.resolveMenuItem(item)).filter((item) => !!item) as IResolvedMenubarItem[];
  }

  resolveMenuItem(item: IMenubarItem): IResolvedMenubarItem | undefined {
    const menus = this.menubarService.getMenuItem(item.id);
    if (menus) {
      const result = generateCtxMenu({menus});
      return {
        ...item,
        nodes: [...result[0], ...result[1]],
      };
    }
    return undefined;
  }
}
