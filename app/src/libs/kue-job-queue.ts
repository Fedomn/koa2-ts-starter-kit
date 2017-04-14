import * as _ from "lodash";
import * as kue from "kue";
import APP_CONF from "../config";
import LogUtil from "./log-util";
import MailgunHelper from "./email-util";
import { SystemModels } from "../models/system/index";

const {OperateLog} = SystemModels;

class KueJobQueue {
  private _queue: any;

  constructor(queue: any) {
    this._queue = queue;
  }

  registerJob(name, maxNum, fn) {
    if ('function' == typeof maxNum) {
      fn = maxNum;
      maxNum = 1;
    }
    this._queue.process(name, maxNum, fn);
  }

  create(name, data) {
    return this._queue.create(name, data);
  }

  createAndRun(name, data, priority = 'normal', attempts = 5) {
    this._queue
      .create(name, data)
      .priority(priority)
      .attempts(attempts)
      .removeOnComplete(true)
      .save();
  }
}

const kueQueue = kue.createQueue({
  prefix: 'kue',
  //redis-cli -n 5
  redis: {
    db: 5,
    auth: APP_CONF.REDIS_CONF['password']
  },
});
const kueJobQueue = new KueJobQueue(kueQueue);

kueJobQueue.registerJob('email', 10, function (job, done) {
  let data = _.cloneDeep(job.data);
  if (!job.data.from) data['from'] = APP_CONF.MAILGUN_CONF.from;
  if (!job.data.to) data['to'] = APP_CONF.MAILGUN_CONF.to.split(";");
  MailgunHelper.MailMessageHelper.send(data, function (err, body) {
    if (err) {
      LogUtil.job.error(`Job-email error: ${err}`);
      return done(new Error(`Job-email error: ${err}`));
    } else {
      LogUtil.job.info(`Job-email success`);
      done();
    }
  });
});

kueJobQueue.registerJob('OperateLog', 10, function (job, done) {
  let data = _.cloneDeep(job.data);
  try {
    OperateLog.create(data, {logging: false});
    LogUtil.job.info(`Job-OperateLog success: ${data['username']} ${data['url'].split('?')[0]}`);
    done();
  } catch (err) {
    LogUtil.job.error(`Job-OperateLog error: ${err}`);
    return done(new Error(`Job-OperateLog error: ${err}`));
  }
});

export default kueJobQueue;
