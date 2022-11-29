import request from '@/utils/request'


// 获取列表
export function getTreeData(data) {
  return request({
    url: '/crm/controller/classifypage',
    method: 'get',
    params: data
  })
}

export function update(data) {
  return request({
    url: '/crm/controller/saveClassify',
    method: 'post',
    data: data
  })
}

export function saveCommon(data) {
  return request({
    url: '/crm/controller/saveCommon',
    method: 'post',
    data: data
  })
}

export function contentpage(data) {
  return request({
    url: '/crm/controller/contentpage',
    method: 'get',
    params: data
  })
}

export function commonremove(data) {
  return request({
    url: '/crm/controller/common/remove',
    method: 'post',
    data: data
  })
}



export function classifyremove(data) {
  return request({
    url: '/crm/controller/classify/remove',
    method: 'post',
    data: data
  })
}