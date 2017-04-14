export default function (sequelize, DataTypes) {
  let ConversionInfo = sequelize.define('ConversionInfo', {
    conversion_name: DataTypes.STRING,
    platform: DataTypes.STRING,
    event_version: DataTypes.STRING,
    event_type: DataTypes.STRING,
    event_type_name: DataTypes.STRING,
    start_page_id: DataTypes.INTEGER,
    start_page_desc: DataTypes.STRING,
    start_card_id: DataTypes.INTEGER,
    start_card_position: DataTypes.STRING,
    start_card_sub_position: DataTypes.STRING,
    start_advert_id: DataTypes.INTEGER,
    end_page_id: DataTypes.INTEGER,
    end_page_desc: DataTypes.STRING,
    end_event_id: DataTypes.INTEGER,
    end_event_name: DataTypes.STRING
  }, {
    tableName: 'conversion_rate_info',
    createdAt: 'create_time',
    updatedAt: 'update_time'
  });
  return ConversionInfo;
};