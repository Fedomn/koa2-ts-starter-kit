export default function (sequelize, DataTypes) {
  let User = sequelize.define('User', {
    username: DataTypes.STRING,
    type: DataTypes.INTEGER,
    realname: DataTypes.STRING,
    phone: DataTypes.STRING,
    gender: DataTypes.INTEGER,
    defaultPage: DataTypes.STRING,
    desc: DataTypes.STRING,
    loginCount: DataTypes.INTEGER,
    lastLoginAt: DataTypes.DATE,
    expiresAt: DataTypes.DATE,
    status: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        User.belongsToMany(models.Permission, {
          'through': 'PermissionsUsers'
        });
        User.belongsToMany(models.Group, {
          'through': 'GroupsUsers'
        });
        User.belongsToMany(models.Channel, {
          'through': 'ChannelsUsers'
        });
        User.belongsToMany(models.Operate, {
          'through': 'OperatesUsers'
        });
      }
    }
  });
  return User;
};
