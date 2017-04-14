namespace CheckSession {
  export function checkSession() {
    return async (ctx, next) => {
      await next();
    };
  }
}

namespace CheckAPIRoutes {
  export function checkAPIRoutes() {
    return async (ctx, next) => {
      await next();
    };
  }
}


namespace BeforeAPI {
  export const checkSession = CheckSession.checkSession;
  export const checkAPIRoutes = CheckAPIRoutes.checkAPIRoutes;
}

export default BeforeAPI;
