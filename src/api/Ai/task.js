import request from '@/utils/request'


// 公海客户列表
export function getcalltasklist(data) {
  return request({
    url: '/crm/task/getMyTask',
    method: 'get',
    params: data
  })
}
// 分页查询
export function callpage(data) {
  return request({
    url: '/crm/api/call/page',
    method: 'get',
    params: data
  })
}
export function getlistByid(data) {
  return request({
    url: '/crm/task/detail/list',
    method: 'get',
    params: data
  })
}

// 创建单点外呼任务
export function tasksave(data) {
  return request({
    url: '/crm/task/save',
    method: 'post',
    data: data
  })
}

// 获取Ai外呼任务列表
export function getAiList(data) {
  return request({
    url: '/crm/ai/task/list',
    method: 'get',
    params: data
  })
}
// 创建AI外呼任务
export function aitasksave(data) {
  return request({
    url: '/crm/ai/task/save',
    method: 'post',
    data: data
  })
}
// ai任务详情任务详情
export function aitaskdetailList(data) {
  return request({
    url: '/crm/ai/task/detailList',
    method: 'get',
    params: data
  })
}
// 删除ai任务
export function aiTaskRemove(data) {
  return request({
    url: '/crm/ai/task/removeTask',
    method: 'post',
    data: data
  })
}

// 启动ai任务
export function aiStartTask(data) {
  return request({
    url: '/crm/ai/task/startTask',
    method: 'post',
    data: data
  })
}

// 暂停ai任务
export function aiPauseTask(data) {
  return request({
    url: '/crm/ai/task/pauseTask',
    method: 'post',
    data: data
  })
}

export function getPcAiList(data) {
  return request({
    url: '/crm/task/list',
    method: 'get',
    params: data
  })
}

// 导出ai外呼记录列表
export function taskDetailExport(data) {
  return request({
    url: '/crm/ai/task/detailExport',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

