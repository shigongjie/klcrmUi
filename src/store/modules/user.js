import {
  Notification,
  MessageBox,
  Message,
  Loading
} from 'element-ui'
import {
  login,
  logout,
  getInfo
} from '@/api/login'
import {
  getAdminInfo
} from "@/api/system/user"
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    // 可禄App是否有头部 2没有
    isApp: LukeappApi.getattribute().header,
    // isApp:2,
    name: '',
    // 用户头像
    avatar: '',
    defaultAvatar: require("@/assets/images/defaultAvatar.png"),
    activeIcon: require("@/assets/images/checked.png"),
    inactiveIcon: require("@/assets/images/check.png"),
    roles: [],
    // 当前用户ID
    userId: "",
    // 是否部门管理员1是0不是
    isDeptHead: '',
    permissions: [],
    Logo: '',
    companyName: '',
    callCharges: "0",
    // 是否有套餐
    isComboOpen: true,
  },

  mutations: {
    SET_DEPTHEAD: (state, isDeptHead) => {
      state.isDeptHead = isDeptHead
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_USERID: (state, userid) => {
      state.userId = userid
    },
    SET_LOGO: (state, Logo) => {
      state.Logo = Logo
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_COMPANYNAME: (state, permissions) => {
      state.companyName = permissions
    },
    SET_CALLCHARGES: (state, permissions) => {
      state.callCharges = permissions
    },
    SET_ISCOMBOOPEN: (state, permissions) => {
      state.isComboOpen = permissions
    }
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {

        getAdminInfo().then(res => {
          const avatar = (res.data.avatar == "" || res.data.avatar == null) ? require("@/assets/images/defaultAvatar.png") : res.data.avatar;
          commit('SET_AVATAR', avatar)
          if (res.data.callCharges) {
            commit('SET_CALLCHARGES', res.data.callCharges)
          }
          // if (res.data.isComboOpen) {
          commit('SET_ISCOMBOOPEN', res.data.isComboOpen)
          // }


          // if (res.data.oneLogin) {
          //   Message({
          //     message: "当前登录密码为系统默认密码，请前往个人中心修改密码"
          //   })
          // }
        })
        getInfo().then(res => {
          var link = document.querySelector("link[rel*='icon']");
          link.type = "image/png";
          link.href = res.user.companyLogo;
          const user = res.user
          // const avatar = (user.avatar == "" || user.avatar == null) ? require("@/assets/images/defaultAvatar.png") : user.avatar;
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
            // commit('SET_PERMISSIONS', ['system:dict:add'])
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_DEPTHEAD', user.isDeptHead)
          commit('SET_NAME', user.name)
          commit('SET_USERID', user.id)
          commit('SET_LOGO', user.companyLogo)
          commit('SET_COMPANYNAME', user.companyName)
          // commit('SET_AVATAR', avatar)
          resolve(res)
        }).catch(() => {
          getInfo().then(res => {
            var link = document.querySelector("link[rel*='icon']");
            link.type = "image/png";
            link.href = res.user.companyLogo;
            const user = res.user
            // const avatar = (user.avatar == "" || user.avatar == null) ? require("@/assets/images/defaultAvatar.png") : user.avatar;
            if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
              commit('SET_ROLES', res.roles)
              commit('SET_PERMISSIONS', res.permissions)
              // commit('SET_PERMISSIONS', ['system:dict:add'])
            } else {
              commit('SET_ROLES', ['ROLE_DEFAULT'])
            }
            commit('SET_DEPTHEAD', user.isDeptHead)
            commit('SET_NAME', user.name)
            commit('SET_USERID', user.id)
            commit('SET_LOGO', user.companyLogo)
            // commit('SET_AVATAR', avatar)
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        })
      })
    },

    // 退出系统
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
