/**员工接口 */
import request from '@/utils/request'

export function getstaffList(data) {
  return request({
    url: '/crm/staff/list',
    method: 'get',
    params: data
  })
}

export function saveStaff(data) {
  return request({
    url: '/crm/staff/saveStaff',
    method: 'post',
    data: data
  })
}
export function handleStaff(data) {
  return request({
    url: '/crm/staff/handleStaff',
    method: 'post',
    data: data
  })
}

export function getInfo(data) {
  return request({
    url: '/crm/staff/getInfo',
    method: 'get',
    params: data
  })
}

export function permissionList(data) {
  return request({
    url: '/list',
    method: 'get',
    params: data
  })
}

export function permissionupdate(data) {
  return request({
    url: '/update',
    method: 'post',
    data: data
  })
}

export function staffexport(data) {
  return request({
    url: '/crm/staff/export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

export function getroleList(data) {
  return request({
    url: '/crm/common/roleList',
    method: 'get',
    params: data
  })
}

// 操作权限 
export function getStaffMenu(data) {
  return request({
    url: '/crm/staff/getStaffMenu',
    method: 'get',
    params: data
  })
}
export function saveStaffMenu(data) {
  return request({
    url: '/crm/staff/saveStaffMenu',
    method: 'post',
    data: data
  })
}
// 数据权限
export function getDataType(data) {
  return request({
    url: '/crm/staff/getDataType',
    method: 'get',
    params: data
  })
}
export function saveDataType(data) {
  return request({
    url: '/crm/staff/saveDataType',
    method: 'post',
    data: data
  })
}
// 字段权限
export function getStaffField(data) {
  return request({
    url: '/crm/staff/getStaffField',
    method: 'get',
    params: data
  })
}
export function saveStaffField(data) {
  return request({
    url: '/crm/staff/saveStaffField',
    method: 'post',
    data: data
  })
}

// 获取导入模板
export function getTemplate(data) {
  return request({
    url: '/crm/staff/download',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
// 执行导入
export function performImport(data) {
  return request({
    url: '/crm/staff/analyseImport',
    method: 'post',
    data: data,
  })
}
// 批量导入
export function importAll(data) {
  return request({
    url: '/crm/staff/import',
    method: 'post',
    data: data,
  })
}

// 员工头像上传
export function fileUpload(data) {
  return request({
    headers:{'Content-Type': 'multipart/form-data'},
    url: '/crm/file/upload',
    method: 'post',
    data: data,
  })
}

// 
export function checkStaff(data) {
  return request({
    url: '/crm/staff/checkStaff',
    method: 'post',
    data: data,
  })
}

