import * as ms from 'ms';
import * as Redis from 'ioredis';
import APP_CONF from "../config/index";

namespace RedisUtil {
  const redisInstance = Redis({
    dropBufferSupport: APP_CONF.REDIS_CONF['dropBufferSupport'],
    password: APP_CONF.REDIS_CONF['password']
  });

  //EX -> S
  const defaultExpire = 60 * 60 * 8; //8h

  const defaultGet = (cacheKey) => {
    return redisInstance.get(cacheKey).then(function (result) {
      if (result) {
        return JSON.parse(result);
      }
      return null;
    });
  };


  const defaultSet = (cacheKey, result, expire = defaultExpire) => {
    return redisInstance.set(cacheKey, JSON.stringify(result), 'EX', ms(expire + ''));
  };

  export const get = defaultGet;
  export const set = defaultSet;
}

export default RedisUtil;