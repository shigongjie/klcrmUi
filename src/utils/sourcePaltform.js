import request from '@/utils/request'

let sourcePlatformData = []
request({
  url: '/crm/config/platform/page',
  method: 'get',
  params: {
    pageNum: 1,
    pageSize: 999
  }
}).then(res => {
  res.rows.forEach(el => {
    sourcePlatformData.push({
      key: el.platformType,
      value: el.platformName
    })
  })
})

let sourceTenantPlatformData = []
request({
  url: '/crm/config/platform/tenant/list',
  method: 'get',
  params: {
    // pageNum: 1,
    // pageSize: 999
  }
}).then(res => {
  console.log(res)
  if (res.data) {
    res.data.forEach(el => {
      sourceTenantPlatformData.push({
        key: el.platformType,
        value: el.platformName
      })
    })
  }
})

export {
  sourcePlatformData,
  sourceTenantPlatformData
}
