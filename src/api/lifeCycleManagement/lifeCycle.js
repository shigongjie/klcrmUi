import request from '@/utils/request'

// 查询生命周期列表
export function getLifeCycle(query) {
  return request({
    url: '/crm/life/cycle/page',
    method: 'get',
    params: query
  })
}

// 新增生命周期
export function addLifeCycle(data) {
  return request({
    url: '/crm/life/cycle/add',
    method: 'post',
    data: data
  })
}

// 修改生命周期
export function editLifeCycle(data) {
  return request({
    url: '/crm/life/cycle/edit',
    method: 'post',
    data: data
  })
}

// 修改生命周期
export function deleteLifeCycle(data) {
  return request({
    url: '/crm/life/cycle/edit',
    method: 'post',
    data: data
  })
}
