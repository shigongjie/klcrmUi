import request from '@/utils/request'


// 列表
export function getlist(data) {
  return request({
    url: '/note/massTexting/list',
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

export function sendNoteMessageSingle(data) {
  return request({
    url: '/note/massTexting/sendNoteMessage',
    method: 'post',
    data: data
  })
}

export function massTextingexport(data) {
  return request({
    url: '/note/massTexting/export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
