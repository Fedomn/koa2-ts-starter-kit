import * as Counter from 'passthrough-counter';
import * as humanize from 'humanize-number';
import * as bytes from 'bytes';
import { env } from '../lib/node-process';
import LogUtil from '../lib/log-util';

const logger: any = env === 'production' ? LogUtil.server : console;


/**
 * Log helper.
 */
function log(ctx, start, len, err?, event?): void {
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
  logger.info(` ${user} ${upstream} ${ctx.method} ${ctx.originalUrl} ${status} ${time(start)} ${length}`);
}


/**
 * Show the response time in a human readable format.
 * In milliseconds if less than 10 seconds,
 * in seconds otherwise.
 */
function time(start: number): string {
  let delta: any = new Date().valueOf() - start;
  delta = delta < 10000 ? delta + 'ms' : Math.round(delta / 1000) + 's';
  return humanize(delta);
}


export default function () {
  return async function (ctx, next) {
    let start: any = new Date();
    let user = ctx.session && ctx.session.email ? ctx.session.email : '';
    logger.info(` ${user} <-- ${ctx.method} ${ctx.originalUrl}`);

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

    let onfinish = done.bind(null, 'finish');
    let onclose = done.bind(null, 'close');

    res.once('finish', onfinish);
    res.once('close', onclose);

    function done(event) {
      res.removeListener('finish', onfinish);
      res.removeListener('close', onclose);
      log(ctx, start, counter ? counter.length : length, null, event);
    }
  }
};

