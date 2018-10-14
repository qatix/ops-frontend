const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  name: state => state.user.name,
  userId: state => state.user.user.id,
  avatar: state => state.user.avatar,
  roles: state => state.user.user.roles,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  // errorLogs: state => state.errorLog.logs
}
export default getters
