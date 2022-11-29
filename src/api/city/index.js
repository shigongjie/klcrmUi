import request from '@/utils/request'

// 添加评论
export function getprovinceList(data) {
    return request({
        url: '/pcr/provinceList',
        method: 'get',
        params: data
    })
}

export function getcityList(data) {
    return request({
        url: '/pcr/cityList',
        method: 'get',
        params: data
    })
}

export function getregionList(data) {
    return request({
        url: '/pcr/regionList',
        method: 'get',
        params: data
    })
}