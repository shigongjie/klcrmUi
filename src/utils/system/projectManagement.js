// 客户生命周期
export function getStatus() {
  return [{
      key: 0,
      value: '禁用'
    },
    {
      key: 1,
      value: '正常'
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
