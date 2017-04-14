export default function (sequelize, DataTypes) {
  let Group = sequelize.define('Group', {
    name: DataTypes.STRING,
    desc: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        Group.belongsToMany(models.Permission, {
          'through': 'GroupsPermissions'
        });
        Group.belongsToMany(models.User, {
          'through': 'GroupsUsers'
        });
        Group.belongsToMany(models.Operate, {
          'through': 'OperatesGroups'
        });
      }
    }
  });
  return Group;
};