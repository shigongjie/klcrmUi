import request from '@/utils/request'

// 查询列表
export function getPages(query) {
  return request({
    url: '/crm/affiche/page',
    method: 'get',
    params: query
  })
}

// 新增
export function saveAffiche(data) {
  return request({
    url: '/crm/affiche/saveAffiche',
    method: 'post',
    data: data
  })
}

// 查询评论详情
export function discusspage(query) {
  return request({
    url: '/crm/affiche/discuss/page',
    method: 'get',
    params: query
  })
}
// 获取通知人员数量列表
export function afficheinform(query) {
  return request({
    url: '/crm/affiche/look/page',
    method: 'get',
    params: query
  })
}

// 获取通知人员数量
export function informpage(query) {
  return request({
    url: '/crm/affiche/inform/page',
    method: 'get',
    params: query
  })
}
// 公告查看
export function affichelook(data) {
  return request({
    url: '/crm/affiche/look',
    method: 'post',
    data: data
  })
}


export function afficheremove(data) {
  return request({
    url: '/crm/affiche/remove',
    method: 'post',
    data: data
  })
}

export function updateStatues(data) {
  return request({
    url: '/crm/affiche/updateStatus',
    method: 'post',
    data: data
  })
}

export function sendcomment(data) {
  return request({
    url: '/crm/affiche/comment',
    method: 'post',
    data: data
  })
}

export function getIndexNotice(query) {
  return request({
    url: '/crm/affiche/list',
    method: 'get',
    params: query
  })
}