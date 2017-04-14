import * as crypto from "crypto";
import * as ms from "ms";
import * as _ from "lodash";
import * as Redis from 'ioredis';
import APP_CONF from "../config";
import LogUtil from "./log-util";

namespace CacheUtil {
  const redisInstance = Redis({
    dropBufferSupport: APP_CONF.REDIS_CONF['dropBufferSupport'],
    password: APP_CONF.REDIS_CONF['password']
  });

  //EX -> S
  const defaultExpire = 60 * 60 * 8; //8h

  const requestMd5 = (req) => {
    let reqStr = `${req.path}${req.method}`;
    _.forEach(req.query, function (value, key) {
      reqStr += `${key}${value}`;
    });
    _.forEach(req.body, function (value, key) {
      reqStr += `${key}${value}`;
    });
    let md5sum = crypto.createHash('md5');
    md5sum.update(reqStr);
    return md5sum.digest('hex');
  };

  const defaultGet = (redis, cacheKey) => {
    return redis.get(cacheKey).then(function (result) {
      if (result) {
        return JSON.parse(result);
      }
      return null;
    });
  };

  const defaultSet = (redis, cacheKey, result, ms) => {
    return redis.set(cacheKey, JSON.stringify(result), 'EX', ms);
  };

  export function cache(fn, options?) {
    let redis = options && options.client || redisInstance;
    let expire = options && options.expire || defaultExpire;
    let prefix = options && options.perfix || 'RequestCache:';
    let getter = defaultGet;
    let setter = defaultSet;

    return async function (ctx, next) {
      let key = requestMd5(ctx.request);
      let cacheKey = prefix + key;
      let result;
      result = await getter(redis, cacheKey);
      if (result) {
        LogUtil.server.info('Request get cache : ', cacheKey);
        ctx.body = result;
      } else {
        result = await fn(ctx, next);
        await setter(redis, cacheKey, result, ms(expire + ''));
        LogUtil.server.info('Request set cache : ', cacheKey);
        ctx.body = result;
      }
    };
  }
}

export default CacheUtil;

