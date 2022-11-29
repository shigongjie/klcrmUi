import request from '@/utils/request'
// 获取组织树
export function getdeptTree(data) {
    return request({
      url: '/crm/dept/deptTree',
      method: 'get',
      params: data
    })
  }
// 组织列表
  export function getdeptlist(data) {
    return request({
      url: '/crm/dept/list',
      method: 'get',
      params: data
    })
  }
// 部门启用停用
  export function updateDeptStatus(data) {
    return request({
      url: '/crm/dept/updateStatus',
      method: 'post',
      data: data
    })
  }

  export function saveDeptpid(data) {
    return request({
      url: '/crm/dept/save',
      method: 'post',
      data: data
    })
  }

  export function deptremove(data) {
    return request({
      url: '/crm/dept/remove',
      method: 'post',
      data: data
    })
  }
  
  