import * as moment from "moment";
import { SystemModels } from "../../models/system";
import ApplicationController from "../../libs/application-controller";
import Formatter from "../../middlewares/formatter";

const {
  OperateLog
} = SystemModels;

class OperateLogController extends ApplicationController {

  static async getOperateLogs(ctx) {
    let {username, start_date, end_date, page, per_page} = ctx.request.query;
    let q = {
      attributes: ['username', 'method', 'url', 'responseStatus', 'responseTime', 'responseLength', 'createdAt'],
      where: {},
      order: 'createdAt desc',
      row: true
    };
    if (start_date && end_date) q['where']['createdAt'] = {$between: [start_date, moment(end_date).format('YYYY-MM-DD 23:59:59')]};
    if (username) q['where']['username'] = {$like: '%' + username + '%'};

    q['offset'] = page * per_page - per_page;
    q['limit'] = per_page;

    let res = await OperateLog.findAndCountAll(q);
    ctx.body = {status: true, data: res.rows, total: res.count, per_page: per_page};
  }

  build(): void {
    this._router.get('/api/v1/operate-logs', Formatter.formatQueryParam, OperateLogController.getOperateLogs);
  }
}

export default OperateLogController;