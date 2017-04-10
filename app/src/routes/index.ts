import * as Router from "koa-router";
import FsUtil from "../lib/fs-util";

let router = new Router();

let routeFileList = FsUtil.getExportFileList(__dirname);

routeFileList.forEach(function (file) {
  require(file).default(router);
});

export default function (app) {
  app.use(router.routes());
  app.use(router.allowedMethods());
};
