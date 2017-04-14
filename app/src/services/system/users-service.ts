import * as _ from "lodash";
import { SystemModels } from "../../models/system";

const {
  User,
  Group,
  Permission,
  Route,
  Operate,
  Channel
} = SystemModels;

/**
 * To UsersController API
 */
namespace UsersService {
  export async function getUsers(username: string) {
    let users = [];
    if (username) {
      users = await User.findAll({
        where: {
          $or: {
            username: {
              $like: '%' + username + '%'
            },
            realname: {
              $like: '%' + username + '%'
            }
          }
        },
      });
    } else {
      users = await User.findAll();
    }
    return {status: true, data: users};
  }

  export async function saveUser(body) {
    let user = await User.create(body);
    return {status: true, data: user};
  }

  export async function getUserById(id) {
    let user = await User.findById(id);
    if (user) {
      return {status: true, data: user};
    } else {
      return {status: false, msg: '用户id不存在'};
    }
  }

  export async function modifyUserById(id, body) {
    let user = await User.findById(id);
    if (user) {
      user = await user.update(body);
      return {status: true, data: user};
    } else {
      return {status: false, msg: '修改用户id不存在'};
    }
  }

  export async function deleteUserById(id) {
    let user = await User.findById(id);
    if (user) {
      let result = await user.destroy();
      return {status: true, data: result};
    } else {
      return {status: false, msg: '删除用户id不存在'};
    }
  }

  //nested permissions
  export async function getUserPermissionsById(id) {
    let user = await User.findById(id);
    if (user) {
      let permissions = await user.getPermissions();
      return {status: true, data: permissions};
    } else {
      return {status: false, msg: '修改用户id不存在'};
    }
  }

  export async function saveUserPermissionsById(id, body) {
    let user = await User.findById(id);
    if (user) {
      let permissionIds = body['permissionId'];
      let result = await user.addPermissions(permissionIds);
      return {status: true, data: result};
    } else {
      return {status: false, msg: '修改用户id不存在'};
    }
  }

  export async function modifyUserPermissionsById(id, body) {
    let user = await User.findById(id);
    if (user) {
      let permissionIds = body['permissionId'] || [];
      let result = await user.setPermissions(permissionIds);
      return {status: true, data: result};
    } else {
      return {status: false, msg: '修改用户id不存在'};
    }
  }

  //nested groups
  export async function getUserGroupsById(id) {
    let user = await User.findById(id);
    if (user) {
      let groups = await user.getGroups();
      return {status: true, data: groups};
    } else {
      return {status: false, msg: '用户id不存在'};
    }
  }

  export async function saveUserGroupsById(id, body) {
    let user = await User.findById(id);
    if (user) {
      let groupIds = body.groupId;
      let result = await user.addGroups(groupIds);
      return {status: true, data: result};
    } else {
      return {status: false, msg: '修改用户id不存在'};
    }
  }

  export async function modifyUserGroupsById(id, body) {
    let user = await User.findById(id);
    if (user) {
      let groupIds = body.groupId || [];
      let result = await user.setGroups(groupIds);
      return {status: true, data: result};
    } else {
      return {status: false, msg: '修改用户id不存在'};
    }
  }

  //nested routes
  export async function getUserRoutesById(id) {
    let user = await User.findAll({
      where: {id: id},
      include: [Permission, Group]
    });
    if (user[0]) {
      // Get user additional permissions
      let duplicatePermissions = user[0].Permissions;

      // Get user groups permissions and concat to duplicatePermissions
      let groupsWithPermissions = await Group.findAll({
        where: {
          id: {
            $in: _.map(user[0].Groups, 'id')
          }
        },
        include: Permission
      });
      _(groupsWithPermissions).forEach(function (group) {
        duplicatePermissions = _.concat(duplicatePermissions, group.Permissions);
      });

      // Remove duplicate permissions
      let permissions = _.reduce(duplicatePermissions, function (result, each) {
        if (!_.includes(_.map(result, 'id'), each['id'])) {
          result.push(each);
        }
        return result;
      }, []);

      //Get permission's routes
      let permissionsWithRoutes = await Permission.findAll({
        where: {
          id: {
            $in: _.map(permissions, 'id')
          }
        },
        include: Route
      });
      let duplicateRoutes = _.reduce(permissionsWithRoutes, function (result, each) {
        return _.concat(result, each['Routes']);
      }, []);


      //Remove duplicate routes
      let routes = _.reduce(duplicateRoutes, function (result, each) {
        if (!_.includes(_.map(result, 'id'), each.id)) {
          result.push(each);
        }
        return result;
      }, []);

      return {status: true, data: routes};
    } else {
      return {status: false, msg: '修改用户id不存在'};
    }
  }

  //nested channels
  export async function getUserChannelsById(id) {
    let user = await User.findById(id);
    if (user) {
      let channels = await user.getChannels();
      return {status: true, data: channels};
    } else {
      return {status: false, msg: '获取用户id不存在'};
    }
  }

  export async function modifyUserChannelsById(id, body) {
    let user = await User.findById(id);
    if (user) {
      let channelIds = body.channelId || [];
      let result = await user.setChannels(channelIds);
      return {status: true, data: result};
    } else {
      return {status: false, msg: '修改用户id不存在'};
    }
  }

  //nested operate
  export async function getUserOperatesById(id) {
    let user = await User.findById(id);
    if (user) {
      let operates = await user.getOperates();
      return {status: true, data: operates};
    } else {
      return {status: false, msg: '修改用户id不存在'};
    }
  }

  export async function getUserViewOperatesById(id) {
    let user = await User.findAll({
      where: {id: id},
      include: [Operate, Group]
    });
    if (user[0]) {
      // Get user additional operates
      let duplicateOperates = user[0].Operates;

      // Get user groups operates and concat to duplicateOperates
      let groupsWithOperates = await Group.findAll({
        where: {
          id: {
            $in: _.map(user[0].Groups, 'id')
          }
        },
        include: Operate
      });
      _(groupsWithOperates).forEach(function (group) {
        duplicateOperates = _.concat(duplicateOperates, group.Operates);
      });

      // Remove duplicate operates
      let operates = _.reduce(duplicateOperates, function (result, each) {
        if (!_.includes(_.map(result, 'id'), each['id'])) {
          result.push(each);
        }
        return result;
      }, []);

      return {status: true, data: operates};
    } else {
      return {status: false, msg: '修改用户id不存在'};
    }
  }

  export async function saveUserOperatesById(id, body) {
    let user = await User.findById(id);
    if (user) {
      let operateIds = body.operateId;
      let result = await user.addOperates(operateIds);
      return {status: true, data: result};
    } else {
      return {status: false, msg: '修改用户id不存在'};
    }
  }

  export async function modifyUserOperatesById(id, body) {
    let user = await User.findById(id);
    if (user) {
      let operateIds = body.operateId || [];
      let result = await user.setOperates(operateIds);
      return {status: true, data: result};
    } else {
      return {status: false, msg: '修改用户id不存在'};
    }
  }
}

/**
 * To SystemController API
 */
namespace UsersService {
  async function getRoutesByUser(user) {
    if (user) {
      // Get user additional permissions
      let duplicatePermissions = user['Permissions'];

      // Get user groups permissions and concat to duplicatePermissions
      let groupsWithPermissions = await Group.findAll({
        where: {
          id: {
            $in: _.map(user['Groups'], 'id')
          }
        },
        include: Permission
      });
      _(groupsWithPermissions).forEach(function (group) {
        duplicatePermissions = _.concat(duplicatePermissions, group.Permissions);
      });

      // Remove duplicate permissions
      let permissions = _.reduce(duplicatePermissions, function (result, each) {
        if (!_.includes(_.map(result, 'id'), each['id'])) {
          result.push(each);
        }
        return result;
      }, []);

      //Get permission's routes
      let permissionsWithRoutes = await Permission.findAll({
        where: {
          id: {
            $in: _.map(permissions, 'id')
          }
        },
        include: Route
      });
      let duplicateRoutes = _.reduce(permissionsWithRoutes, function (result, each) {
        return _.concat(result, each['Routes']);
      }, []);


      //Remove duplicate routes
      let routes = _.reduce(duplicateRoutes, function (result, each) {
        if (!_.includes(_.map(result, 'id'), each.id)) {
          result.push(each);
        }
        return result;
      }, []);

      return {status: true, data: routes};
    } else {
      return {status: false, text: '该用户不存在'};
    }
  }

  /**
   * 剔除不需要的字段
   */
  async function reduceRoutes(routes) {
    return _.reduce(routes, function (result, each) {
      result.push({id: each['id'], name: each['name'], path: each['path'], type: each['type']});
      return result;
    }, []);
  }

  export async function getRoutesByUserName(username: string) {
    let user = await User.findAll({
      where: {username: username},
      include: [Permission, Group]
    });
    let result = await getRoutesByUser(user[0]);
    if (result.status) {
      let reducedRoutes = await reduceRoutes(result['data']);
      return {status: true, data: reducedRoutes};
    } else {
      return result;
    }
  }

  async function getOperatesById(id) {
    let user = await User.findAll({
      where: {id: id},
      include: [Operate, Group]
    });
    if (user[0]) {
      // Get user additional operates
      let duplicateOperates = user[0]['Operates'];

      // Get user groups operates and concat to duplicateOperates
      let groupsWithOperates = await Group.findAll({
        where: {
          id: {
            $in: _.map(user[0]['Groups'], 'id')
          }
        },
        include: Operate
      });
      _(groupsWithOperates).forEach(function (group) {
        duplicateOperates = _.concat(duplicateOperates, group['Operates']);
      });

      // Remove duplicate operates
      let operates = _.reduce(duplicateOperates, function (result, each) {
        if (!_.includes(_.map(result, 'id'), each['id'])) {
          result.push(each);
        }
        return result;
      }, []);

      return {status: true, data: operates};
    } else {
      return {status: false, text: '修改用户id不存在'};
    }
  }

  export async function getOperatesByUserName(username: string) {
    let user = await User.findAll({
      where: {username: username}
    });
    if (user[0]) {
      let result = await getOperatesById(user[0].id);
      if (result.status) {
        return {status: true, data: result['data']};
      } else {
        return result;
      }
    } else {
      return {status: false, msg: '用户不存在'};
    }
  }
}

/**
 * To ChannelsController API
 */
namespace UsersService {
  export async function getChannelsByUserNameChannelTier(username: string, channelTier: any) {
    let q = {
      attributes: ['id', 'username'],
      where: {username: username},
      include: [Channel],
      order: 'channel_name'
    };
    if (channelTier) {
      q['include'] = [{model: Channel, where: {channel_tier: {$in: channelTier.split(',')}}}];
    }
    let user = await User.findAll(q);
    let channels = user[0]['Channels'];
    let reduceChannels = _.reduce(channels, function (res, each) {
      res.push({
        channel_id: each['channel_id'],
        channel_name: each['channel_name'],
        channel_tier: each['channel_tier']
      });
      return res;
    }, []);
    return {status: true, data: reduceChannels};
  }
}

export default UsersService;