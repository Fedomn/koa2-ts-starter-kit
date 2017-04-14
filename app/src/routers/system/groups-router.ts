import ApplicationController from "../../libs/application-controller";
import GroupsService from "../../services/system/groups-service";

class GroupsController extends ApplicationController {

  build(): void {
    this._router.get('/api/v1/groups', async (ctx) => {
      ctx.body = await GroupsService.getGroups(ctx.request.query.name);
    });
    this._router.post('/api/v1/groups', this.applyBody(GroupsService.saveGroup));
    this._router.get('/api/v1/groups/:id', this.applyId(GroupsService.getGroupById));
    this._router.put('/api/v1/groups/:id', this.applyIdBody(GroupsService.modifyGroupById));
    this._router.del('/api/v1/groups/:id', this.applyId(GroupsService.deleteGroupById));

    //nested permissions api
    this._router.get('/api/v1/groups/:id/permissions', this.applyId(GroupsService.getGroupPermissionsById));
    this._router.post('/api/v1/groups/:id/permissions', this.applyIdBody(GroupsService.saveGroupPermissionsById));
    this._router.put('/api/v1/groups/:id/permissions', this.applyIdBody(GroupsService.modifyGroupPermissionsById));

    //nested operates api
    this._router.get('/api/v1/groups/:id/operates', this.applyId(GroupsService.getGroupOperatesById));
    this._router.post('/api/v1/groups/:id/operates', this.applyIdBody(GroupsService.saveGroupOperatesById));
    this._router.put('/api/v1/groups/:id/operates', this.applyIdBody(GroupsService.modifyGroupOperatesById));
  }
}

export default GroupsController;
