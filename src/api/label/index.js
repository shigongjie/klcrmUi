import request from '@/utils/request'
import {
  praseStrEmpty
} from "@/utils/ruoyi";

// 查询用户列表
export function labelPage(query) {
  return request({
    url: '/crm/label/page',
    method: 'get',
    params: query
  })
}

// 新增标签
export function addLabel(data) {
  return request({
    url: '/crm/label/add',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateLabel(data) {
  return request({
    url: '/crm/label/update',
    method: 'post',
    data: data
  })
}

// 删除标签
export function delLabel(data) {
  return request({
    url: '/crm/label/remove',
    method: 'post',
    data: data
  })
}

// 删除标签分组
export function delLabelGroup(data) {
  return request({
    url: '/crm/label/group/remove',
    method: 'post',
    data: data
  })
}

// 查询分组下拉树结构
export function treeselect(query) {
  return request({
    url: '/crm/label/group/page',
    method: 'get',
    params: query
  })
}
// 新增标签分组
export function groupAdd(data) {
  return request({
    url: '/crm/label/group/add',
    method: 'post',
    data: data
  })
}
