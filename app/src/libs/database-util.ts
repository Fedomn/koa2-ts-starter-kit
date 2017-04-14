import * as SequelizeStatic from "sequelize";
import { Sequelize } from "sequelize";
import FsUtil from "../libs/fs-util";
import LogUtil from "../libs/log-util";
import { env } from "./node-process";

namespace DatabaseUtil {
  export class MySqlClient {
    private _models: any = {};
    private _sequelize: Sequelize;

    constructor(inputConfig, inputDirName) {
      let ctx = this;
      let customConfig = Object.assign({}, {timezone: "+08:00"}, inputConfig);
      if (env === 'production') {
        customConfig['logging'] = (str) => {
          LogUtil.server.info(str);
        };
      }
      this._sequelize = new SequelizeStatic(
        inputConfig.database,
        inputConfig.username,
        inputConfig.password,
        customConfig
      );

      let modelFileList = FsUtil.getExportFileList(inputDirName);

      modelFileList.forEach((file) => {
        let model: any = ctx._sequelize.import(file);
        ctx._models[model.name] = model;
      });

      Object.keys(ctx._models).forEach((modelName) => {
        if (typeof ctx._models[modelName].associate === 'function') {
          ctx._models[modelName].associate(ctx._models);
        }
      });

      //Throw Error when connect error, otherwise connect success
      LogUtil.server.info(`Connected to Mysql: ${inputConfig.database} !`);
    }

    get models() {
      return this._models;
    }

    get sequelize() {
      return this._sequelize;
    }
  }
}

export default DatabaseUtil;

