
import request from '@/utils/request'
// 快速搜索列表
export function fastsearchlist(data) {
    return request({
        url: '/crm/commonClue/fast/search/list',
        method: 'post',
        data: data,
    })
}

export function fastsearchsave(data) {
    return request({
        url: '/crm/commonClue/fast/search/save',
        method: 'post',
        data: data,
    })
}
// 删除快速搜索条件
export function fastsearchremove(data) {
    return request({
        url: '/crm/commonClue/fast/search/remove',
        method: 'post',
        data: data,
    })
}
// 置顶快速搜索条件
export function SetSearchtop(data) {
    return request({
        url: '/crm/commonClue/fast/search/top',
        method: 'post',
        data: data,
    })
}