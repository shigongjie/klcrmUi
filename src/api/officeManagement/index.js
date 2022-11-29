import request from '@/utils/request'

// 查询日程
export function business(data) {
  return request({
    url: '/crm/schedule/page',
    method: 'get',
    params: data
  })
}

// 添加日程---编辑日程
export function saveSchedule(data) {
  return request({
    url: '/crm/schedule/saveSchedule',
    method: 'post',
    data
  })
}
// 编辑日程
export function scheduleSchedule(data) {
  return request({
    url: '/crm/schedule/alter',
    method: 'get',
    params: data
  })
}
// 删除日程
export function delSchedule(data) {
  return request({
    url: '/crm/schedule/delete/schedule',
    method: 'post',
    data
  })
}
// 操作人员下拉
export function staffList() {
  return request({
    url: '/crm/common/staffList',
  })
}
// 获取导入数据
export function workleadPage(data) {
  return request({
    url: '/crm/worklead/page',
    params: data
  })
}
// 获取导出数据 
export function workexportPage(data) {
  return request({
    url: '/crm/workexport/page',
    params: data
  })
}
// 导出删除
export function delData(data) {
  return request({
    url: '/crm/workexport/delete',
    method: 'post',
    data
  })
}
// 工作报告--数据List
export function workreportPage(data) {
  return request({
    url: '/crm/workreport/page',
    params: data
  })
}
// 工作报告--详情
export function particularsData(data) {
  return request({
    url: '/crm/workreport/detail',
    params: data
  })
}
// 工作报告--更新
export function savereport(data) {
  return request({
    url: '/crm/workreport/savereport',
    method: 'post',
    data
  })
}
// 工作报告-报告删除    
export function detailRremove(data) {
  return request({
    url: '/crm/workreport/detail/remove',
    method: 'post',
    data
  })
}
// 报告导出   
export function workreportDerive(data) {
  return request({
    url: '/crm/workreport/derive',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
// 添加评论接口
export function addComment(data) {
  return request({
    url: '/crm/common/saveComment',
    method: 'post',
    data,
  })
}



// 报告详情--编辑详情  
export function workreportAlter(data) {
  return request({
    url: '/crm/workreport/alter',
    params: data
  })
}


// 下属---下拉框
export function commonSubordinateList2() {
  return request({
    url: '/crm/common/subordinateList2',
  })
}

export function workreporthomepage(data) {
  return request({
    url: '/crm/workreport/homepage',
    method: 'get',
    params: data
  })
}

