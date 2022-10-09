import request from '@/utils/request'
const api_path = '/admin/cmn/dict'

export default {
    getDictList(id) {
        return request({
            url: `${api_path}/findChildData/${id}`,
            method: 'get'
        })
    }
}