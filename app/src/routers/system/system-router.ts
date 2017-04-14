import * as _ from 'lodash';
import ApplicationController from "../../libs/application-controller";
import HttpClient from "../../libs/http-client";
import LogUtil from "../../libs/log-util";
import UsersService from "../../services/system/users-service";
import APP_CONF from "../../config";
import { SystemModels } from "../../models/system/index";

const {LoginLog} = SystemModels;

class SystemController extends ApplicationController {

  static async getUserInfo(ctx) {
    if (ctx.session['login_session_id']) {
      let config = {
        params: {
          session_id: ctx.session['login_session_id'],
        }
      };
      try {
        let result = await HttpClient.get(APP_CONF.LOGIN_IN_CHECK_URL, config);
        let data = result['data'];
        if (data['errcode'] !== 0) {
          ctx.status = 401;
          ctx.body = {status: false, api: '/api/v1/system/user_info'};
        } else {
          LoginLog.create({username: data['email'], userIp: ctx.session['client_ip'], userAgent: ctx.headers['user-agent'], message: '登录成功'});
          let routesResult = await UsersService.getRoutesByUserName(data['email']);
          let routes = routesResult['status'] ? routesResult['data'] : [];
          ctx.session['routes'] = routes;
          ctx.session['email'] = data['email'];
          ctx.body = {
            status: true,
            api: '/api/v1/system/user_info',
            data: {
              portrait: data['portrait'],
              email: data['email'],
              routes: routes
            }
          };
        }
      } catch (e) {
        LogUtil.request.error(`统一认证 异常: ${e}`);
      }
    } else {
      ctx.status = 401;
      ctx.body = {status: false, api: '/api/v1/system/user_info', msg: '后端用户未登陆'};
    }
  }

  static async getUserOperates(ctx) {
    if (ctx.session['login_session_id']) {
      let email = ctx.session.email;
      let viewOperates = await UsersService.getOperatesByUserName(email);
      let userOperates = _.reduce(viewOperates['data'], function (res, each) {
        res.push({api: each['api'], method: each['method']});
        return res;
      }, []);
      ctx.session.operates = userOperates;
      ctx.body = {status: true, data: userOperates};
    } else {
      ctx.status = 401;
      ctx.body = {status: false, api: '/api/v1/system/user_operates', msg: '后端用户未登陆'};
    }
  }

  static async logout(ctx) {
    LoginLog.create({username: ctx.session.email, userIp: ctx.session.client_ip, userAgent: ctx.headers['user-agent'], message: '登出成功'});
    ctx.session = null;
    ctx.status = 401;
    ctx.body = {status: true, api: '/api/v1/system/logout'};
  }

  static async hasRoute(ctx) {
    if (ctx.session['login_session_id'] && ctx.session['routes']) {
      let reqPath = ctx.request.query.path;
      let routes = ctx.session.routes;

      let index = _.findIndex(routes, function (each) {
        return each['path'] === reqPath;
      });

      if (index > -1) {
        // check success
        ctx.body = {status: true, api: '/api/v1/system/has_route', msg: '用户有该权限'};
      } else {
        ctx.status = 401;
        ctx.body = {status: false, api: '/api/v1/system/has_route', msg: '该用户无权限'};
      }
    } else {
      ctx.status = 401;
      ctx.body = {status: false, api: '/api/v1/system/has_route', msg: '该用户无权限'};
    }
  }

  build(): void {
    this._router.get('/api/v1/system/user_info', SystemController.getUserInfo);
    this._router.get('/api/v1/system/user_operates', SystemController.getUserOperates);
    this._router.get('/api/v1/system/logout', SystemController.logout);
    this._router.get('/api/v1/system/has_route', SystemController.hasRoute);
  }
}

export default SystemController;