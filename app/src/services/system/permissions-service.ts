import { SystemModels } from "../../models/system/index";

const {
  Route,
  Permission
} = SystemModels;

namespace PermissionsService {
  export async function getPermissions(name: string) {
    let permissions = [];
    if (name) {
      permissions = await Permission.findAll({
        where: {
          name: {
            $like: '%' + name + '%'
          }
        },
      });
    } else {
      permissions = await Permission.findAll();
    }
    return {status: true, data: permissions};
  }

  export async function savePermission(body) {
    let permission = await Permission.create(body);
    return {status: true, data: permission};
  }

  export async function getPermissionById(id) {
    let permission = await Permission.find({
      where: {id: id},
      include: [Route]
    });
    if (permission) {
      return {status: true, data: permission};
    } else {
      return {status: false, msg: '权限id不存在'};
    }
  }

  export async function modifyPermissionById(id, body) {
    let permission = await Permission.findById(id);
    if (permission) {
      permission = await permission.update(body);
      return {status: true, data: permission};
    } else {
      return {status: false, msg: '修改权限id不存在'};
    }
  }

  export async function deletePermissionById(id) {
    let permission = await Permission.findById(id);
    if (permission) {
      let result = permission.destroy();
      return {status: true, data: result};
    } else {
      return {status: false, msg: '删除权限id不存在'};
    }
  }

  export async function getPermissionRoutesById(id) {
    let permission = await Permission.findById(id);
    if (permission) {
      let routes = await permission.getRoutes();
      return {status: true, data: routes};
    } else {
      return {status: false, msg: '修改权限id不存在'};
    }
  }

  export async function savePermissionRoutesById(id, body) {
    let permission = await Permission.findById(id);
    if (permission) {
      let routeIds = body['routeId'];
      let result = permission.addRoutes(routeIds);
      return {status: true, data: result};
    } else {
      return {status: false, msg: '修改权限id不存在'};
    }
  }

  export async function modifyPermissionRoutesById(id, body) {
    let permission = await Permission.findById(id);
    if (permission) {
      let routeIds = body['routeId'] || [];
      let result = await permission.setRoutes(routeIds);
      return {status: true, data: result};
    } else {
      return {status: false, msg: '修改权限id不存在'};
    }
  }
}

export default PermissionsService;