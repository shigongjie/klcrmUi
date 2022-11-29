
import request from '@/utils/request'


// 获取列表
export function checkduplicates(data) {
  return request({
    url: '/crm/checkduplicates/look',
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
