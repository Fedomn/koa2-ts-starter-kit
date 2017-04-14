import UsersService from "../../services/system/users-service";
import ApplicationController from "../../libs/application-controller";
import Router = require("koa-router");

class UsersController extends ApplicationController {
  build(): void {
    this._router.get('/api/v1/users', async (ctx) => {
      ctx.body = await UsersService.getUsers(ctx.request.query.username);
    });
    this._router.post('/api/v1/users', this.applyBody(UsersService.saveUser));
    this._router.get('/api/v1/users/:id', this.applyId(UsersService.getUserById));
    this._router.put('/api/v1/users/:id', this.applyIdBody(UsersService.modifyUserById));
    this._router.del('/api/v1/users/:id', this.applyId(UsersService.deleteUserById));

    //nested permissions api
    this._router.get('/api/v1/users/:id/permissions', this.applyId(UsersService.getUserPermissionsById));
    this._router.post('/api/v1/users/:id/permissions', this.applyIdBody(UsersService.saveUserPermissionsById));
    this._router.put('/api/v1/users/:id/permissions', this.applyIdBody(UsersService.modifyUserPermissionsById));

    //nested groups api
    this._router.get('/api/v1/users/:id/groups', this.applyId(UsersService.getUserGroupsById));
    this._router.post('/api/v1/users/:id/groups', this.applyIdBody(UsersService.saveUserGroupsById));
    this._router.put('/api/v1/users/:id/groups', this.applyIdBody(UsersService.modifyUserGroupsById));

    //nested routes api
    this._router.get('/api/v1/users/:id/routes', this.applyId(UsersService.getUserRoutesById));

    //nested channels api
    this._router.get('/api/v1/users/:id/channels', this.applyId(UsersService.getUserChannelsById));
    this._router.put('/api/v1/users/:id/channels', this.applyIdBody(UsersService.modifyUserChannelsById));

    //nested operate api
    this._router.get('/api/v1/users/:id/operates', this.applyId(UsersService.getUserOperatesById));
    this._router.get('/api/v1/users/:id/view-operates', this.applyId(UsersService.getUserViewOperatesById));
    this._router.post('/api/v1/users/:id/operates', this.applyIdBody(UsersService.saveUserOperatesById));
    this._router.put('/api/v1/users/:id/operates', this.applyIdBody(UsersService.modifyUserOperatesById));
  }
}

export default UsersController;
