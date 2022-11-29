import request from '@/utils/request'

// 添加评论
export function SendComment(data) {
  return request({
    url: '/crm/common/saveComment',
    method: 'post',
    data: data
  })
}
// 删除评论
export function deleCommentById(data) {
  return request({
    url: '/crm/common/deleCommentById',
    method: 'post',
    data: data
  })
}
// 字段权限
// type 0线索 1客户 2联系人
export function getShowList(data) {
  return request({
    url: '/crm/common/showList',
    method: 'get',
    params: data
  })
}

export function getMessage(data) {
  return request({
    url: '/crm/login/getMessage',
    method: 'get',
    params: data
  })
}

export function scheduletoday(data) {
  return request({
    url: '/crm/schedule/list/today',
    method: 'get',
    params: data
  })
}

export function uploadFile(data) {
  return request({
    url: 'crm/file/upload',
    method: 'post',
    data: data
  })
}

export function hasread(data) {
  return request({
    url: '/crm/login/readMessage',
    method: 'post'
  })
}
