import request from '@/utils/request'
import { List } from 'vant'


// 获取列表
export function chatlist(data) {
  return request({
    url: '/crm/cs/chat/list',
    method: 'get',
    params: data
  })
}

export function update(data) {
  return request({
    url: '/crm/checkduplicates/update',
    method: 'post',
    data: data
  })
}
// 获取会话常用语
export function commonTermsList(data) {
  return request({
    url: '/crm/cs/chat/commonTermsList',
    method: 'get',
    params: data
  })
}

export function chatdetail(data) {
  return request({
    headers: {
      isToken: false
    },
    url: '/crm/cs/chat/detail',
    method: 'get',
    params: data
  })
}

export function chatread(data) {
  return request({
    url: '/crm/cs/chat/read',
    method: 'post',
    data: data
  })
}

export function chatremove(data) {
  return request({
    url: '/crm/cs/chat/remove',
    method: 'post',
    data: data
  })
}

export function chataccess(data) {
  return request({
    url: '/crm/cs/chat/access',
    method: 'post',
    data: data
  })
}

export function chatgetSid(data) {
  return request({
    url: '/crm/cs/chat/getSid',
    method: 'get',
    params: data
  })
}

// 接入渠道

export function channellist(data) {
  return request({
    url: '/crm/platform/channel/list',
    method: 'get',
    params: data
  })
}

export function platformsave(data) {
  return request({
    url: '/crm/platform/channel/save',
    method: 'post',
    data: data
  })
}

export function getDatailById(data) {
  return request({
    url: '/crm/platform/channel/getDatailById',
    method: 'get',
    params: data
  })
}
// 访客列表
export function visitorlistpage(data) {
  return request({
    url: '/crm/visitorlist/page',
    method: 'get',
    params: data
  })
}

export function visitordelete(data) {
  return request({
    url: '/crm/visitorlist/delete/visitor',
    method: 'post',
    data: data
  })
}
export function platformChannelList(data) {
  return request({
    url: '/crm/common/platformChannelList',
    method: 'get',
    params: data
  })
}



// 客服状态
export function getStatus(data) {
  return request({
    url: '/crm/cs/chat/getStatus',
    method: 'get',
    params: data
  })
}

export function updateStatus(data) {
  return request({
    url: '/crm/cs/chat/updateStatus',
    method: 'get',
    params: data
  })
}
//

export function channeldelete(data) {
  return request({
    url: '/crm/platform/channel/delete',
    method: 'post',
    data: data
  })
}

export function getCsData(data) {
  return request({
    url: '/crm/cs/chat/getCsData',
    method: 'get',
    params: data
  })
}
//

export function removeSelect(data) {
  return request({
    url: '/crm/cs/chat/removeSelect',
    method: 'post',
    data: data
  })
}

export function getSIPAccount(data) {
  return request({
    url: '/single/call/getSIPAccount',
    method: 'get',
    params: data
  })
}

export function getCallNum(data) {
  return request({
    url: '/single/call/getCallNum',
    method: 'get',
    params: data
  })
}

export function addCallNum(data) {
  return request({
    url: '/single/call/addCallNum',
    method: 'post',
    data: data
  })
}

export function reduceCallNum(data) {
  return request({
    url: '/single/call/reduceCallNum',
    method: 'post',
    data: data
  })
}

export function recordssave(data) {
  return request({
    url: '/crm/call/records/save',
    method: 'post',
    data: data
  })
}

export function recordslist(data) {
  return request({
    url: '/crm/call/records/list',
    method: 'get',
    params: data
  })
}

export function hangupCall(data) {
  return request({
    url: '/crm/call/records/hangupCall',
    method: 'get',
    params: data
  })
}

// 外呼记录导出
export function exportCall(data) {
  return request({
    url: '/crm/call/records/export',
    method: 'post',
    data: data ,
    responseType: 'blob'
  })
}






