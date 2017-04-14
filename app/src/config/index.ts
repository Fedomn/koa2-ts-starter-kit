///<reference path="../../../typings/json.d.ts"/>
import * as appConfig from '../../../config/app-conf.json';
import * as redisConfig from '../../../config/redis-conf.json';
import * as log4jsConfig from "../../../config/log-conf.json";
import * as mailgunConfig from "../../../config/mailgun-conf.json";
import * as systemMysqlConfig from "../../../config/system-mysql-conf.json";

namespace APP_CONF {
  const env: string = process.env.NODE_ENV || appConfig['DEFAULT_NODE_ENV'];

  export const APP_DEFAULT_CONF: any = appConfig;
  export const LOG4JS_CONF: any = log4jsConfig;

  export const REDIS_CONF = redisConfig[env];
  export const MAILGUN_CONF = mailgunConfig[env];
  export const SYSTEM_MYSQL_CONF = systemMysqlConfig[env];

  export const LOGIN_IN_CHECK_URL: string = 'https://xxx/check_session';
}

export default APP_CONF;

