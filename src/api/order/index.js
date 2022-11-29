
import request from '@/utils/request'

// 查询日程
export function orderpage(data) {
  return request({
    url: '/crm/order/page',
    method: 'get',
    params: data
  })
}

// 添加日程---编辑日程
export function saveSchedule(data) {
  return request({
    url: '/crm/schedule/saveSchedule',
    method: 'post',
    data
  })
}