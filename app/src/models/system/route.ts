export default function (sequelize, DataTypes) {
  let Route = sequelize.define('Route', {
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    path: DataTypes.STRING,
    desc: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        Route.belongsToMany(models.Permission, {
          'through': 'PermissionsRoutes'
        });
      }
    }
  });
  return Route;
};