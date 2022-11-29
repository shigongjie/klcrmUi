import request from '@/utils/request'
// 查询用户列表
export function saveNote(query) {
  return request({
    url: '/note/massTexting/saveNote',
    method: 'post',
    data: query
  })
}

// 新增标签
export function noteTemplateList(data) {
  return request({
    url: '/crm/common/noteTemplateList',
    method: 'get',
    params: data
  })
}