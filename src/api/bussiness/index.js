import request from '@/utils/request'


// 获取列表
export function getlist(data) {
  return request({
    url: '/crm/company/list',
    method: 'get',
    params: data
  })
}
// 获取详情
export function getcompanyDetail(data) {
  return request({
    url: '/crm/company/getInfo',
    method: 'get',
    params: data
  })
}
// 新增公司
export function Addcompany(data) {
  return request({
    url: '/crm/company/save',
    method: 'post',
    data: data
  })
}
//删除公司
export function delcompany(data) {
  return request({
    url: '/crm/company/remove',
    method: 'post',
    data: data
  })
}
// 查询地区

export function findAreaByPid(data) {
  return request({
    url: '/crm/area/list',
    method: 'get',
    params: data
  })
}

// 设置使用期限
export function setPeriod(data) {
  return request({
    url: '/crm/company/setPeriod',
    method: 'post',
    data: data
  })
}

// 企业重置密码
export function resetPassword(data) {
  return request({
    url: '/crm/company/resetPassword',
    method: 'post',
    data: data
  })
}
// 获取企业限制
export function getCompanyLimit(data) {
  return request({
    url: '/crm/company/getCompanyLimit',
    method: 'get',
    params: data
  })
}
// 保存企业限制
export function saveCompanyLimit(data) {
  return request({
    url: '/crm/company/saveCompanyLimit',
    method: 'post',
    data: data
  })
}
// 获取模块配置
export function getCompanyModule(data) {
  return request({
    url: '/crm/company/getCompanyModule',
    method: 'get',
    params: data
  })
}
// 修改模块配置
export function updateCompanyModule(data) {
  return request({
    url: '/crm/company/updateCompanyModule',
    method: 'post',
    data: data
  })
}



// 操作日志
export function logpage(data) {
  return request({
    url: '/crm/opera/staffLog/page',
    method: 'get',
    params: data
  })
}
// 登录日志
export function loginlog(data) {
  return request({
    url: '/crm/login/log/page',
    method: 'get',
    params: data
  })
}

export function companyexport(data) {
  return request({
    url: '/crm/company/export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

export function getlogList(data) {
  return request({
    url: '/crm/role/logList',
    method: 'get',
    params: data
  })
}