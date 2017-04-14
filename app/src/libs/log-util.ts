import * as log4js from "log4js";
import { env } from "./node-process";
import APP_CONF from '../config';

namespace LogUtil {
  log4js.configure(APP_CONF.LOG4JS_CONF);

  export const server: any = env === 'production' ? log4js.getLogger('server') : console;
  export const request: any = env === 'production' ? log4js.getLogger('request') : console;
  export const job: any = env === 'production' ? log4js.getLogger('job') : console;
}

export default LogUtil;
