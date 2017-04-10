#!/usr/bin/env node
import app from '../src/app';
import * as http from 'http';
import { env, port } from '../src/lib/node-process';
import LogUtil from "../src/lib/log-util";

const logger: any = env === 'production' ? LogUtil.server : console;
const listenPort = normalizePort(port);

let server = http.createServer(app.callback());

server.listen(listenPort, function () {
  logger.info('KOA server listening on port ' + listenPort);
});

server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof listenPort === 'string'
    ? 'Pipe ' + listenPort
    : 'Port ' + listenPort;

  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  let address = server.address();
  let bind = typeof address === 'string'
    ? 'pipe ' + address
    : 'port ' + address.port;
  logger.info('Listening on ' + bind);
}
