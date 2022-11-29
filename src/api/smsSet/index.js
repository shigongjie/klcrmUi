import request from '@/utils/request'


// 列表
export function getlist(data) {
  return request({
    url: '/note/config/list',
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

export function saveNoteConfig(data) {
  return request({
    url: '/note/config/saveNoteConfig',
    method: 'post',
    data: data
  })
}

export function deleteconfig(data) {
  return request({
    url: '/note/config/delete',
    method: 'post',
    data: data
  })
}

export function getNoteConfigById(data) {
  return request({
    url: '/note/config/getNoteConfigById',
    method: 'get',
    params: data
  })
}


export function updateNoteConfig(data) {
    return request({
      url: '/note/config/updateNoteConfig',
      method: 'post',
      data: data
    })
  }

