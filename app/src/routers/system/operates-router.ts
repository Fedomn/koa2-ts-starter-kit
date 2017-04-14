import ApplicationController from "../../libs/application-controller";
import OperatesService from "../../services/system/operates-service";

class OperatesController extends ApplicationController {

  build(): void {
    this._router.get('/api/v1/operates', async (ctx) => {
      ctx.body = await OperatesService.getOperates(ctx.request.query.name);
    });
    this._router.post('/api/v1/operates', this.applyBody(OperatesService.saveOperate));
    this._router.put('/api/v1/operates/:id', this.applyIdBody(OperatesService.modifyOperateById));
    this._router.del('/api/v1/operates/:id', this.applyId(OperatesService.deleteOperateById));
  }
}

export default OperatesController;
