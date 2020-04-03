import { Domain, URI, AppConfig } from '@ali/ide-core-browser';
import { Autowired } from '@ali/common-di';
import { StaticResourceContribution, StaticResourceService } from '@ali/ide-static-resource/lib/browser/static.definition';
import { EXPRESS_SERVER_PATH } from '../common';

@Domain(StaticResourceContribution)
export class ExpressFileServerContribution implements StaticResourceContribution {

  @Autowired(AppConfig)
  appConfig: AppConfig;

  registerStaticResolver(service: StaticResourceService): void {
    service.registerStaticResourceProvider({
      scheme: 'file',
      resolveStaticResource: (uri: URI) => {
        // file 协议统一走静态服务
        // http://127.0.0.1:8000/assets?path=${path}
        const assetsUri = new URI(this.appConfig.staticServicePath || EXPRESS_SERVER_PATH);
        return assetsUri.withPath('assets').withQuery(decodeURIComponent(URI.stringifyQuery({
          /**
           * uri.path 在 Windows 下会被解析为  \c:\\Path\\to\file
           * fsPath C:\\Path\\to\\file
           */
          path: uri.codeUri.fsPath,
        })));
      },
      roots: [this.appConfig.staticServicePath || EXPRESS_SERVER_PATH],
    });
  }

}
