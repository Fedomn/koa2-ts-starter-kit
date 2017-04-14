export default function (sequelize, DataTypes) {
  let LoginLog = sequelize.define('LoginLog', {
    username: DataTypes.STRING,
    userIp: DataTypes.STRING,
    userAgent: DataTypes.STRING,
    message: DataTypes.STRING
  }, {});
  return LoginLog;
};