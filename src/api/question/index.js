import request from '@/utils/request'

// 问题反馈-查询列表
export function list(query) {
  return request({
    url: '/crm/feedback/page',
    method: 'get',
    params: query
  })
}


// 问题反馈-完成工单
export function operation(data) {
  return request({
    url: '/crm/feedback/operation',
    method: 'put',
    data
  })
}


// 问题反馈-发送推送消息
export function message(data) {
  return request({
    url: '/crm/feedback/send/message/' + data.id + "?sendType=0",
    method: 'post'
  })
}
