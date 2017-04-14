import APP_CONF from "../config";

export let env: string = process.env.NODE_ENV || APP_CONF.APP_DEFAULT_CONF['DEFAULT_NODE_ENV'];
export let port: string = process.env.PORT || APP_CONF.APP_DEFAULT_CONF['DEFAULT_PORT'];
