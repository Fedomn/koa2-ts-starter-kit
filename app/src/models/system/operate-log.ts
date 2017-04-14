export default function (sequelize, DataTypes) {
  let OperateLog = sequelize.define('OperateLog', {
    username: DataTypes.STRING,
    method: DataTypes.STRING,
    url: DataTypes.STRING,
    responseStatus: DataTypes.STRING,
    responseTime: DataTypes.STRING,
    responseLength: DataTypes.STRING
  }, {});
  return OperateLog;
};