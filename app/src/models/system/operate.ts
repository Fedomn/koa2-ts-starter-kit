export default function (sequelize, DataTypes) {
  let Operate = sequelize.define('Operate', {
    name: DataTypes.STRING,
    api: DataTypes.STRING,
    method: DataTypes.STRING,
    desc: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        Operate.belongsToMany(models.User, {
          'through': 'OperatesUsers'
        });
        Operate.belongsToMany(models.Group, {
          'through': 'OperatesGroups'
        });
      }
    }
  });
  return Operate;
};