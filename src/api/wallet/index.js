import request from '@/utils/request'
export function getList(data) {
  return request({
    url: '/crm/ai/recharge/list',
    method: 'get',
    params: data
  })
}
export function rechargesave(data) {
  return request({
    url: '/crm/ai/recharge/save',
    method: 'post',
    data: data
  })
}
export function getusageList(data) {
  return request({
    url: '/crm/ai/recharge/usageRecord',
    method: 'get',
    params: data
  })
}
export function getConfig(data) {
  return request({
    url: '/crm/ai/recharge/getConfig',
    method: 'get',
    params: data
  })
}
