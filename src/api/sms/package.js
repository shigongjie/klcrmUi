
import request from '@/utils/request'


// 列表
export function getlist(data) {
  return request({
    url: '/crm/combo/config/page',
    method: 'get',
    params: data
  })
}
export function getlistByid(data) {
  return request({
    url: '/note/massTexting/getNoteIdByDetails',
    method: 'get',
    params: data
  })
}

export function massTextingdelete(data) {
  return request({
    url: '/note/massTexting/delete',
    method: 'post',
    data: data
  })
}

export function rechargeconfig(data) {
  return request({
    url: '/crm/combo/config/recharge',
    method: 'post',
    data: data
  })
}

export function addCharges(data) {
  return request({
    url: '/crm/phone/recharge/addCharges',
    method: 'post',
    data: data
  })
}
