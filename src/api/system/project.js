import request from '@/utils/request'

// 获取平台配置对象-分页
export function listPlatform(query) {
  return request({
    url: '/crm/config/platform/page',
    method: 'get',
    params: query
  })
}

// 新增项目
export function addPlatform(data) {
  return request({
    url: '/crm/config/platform/add',
    method: 'post',
    data
  })
}

// 修改项目
export function editPlatform(data) {
  return request({
    url: '/crm/config/platform/edit',
    method: 'put',
    data
  })
}

// 删除项目
export function deletePlatform(ids) {
  return request({
    url: '/crm/config/platform/' + ids,
    method: 'delete'
  })
}

// 获取客服工单反馈链接
export function getFeedbackLink(ids) {
  return request({
    url: '/crm/config/platform/getFeedback/link/' + ids,
    method: 'get'
  })
}
