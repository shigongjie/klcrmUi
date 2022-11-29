import request from '@/utils/request'


// 公海客户列表
export function getlist(data) {
  return request({
    url: '/crm/api/call/customerList',
    method: 'get',
    params: data
  })
}
// 分页查询
export function callpage(data) {
  return request({
    url: '/crm/api/call/page',
    method: 'get',
    params: data
  })
}
export function detail(data) {
    return request({
      url: '/crm/api/call/detail',
      method: 'get',
      params: data
    })
  }

// 创建AI外呼任务
export function callsave(data) {
  return request({
    url: '/crm/api/call/save',
    method: 'post',
    data: data
  })
}
