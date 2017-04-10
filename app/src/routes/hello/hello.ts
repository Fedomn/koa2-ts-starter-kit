import LogUtil from '../../lib/log-util';

export default function (router) {
  let count = 1;
  router.get('/', async (ctx, next) => {
    LogUtil.server.info(ctx.req.url);
    await next();
    ctx.session.test = count++;
    ctx.body = {status: true, data: 'hello'};
    ctx.status = 200;
  });
};