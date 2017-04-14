export default function (sequelize, DataTypes) {
  let EventInfo = sequelize.define('EventInfo', {
    event_name: DataTypes.STRING,
    event_module: DataTypes.STRING,
    event_module_id: DataTypes.INTEGER,
    event_type: DataTypes.INTEGER,
    event_code: DataTypes.INTEGER,
    event_app_version: DataTypes.STRING,
    event_raise_person: DataTypes.STRING,
    event_desc: DataTypes.STRING,
    event_date: DataTypes.STRING,
    event_args: DataTypes.STRING,
    event_dev_person: DataTypes.STRING,
    event_platform: DataTypes.INTEGER,
    event_bi_person: DataTypes.STRING,
    status: DataTypes.INTEGER,
    require_desc: DataTypes.TEXT,
    review_status: DataTypes.INTEGER
  }, {
    tableName: 'event_requirements_info',
    createdAt: 'create_time',
    updatedAt: 'update_time'
  });
  return EventInfo;
};