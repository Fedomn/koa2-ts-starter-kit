import * as Router from "koa-router";
import CacheUtil from "../libs/cache-util";

abstract class ApplicationController {
  protected _router: Router;

  constructor(router: Router) {
    this._router = router;
  }

  abstract build(): void;

  /**
   * apply (ctx.params.id) to fn
   */
  applyId(fn) {
    return async (ctx) => {
      ctx.body = await fn(ctx.params.id);
    };
  }

  /**
   * apply (ctx.request.body) to fn
   */
  applyBody(fn) {
    return async (ctx) => {
      ctx.body = await fn(ctx.request.body);
    };
  }

  /**
   * apply (ctx.params.id, ctx.request.body) to fn
   */
  applyIdBody(fn) {
    return async (ctx) => {
      ctx.body = await fn(ctx.params.id, ctx.request.body);
    };
  }

  response(fn) {
    return async (ctx, next) => {
      ctx.body = await fn(ctx, next);
    };
  }

  cache(fn) {
    return CacheUtil.cache(fn);
  }
}

export default ApplicationController;