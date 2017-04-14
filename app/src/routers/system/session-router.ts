import ApplicationController from "../../libs/application-controller";
import LogUtil from "../../libs/log-util";
import HttpClient from "../../libs/http-client";
import APP_CONF from "../../config/index";

class SessionController extends ApplicationController {

  static async setSession(ctx) {
    if (ctx.session['login_session_id']) {
      ctx.body = {status: true, api: '/api/v1/session'};
    } else {
      let sessionId = ctx.request.body['login_session_id'];
      let ip = ctx.request.body['client_ip'];
      if (!sessionId) {
        LogUtil.request.debug(`${ip} 不存在login_session_id`);
        ctx.status = 401;
        ctx.body = {status: false, api: '/api/v1/session'};
      } else {
        LogUtil.request.debug(`${ip} 设置用户session成功`);
        ctx.session.login_session_id = sessionId;
        ctx.session.client_ip = ip;
        ctx.session.local_session = ctx.sessionId;
        ctx.body = {status: true, api: '/api/v1/session'};
      }
    }
  }

  static async checkSession(ctx) {
    if (ctx.session['login_session_id']) {
      let config = {
        params: {
          session_id: ctx.session['login_session_id'],
          client_ip: ctx.session['client_ip'],
          source_type: 'ba'
        }
      };
      try {
        let result = await HttpClient.get(APP_CONF.LOGIN_IN_CHECK_URL, config);
        let data = result['data'];
        if (data['errcode'] !== 0) {
          ctx.status = 401;
          ctx.body = {status: false, api: '/api/v1/check_session'};
        } else {
          ctx.body = {status: true, api: '/api/v1/check_session'};
        }
      } catch (e) {
        LogUtil.request.error(`统一认证 异常: ${e}`);
      }
    } else {
      ctx.status = 401;
      ctx.body = {status: false, api: '/api/v1/check_session'};
    }
  }

  build(): void {
    this._router.post('/api/v1/session', SessionController.setSession);
    this._router.get('/api/v1/check_session', SessionController.checkSession);
  }

}

export default SessionController;
