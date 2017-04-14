import { SystemModels } from "../../models/system";

const {
  Operate
} = SystemModels;

namespace OperatesService {
  export async function getOperates(name: string) {
    let operates = [];
    if (name) {
      operates = await Operate.findAll({
        where: {
          $or: {
            name: {
              $like: '%' + name + '%'
            },
            api: {
              $like: '%' + name + '%'
            }
          }
        },
      });
    } else {
      operates = await Operate.findAll();
    }
    return {status: true, data: operates};
  }

  export async function saveOperate(body) {
    let operate = await Operate.create(body);
    return {status: true, data: operate};
  }

  export async function modifyOperateById(id, body) {
    let operate = await Operate.findById(id);
    if (operate) {
      operate = await operate.update(body);
      return {status: true, data: operate};
    } else {
      return {status: false, msg: '修改操作权限id不存在'};
    }
  }

  export async function deleteOperateById(id) {
    let operate = await Operate.findById(id);
    if (operate) {
      let result = await operate.destroy();
      return {status: true, data: result};
    } else {
      return {status: false, msg: '删除操作权限id不存在'};
    }
  }
}

export default OperatesService;