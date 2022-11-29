// 客户生命周期
export function getStatus() {
  return [{
      key: 0,
      value: '处理中'
    },
    {
      key: 1,
      value: '已处理'
    },
    {
      key: 2,
      value: '已驳回'
    },
    {
      key: 3,
      value: '已作废'
    }
  ]
}

export function useStatusRender(text) {
  var maps = getStatus()
  for (var i = 0; i < maps.length; i++) {
    var map = maps[i]
    if (map.key == text) {
      return map.value;
    }
  }
}


import {
  sourcePlatformData,
  sourceTenantPlatformData
} from '@/utils/sourcePaltform'
// 来源平台
export function getSourcePlatform() {
  return sourcePlatformData;
}

export function useSourcePlatformRender(text) {
  var maps = getSourcePlatform()
  for (var i = 0; i < maps.length; i++) {
    var map = maps[i]
    if (map.key == text) {
      return map.value;
    }
  }
}

// 租户来源平台
export function getTenantSourcePlatform() {
  return sourceTenantPlatformData;
}

export function useTenantSourcePlatformRender(text) {
  var maps = getTenantSourcePlatform()
  for (var i = 0; i < maps.length; i++) {
    var map = maps[i]
    if (map.key == text) {
      return map.value;
    }
  }
}
