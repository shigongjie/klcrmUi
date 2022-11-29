import request from '@/utils/request'
// 获取任务详情列表
export function taskpage(data) {
  return request({
    url: '/crm/work/page',
    method: 'get',
    params: data
  })
}
// 
export function detaildetail(data) {
  return request({
    url: '/crm/work/detail',
    method: 'get',
    params: data
  })
}
export function detailremove(data) {
  return request({
    url: '/crm/work/detail/remove',
    method: 'post',
    data: data
  })
}

export function detailById(data) {
  return request({
    url: '/crm/work/getBy',
    method: 'get',
    params: data
  })
}
// 获取评论列表
export function getCommentByFkId(data) {
  return request({
    url: '/crm/common/getCommentByFkId',
    method: 'get',
    params: data
  })
}

// 导出
export function workderive(data) {
  return request({
    url: '/crm/work/derive',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

// 取消任务
export function detailCancel(data) {
  return request({
    url: '/crm/work/detail/cancel',
    method: 'post',
    data: data,
  })
}
// 处理任务
export function accomplishTask(data) {
  return request({
    url: '/crm/work/detail/accomplish',
    method: 'post',
    data: data,
  })
}



