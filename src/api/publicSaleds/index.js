import request from '@/utils/request'
// 获取组织树
export function commonCluelist(data) {
  return request({
    url: '/crm/xs/list',
    method: 'get',
    params: data
  })
}
// 复制线索
export function copyMarketClue(data) {
  return request({
    url: '/crm/xs/copy',
    method: 'post',
    data: data
  })
}
export function getareaList(data) {
  return request({
    url: '/crm/common/pcList',
    method: 'get',
    params: data
  })
}

export function getIndustryList(data) {
  return request({
    url: '/crm/xs/industryList',
    method: 'get',
    params: data
  })
}

export function checkSearching(data) {
  return request({
    url: '/crm/commonClue/checkSearching',
    method: 'get',
    params: data
  })
}


// h5公共线索详情
export function xsdetail(data) {
  return request({
    url: '/crm/xs/detail',
    method: 'get',
    params: data
  })
}

