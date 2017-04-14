export default function (sequelize, DataTypes) {
  let Channel = sequelize.define('Channel', {
    channel_id: DataTypes.INTEGER,
    channel_name: DataTypes.STRING,
    channel_tier: DataTypes.STRING,
    channel_ratio: DataTypes.INTEGER
  }, {
    timestamps: false,
    classMethods: {
      associate: function (models) {
        Channel.belongsToMany(models.User, {
          'through': 'ChannelsUsers'
        });
      }
    }
  });
  return Channel;
};
