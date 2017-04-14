import APP_CONF from "../../config";
import DatabaseUtil from "../../libs/database-util";

let systemMysql = new DatabaseUtil.MySqlClient(APP_CONF.SYSTEM_MYSQL_CONF, __dirname);

export const SystemModels = systemMysql.models;
export const Gdm = systemMysql.sequelize;
