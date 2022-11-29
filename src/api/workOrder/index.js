import request from '@/utils/request'
  // 获取工单列表
  export function getWorkOrderList(data) {
    return request({
      url: '/crm/workOrder/list',
      method: 'get',
      params: data
    })
  }
  // 新增工单
  export function addWorkOrder(data) {
    return request({
      url: '/crm/workOrder/saveWork',
      method: 'post', 
      data: data
    })
  }
  // 删除工单
  export function removeWorkOrder(data) {
    return request({
      url: '/crm/workOrder/remove',
      method: 'post', 
      data: data
    })
  }
  // 获取企业名单
  export function getCustomerList(data) {
    return request({
      url: '/crm/common/customerList',
      method: 'get', 
      params: data
    })
  }
   // 获取工单详情
   export function getWorkDetail(data) {
    return request({
      url: '/crm/workOrder/getWorkDetail',
      method: 'get', 
      params: data
    })
  }
  // 获取工单访问列表
  export function getWorkLook(data) {
    return request({
      url: '/crm/workOrder/getVisitByWorkId',
      method: 'get', 
      params: data
    })
  }
   // 获取工单评论通用
   export function getWorkComment(data) {
    return request({
      url: '/crm/common/getCommentByFkId',
      method: 'get', 
      params: data
    })
  }
  //分配工单
  export function changeTaskOrder(data) {
    return request({
      url: '/crm/workOrder/allocatingTaskOrder',
      method: 'post', 
      data: data
    })
  }
  
  // 导出工单列表
  export function workOrderExport(data) {
    return request({
      url: '/crm/workOrder/export',
      method: 'post', 
      data: data,
      responseType: 'blob'
    })
  }
  // 工单动态存储
  export function saveDynamic(data) {
    return request({
      url: '/crm/common/saveDynamic',
      method: 'post', 
      data: data,

    })
  }
  //查询工单状态
  export function getDynamic(data) {
    return request({
      url: '/crm/common/getDynamicsByFkId',
      method: 'get', 
      params: data,

    })
  }
  // 获取部门
  export function getDeptTree(data) {
    return request({
      url: '/crm/common/deptTree',
      method: 'get', 
      params: data,

    })
  }
  // 获取部门2
  export function getDeptTree2(data) {
    return request({
      url: '/crm/common/deptTree2',
      method: 'get', 
      params: data,

    })
  }
  // 撤销0 ,退回1, 完成工单 2 --status
    export function workSendBack(data) {
      return request({
        url: '/crm/workOrder/workSendBack',
        method: 'post', 
        data: data,

      })
    }
    // 编辑回显
    export function getWorkDetailById(data) {
      return request({
        url: '/crm/workOrder/getWorkDetailById',
        method: 'get', 
        params: data,
  
      })
    }
  
  
  
  
