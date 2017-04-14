import * as _ from 'lodash';
import * as Counter from 'passthrough-counter';
import * as humanize from 'humanize-number';
import * as bytes from 'bytes';
import LogUtil from '../libs/log-util';
import kueJobQueue from "../libs/kue-job-queue";

namespace RequestLogger {
  const ignoreRequestPathLists = [
    'session',
    'check_session',
    'system/user_info',
    'system/logout',
    'system/has_route'
  ];

  const isIgnoreRequest = (path) => {
    let status = false;
    _.forEach(ignoreRequestPathLists, function (each) {
      if (_.includes(path, each)) {
        status = true;
        return false;
      }
    });
    return status;
  };

  const log = (ctx, start, len, err?, event?): void => {
    // get the status code of the response
    let status = err ? (err.status || 500) : (ctx.status || 404);

    // get the human readable response length
    let length;
    if (~[204, 205, 304].indexOf(status)) {
      length = '';
    } else if (null == len) {
      length = '-';
    } else {
      length = bytes(len);
    }

    let upstream = err ? 'xxx' : event === 'close' ? '-x-' : '-->';
    let user = ctx.session && ctx.session.email ? ctx.session.email : '';
    LogUtil.server.info(` ${user} ${upstream} ${ctx.method} ${ctx.originalUrl} ${status} ${time(start)} ${length}`);
    if (user && !isIgnoreRequest(ctx.request.path)) {
      kueJobQueue.createAndRun('OperateLog', {
        username: user, method: ctx.method, url: ctx.originalUrl, responseStatus: status, responseTime: time(start), responseLength: length
      });
    }
  };

  const time = (start: number): string => {
    let delta: any = new Date().valueOf() - start;
    delta = delta < 10000 ? delta + 'ms' : Math.round(delta / 1000) + 's';
    return humanize(delta);
  };

  export const build = function () {
    return async function (ctx, next) {
      let start: any = new Date();
      let user = ctx.session && ctx.session.email ? ctx.session.email : '';
      LogUtil.server.info(` ${user} <-- ${ctx.method} ${ctx.originalUrl}`);

      try {
        await next();
      } catch (err) {
        // log uncaught downstream errors
        log(ctx, start, null, err);
        throw err;
      }

      // calculate the length of a streaming response
      // by intercepting the stream with a counter.
      // only necessary if a content-length header is currently not set.
      let length = ctx.response.length;
      let body = ctx.body;
      let counter;
      if (null == length && body && body.readable) {
        ctx.body = body.pipe(counter = Counter()).on('error', ctx.onerror);
      }

      // log when the response is finished or closed,
      // whichever happens first.
      let res = ctx.res;

      let onFinish = done.bind(null, 'finish');
      let onClose = done.bind(null, 'close');

      res.once('finish', onFinish);
      res.once('close', onClose);

      function done(event) {
        res.removeListener('finish', onFinish);
        res.removeListener('close', onClose);
        log(ctx, start, counter ? counter.length : length, null, event);
      }
    }
  };
}

export default RequestLogger.build;
