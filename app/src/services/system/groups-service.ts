import { SystemModels } from "../../models/system";

const {
  Group
} = SystemModels;

namespace GroupsService {
  export async function getGroups(name: string) {
    let groups = [];
    if (name) {
      groups = await Group.findAll({
        where: {
          name: {
            $like: '%' + name + '%'
          }
        },
      });
    } else {
      groups = await Group.findAll();
    }
    return {status: true, data: groups};
  }

  export async function saveGroup(body) {
    let group = await Group.create(body);
    return {status: true, data: group};
  }

  export async function getGroupById(id) {
    let group = await Group.findById(id);
    if (group) {
      return {status: true, data: group};
    } else {
      return {status: false, msg: '用户组id不存在'};
    }
  }

  export async function modifyGroupById(id, body) {
    let group = await Group.findById(id);
    if (group) {
      group = await group.update(body);
      return {status: true, data: group};
    } else {
      return {status: false, msg: '修改用户组id不存在'};
    }
  }

  export async function deleteGroupById(id) {
    let group = await Group.findById(id);
    if (group) {
      let result = await group.destroy();
      return {status: true, data: result};
    } else {
      return {status: false, msg: '删除用户组id不存在'};
    }
  }

  //nested permissions
  export async function getGroupPermissionsById(id) {
    let group = await Group.findById(id);
    if (group) {
      let permissions = await group.getPermissions();
      return {status: true, data: permissions};
    } else {
      return {status: false, msg: '修改用户组id不存在'};
    }
  }

  export async function saveGroupPermissionsById(id, body) {
    let group = await Group.findById(id);
    if (group) {
      let permissionIds = body['permissionId'];
      let result = await group.addPermissions(permissionIds);
      return {status: true, data: result};
    } else {
      return {status: false, msg: '修改用户组id不存在'};
    }
  }

  export async function modifyGroupPermissionsById(id, body) {
    let group = await Group.findById(id);
    if (group) {
      let permissionId = body['permissionId'] || [];
      let result = await group.setPermissions(permissionId);
      return {status: true, data: result};
    } else {
      return {status: false, msg: '修改用户组id不存在'};
    }
  }

  //nested operates
  export async function getGroupOperatesById(id) {
    let group = await Group.findById(id);
    if (group) {
      let operates = await group.getOperates();
      return {status: true, data: operates};
    } else {
      return {status: false, msg: '修改用户组id不存在'};
    }
  }

  export async function saveGroupOperatesById(id, body) {
    let group = await Group.findById(id);
    if (group) {
      let operateIds = body['operateId'];
      let result = await group.addOperates(operateIds);
      return {status: true, data: result};
    } else {
      return {status: false, msg: '修改用户组id不存在'};
    }
  }

  export async function modifyGroupOperatesById(id, body) {
    let group = await Group.findById(id);
    if (group) {
      let operateIds = body['operateId'] || [];
      let result = await group.setOperates(operateIds);
      return {status: true, data: result};
    } else {
      return {status: false, msg: '修改用户组id不存在'};
    }
  }
}

export default GroupsService;
