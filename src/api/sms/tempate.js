import request from '@/utils/request'


// 列表
export function getlist(data) {
  return request({
    url: '/crm/note/page',
    method: 'get',
    params: data
  })
}

export function lookTemplate(data) {
    return request({
      url: '/crm/note/lookTemplate',
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

export function saveNoteTemplate(data) {
  return request({
    url: '/crm/note/saveNoteTemplate',
    method: 'post',
    data: data
  })
}

export function noteremove(data) {
    return request({
      url: '/crm/note/remove',
      method: 'post',
      data: data
    })
  }
