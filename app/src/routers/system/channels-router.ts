import { SystemModels } from "../../models/system";
import ApplicationController from "../../libs/application-controller";
import UsersService from "../../services/system/users-service";

const {
  Channel
} = SystemModels;

class ChannelsController extends ApplicationController {

  static async getChannels(ctx) {
    let {limit, tier} = ctx.request.query;
    let q = {order: 'id'};
    if (limit) q['limit'] = parseInt(limit);
    if (tier) q['where'] = {channel_tier: {$in: tier.split(',')}};
    let channels = await Channel.findAll(q);
    ctx.body = {status: true, data: channels};
  }

  static async getChannelsByUserNameChannelTier(ctx) {
    let {tier} = ctx.request.query;
    let res = await UsersService.getChannelsByUserNameChannelTier(ctx.session.email, tier);
    if (res.status) {
      ctx.body = {status: true, data: res.data};
    } else {
      ctx.body = {status: false};
    }
  }

  build(): void {
    this._router.get('/api/v1/channels', ChannelsController.getChannels);
    this._router.get('/api/v1/user_channels', ChannelsController.getChannelsByUserNameChannelTier);
  }
}

export default ChannelsController;
