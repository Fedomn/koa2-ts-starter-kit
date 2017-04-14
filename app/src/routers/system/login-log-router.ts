import * as _ from 'lodash';
import * as moment from 'moment';
import * as uaParser from 'ua-parser-js';
import { SystemModels } from "../../models/system";
import ApplicationController from "../../libs/application-controller";
import Formatter from "../../middlewares/formatter";

const {
  LoginLog
} = SystemModels;

class LoginLogController extends ApplicationController {

  static async getLoginLogs(ctx) {
    let {username, start_date, end_date, page, per_page} = ctx.request.query;
    let q = {
      attributes: ['username', 'userIp', 'userAgent', 'message', 'createdAt'],
      where: {},
      order: 'createdAt desc',
      raw: true
    };
    if (start_date && end_date) q['where']['createdAt'] = {$between: [start_date, moment(end_date).format('YYYY-MM-DD 23:59:59')]};
    if (username) q['where']['username'] = {$like: '%' + username + '%'};

    q['offset'] = page * per_page - per_page;
    q['limit'] = per_page;

    let res = await LoginLog.findAndCountAll(q);
    let data = _.reduce(res.rows, function (res, each) {
      let ua = uaParser(each['userAgent']);
      res.push({
        username: each['username'],
        userIp: each['userIp'],
        browser: ua['browser']['name'] ? `${ua['browser']['name']}-${ua['browser']['version']}` : 'unknown',
        engine: ua['engine']['name'] ? `${ua['engine']['name']}-${ua['engine']['version']}` : 'unknown',
        os: ua['os']['name'] ? `${ua['os']['name']}-${ua['os']['version']}` : 'unknown',
        message: each['message'],
        createdAt: each['createdAt']
      });
      return res;
    }, []);

    ctx.body = {status: true, data: data, total: res.count, per_page: per_page};
  }

  build(): void {
    this._router.get('/api/v1/login-logs', Formatter.formatQueryParam, LoginLogController.getLoginLogs);
  }
}

export default LoginLogController;
