import * as Router from "koa-router";
import FsUtil from "../libs/fs-util";
import LogUtil from "../libs/log-util";
import { last, padEnd } from "lodash";

class AppRouter {
  private _currentDir: string;
  private _router: Router;

  constructor(currentDir: string) {
    this._currentDir = currentDir;
    this._router = new Router();
  }

  build(): Router {
    let ctx = this;
    let routeFileList = FsUtil.getExportFileList(ctx._currentDir);

    routeFileList.forEach(function (file) {
      let Controller = require(file).default;
      new Controller(ctx._router).build();
    });

    ctx.logApiPath();

    return this._router;
  }

  logApiPath() {
    LogUtil.server.info('Loading API Start ...');
    this._router.stack.forEach(function (each) {
      let method: string = last(each['methods']);
      let path: string = each['path'];
      LogUtil.server.info(`${padEnd(method, 10)}${path}`);
    });
    LogUtil.server.info('Loading API End');
  }
}

const appRouter = new AppRouter(__dirname);
export default appRouter.build();
