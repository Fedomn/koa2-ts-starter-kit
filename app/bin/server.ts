#!/usr/bin/env node
import * as http from "http";
import * as Koa from "koa";
import app from "../src/app";
import { port } from "../src/libs/node-process";
import LogUtil from "../src/libs/log-util";

class Server {
  private _server: http.Server;
  private _app: Koa;
  private _port: any;

  constructor(app: Koa, port: any) {
    this._app = app;
    this._server = http.createServer(app.callback());
    this._port = Server._normalizePort(port);
  }

  start(): void {
    this._server.listen(this._port);
    this._server.on('listening', () => this._onListening());
    this._server.on('error', error => this._onError(error));
  }

  stop(): void {
    this._server.close();
    process.exit(0);
  }

  private static _normalizePort(val): any {
    let port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
  }

  private _onError(error): void {
    if (error.syscall !== 'listen') {
      throw error;
    }
    let bind = typeof this._port === 'string' ? 'Pipe ' + this._port : 'Port ' + this._port;
    switch (error.code) {
      case 'EACCES':
        LogUtil.server.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        LogUtil.server.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  private _onListening(): void {
    let address = this._server.address();
    let bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + address.port;
    LogUtil.server.info('KOA Listening on ' + bind);
  }
}

const server = new Server(app, port);
server.start();
