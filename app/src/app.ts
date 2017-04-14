import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as json from "koa-json";
import * as cors from "kcors";
import * as session from "koa-generic-session";
import * as redisStore from "koa-redis";
import APP_CONF from "./config";
import requestLogger from "./middlewares/request-logger";
import beforeAPI from "./middlewares/before-api";
import appRouters from "./routers";

interface AppConfig {
  signedCookieKeys: string[],
  corsConfig: cors.Options
  sessionConfig: any
}

class App {
  private _app: Koa;
  private _signedCookieKeys: string[];
  private _corsConfig: cors.Options;
  private _sessionConfig: any;

  constructor(config: AppConfig) {
    this._app = new Koa();
    this._signedCookieKeys = config.signedCookieKeys;
    this._corsConfig = config.corsConfig;
    this._sessionConfig = config.sessionConfig;

    //Set signed cookie keys
    this._app.keys = this._signedCookieKeys;
  }

  //Middleware
  useBodyParser(): App {
    this._app.use(bodyParser());
    return this;
  }

  userPrettyJson(): App {
    this._app.use(json());
    return this;
  }

  useCors(): App {
    this._app.use(cors(this._corsConfig));
    return this;
  }

  useSession(): App {
    this._app.use(session(this._sessionConfig));
    return this;
  }

  useRequestLogger(): App {
    this._app.use(requestLogger());
    return this;
  }

  //Before API
  checkSession(): App {
    this._app.use(beforeAPI.checkSession());
    return this;
  }

  checkAPIRoutes(): App {
    this._app.use(beforeAPI.checkAPIRoutes());
    return this;
  }

  //Inject Api
  injectAPI(): App {
    this._app.use(appRouters.routes());
    this._app.use(appRouters.allowedMethods());
    return this;
  }

  build(): Koa {
    return this._app;
  }

}

const config: AppConfig = {
  signedCookieKeys: ['Koa', 'xxx'],
  corsConfig: {
    origin: 'http://xxx.xxx.com',
    credentials: true
  },
  sessionConfig: {
    key: 'koa.xxx',
    ttl: 8 * 1000 * 60 * 60, //8h
    store: redisStore({auth_pass: APP_CONF.REDIS_CONF['password']})
  }
};

const appInstance = new App(config);

//Middleware
appInstance
  .useBodyParser()
  .userPrettyJson()
  .useCors()
  .useSession()
  .useRequestLogger();

//Before Ba API
appInstance
  .checkSession()
  .checkAPIRoutes();

//Inject Ba Api
appInstance
  .injectAPI();

export default appInstance.build();
