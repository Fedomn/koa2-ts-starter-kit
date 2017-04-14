import * as moment from 'moment';

namespace Formatter {

  export async function formatQueryParam(ctx, next) {
    let {
      date_range,
      page = 1,
      per_page = 10
    } = ctx.request.query;

    let [start_date, end_date] = date_range ? date_range.split('~') : [moment().subtract(6, 'day').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
    let convertedQueryParam = {
      start_date: start_date,
      end_date: end_date,
      page: parseInt(page as any),
      per_page: parseInt(per_page as any)
    };

    Object.assign(ctx.request.query, convertedQueryParam);
    await next();
  }

}

export default Formatter;