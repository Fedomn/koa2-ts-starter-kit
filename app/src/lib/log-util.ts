import * as log4js from "log4js";
import * as config from "../../../config/log-conf.json";

log4js.configure(config as any);

namespace LogUtil {
  export const server = log4js.getLogger('server');
  export const request = log4js.getLogger('request');
  export const job = log4js.getLogger('job');
}

export default LogUtil;
