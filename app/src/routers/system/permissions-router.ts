import ApplicationController from "../../libs/application-controller";
import PermissionsService from "../../services/system/permissions-service";

class PermissionsController extends ApplicationController {

  build(): void {
    this._router.get('/api/v1/permissions', async (ctx) => {
      ctx.body = await PermissionsService.getPermissions(ctx.request.query.name);
    });
    this._router.post('/api/v1/permissions', this.applyBody(PermissionsService.savePermission));
    this._router.get('/api/v1/permissions/:id', this.applyId(PermissionsService.getPermissionById));
    this._router.put('/api/v1/permissions/:id', this.applyIdBody(PermissionsService.modifyPermissionById));
    this._router.del('/api/v1/permissions/:id', this.applyId(PermissionsService.deletePermissionById));

    //nested router
    this._router.get('/api/v1/permissions/:id/routes', this.applyId(PermissionsService.getPermissionRoutesById));
    this._router.post('/api/v1/permissions/:id/routes', this.applyIdBody(PermissionsService.savePermissionRoutesById));
    this._router.put('/api/v1/permissions/:id/routes', this.applyIdBody(PermissionsService.modifyPermissionRoutesById));
  }
}

export default PermissionsController;
