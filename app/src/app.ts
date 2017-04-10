///<reference path="../../typings/json.d.ts"/>
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as json from 'koa-json';
import * as cors from 'kcors';
import * as session from 'koa-generic-session';
import * as redisStore from 'koa-redis';
import * as redisConfig from '../../config/redis-conf.json';
import requestLogger from './middleware/request-logger';
import router from './routes';
import { env } from './lib/node-process';

const app = new Koa();
const AppConfig = {
  host: 'http://ba.codoon.com',
  cookieName: 'ba.codoon'
};

//Set signed cookie keys
app.keys = ['Ba', 'BaCodoon'];

//Middleware
app.use(bodyParser());
app.use(json());
app.use(cors({origin: AppConfig.host, credentials: true}));
app.use(session({
  key: AppConfig.cookieName,
  ttl: 8 * 1000 * 60 * 60, //8h
  store: redisStore({auth_pass: redisConfig[env]['password']})
}));
app.use(requestLogger());

router(app);

export default app;
