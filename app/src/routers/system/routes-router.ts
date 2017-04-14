import ApplicationController from "../../libs/application-controller";
import RoutesService from "../../services/system/routes-service";

class RoutesController extends ApplicationController {

  build(): void {
    this._router.get('/api/v1/routes', async (ctx) => {
      ctx.body = await RoutesService.getRoutes(ctx.request.query.path);
    });
    this._router.post('/api/v1/routes', this.applyBody(RoutesService.saveRoute));
    this._router.get('/api/v1/routes/:id', this.applyId(RoutesService.getRouteById));
    this._router.put('/api/v1/routes/:id', this.applyIdBody(RoutesService.modifyRouteById));
    this._router.del('/api/v1/routes/:id', this.applyId(RoutesService.deleteRouteById));
  }
}

export default RoutesController;
