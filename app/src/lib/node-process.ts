import * as config from "../../../config/app-conf.json";

export let env: string = process.env.NODE_ENV || config['DEFAULT_NODE_ENV'];
export let port: string = process.env.PORT || config['DEFAULT_PORT'];
