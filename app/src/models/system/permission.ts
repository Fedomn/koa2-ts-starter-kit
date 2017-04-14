export default function (sequelize, DataTypes) {
  let Permission = sequelize.define('Permission', {
    name: DataTypes.STRING,
    desc: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        Permission.belongsToMany(models.Route, {
          'through': 'PermissionsRoutes'
        });
        Permission.belongsToMany(models.User, {
          'through': 'PermissionsUsers'
        });
        Permission.belongsToMany(models.Group, {
          'through': 'GroupsPermissions'
        });
      }
    }
  });
  return Permission;
};