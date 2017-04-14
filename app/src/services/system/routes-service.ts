import { SystemModels } from "../../models/system/index";

const {
  Route
} = SystemModels;

namespace RoutesService {
  export async function getRoutes(path: string) {
    let routes = [];
    if (path) {
      routes = await Route.findAll({
        where: {
          path: {
            $like: '%' + path + '%'
          }
        },
      });
    } else {
      routes = await Route.findAll();
    }
    return {status: true, data: routes};
  }

  export async function saveRoute(body) {
    let route = await Route.create(body);
    return {status: true, data: route};
  }

  export async function getRouteById(id) {
    let route = await Route.findById(id);
    if (route) {
      return {status: true, data: route};
    } else {
      return {status: false, msg: '路由id不存在'};
    }
  }

  export async function modifyRouteById(id, body) {
    let route = await Route.findById(id);
    if (route) {
      route = await route.update(body);
      return {status: true, data: route};
    } else {
      return {status: false, msg: '修改路由id不存在'};
    }
  }

  export async function deleteRouteById(id) {
    let route = await Route.findById(id);
    if (route) {
      let result = await route.destroy();
      return {status: true, data: result};
    } else {
      return {status: false, msg: '删除路由id不存在'};
    }
  }
}

export default RoutesService;