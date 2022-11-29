import request from '@/utils/request'
// 获取列表
export function getrolelist(data) {
  return request({
    url: '/crm/role/list',
    method: 'get',
    params: data
  })
}
// 职务启用停用
export function updateStatus(data) {
  return request({
    url: '/crm/role/updateStatus',
    method: 'post',
    data: data
  })
}

// 编辑职务
export function rolesave(data) {
  return request({
    url: '/crm/role/save',
    method: 'post',
    data: data
  })
}
// 删除职务
export function roleremove(data) {
  return request({
    url: '/crm/role/remove',
    method: 'post',
    data: data
  })
}

export function getroledetail(data) {
  return request({
    url: '/crm/role/detail',
    method: 'get',
    params: data
  })
}
// 获取操作权限
export function getRoleMenu(data) {
  return request({
    url: '/crm/role/getRoleMenu',
    method: 'get',
    params: data
  })
}
//   操作权限更新
export function saveRoleMenu(data) {
  return request({
    url: '/crm/role/saveRoleMenu',
    method: 'post',
    data: data
  })
}

// 获取数据权限
export function getdatapermission(data) {
  return request({
    url: '/crm/role/getDataType',
    method: 'get',
    params: data
  })
}

//   数据权限更新
export function saveDatapermission(data) {
  return request({
    url: '/crm/role/saveDataType',
    method: 'post',
    data: data
  })
}

// 获取该部门下成员列表
export function getstaffList(data) {
  return request({
    url: '/crm/role/staffList',
    method: 'get',
    params: data
  })
}

//  获取所有成员
export function userList(data) {
    return request({
      url: '/crm/dept/userList',
      method: 'get',
      params: data
    })
  } 

  // 获取部门下的所有人员
  export function getRoleStaff(data) {
    return request({
      url: '/crm/role/getRoleStaff',
      method: 'get',
      params: data
    })
  }
  // 添加职务下的人员
  export function saveRoleStaff(data) {
    return request({
      url: '/crm/role/saveRoleStaff',
      method: 'post',
      data: data
    })
  }

  // 字段权限
  export function getRoleField(data) {
    return request({
      url: '/crm/role/getRoleField',
      method: 'get',
      params: data
    })
  }
  export function saveRoleField(data) {
    return request({
      url: '/crm/role/saveRoleField',
      method: 'post',
      data: data
    })
  }
  