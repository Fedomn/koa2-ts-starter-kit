export default function (sequelize, DataTypes) {
  let PageInfo = sequelize.define('PageInfo', {
    page_name: DataTypes.STRING,
    page_module: DataTypes.STRING,
    page_module_id: DataTypes.INTEGER,
    page_app_version: DataTypes.STRING,
    page_raise_person: DataTypes.STRING,
    page_code: DataTypes.INTEGER,
    page_args: DataTypes.STRING,
    page_type: DataTypes.INTEGER,
    page_url: DataTypes.STRING,
    page_dev_person: DataTypes.STRING,
    page_bi_person: DataTypes.STRING,
    page_platform: DataTypes.INTEGER,
    page_desc: DataTypes.STRING,
    page_date: DataTypes.STRING,
    status: DataTypes.INTEGER,
    require_desc: DataTypes.TEXT,
    review_status: DataTypes.INTEGER
  }, {
    tableName: 'page_requirements_info',
    createdAt: 'create_time',
    updatedAt: 'update_time'
  });
  return PageInfo;
};
