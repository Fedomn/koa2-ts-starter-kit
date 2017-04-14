import * as Mailgun from 'mailgun-js';
import APP_CONF from '../config';

namespace MailgunHelper {
  const mailgunInstance = Mailgun({
    apiKey: APP_CONF.MAILGUN_CONF.apiKey,
    domain: APP_CONF.MAILGUN_CONF.domain
  });

  export const MailMessageHelper = mailgunInstance.messages();
}

export default MailgunHelper;
