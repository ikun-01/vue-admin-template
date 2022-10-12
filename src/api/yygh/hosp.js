import request from '@/utils/request'
const api_name = '/admin/hosp/hospital'


export default {
    // 查找医院信息
    getPageList(page,limit,searchObj){
        return request({
            url: `${api_name}/${page}/${limit}`,
            method: 'get',
            params: searchObj //当请求体数据不是json时使用params
        })
    },
    // 查找所有的省
    getByDictCode(dictCode){
        return request({
            url: `/admin/cmn/dict/findByDictCode/${dictCode}`,
            method: 'get'
        })
    },
    // 根据省查找所有的下级信息
    getByParentId(parentId){
        return request({
            url: `/admin/cmn/dict/findChildData/${parentId}`,
            method: 'get'
        })
    },
    // 更新医院状态信息
    updateStatus(id,status){
        return request({
            url: `${api_name}/updateStatus/${id}/${status}`,
            method: 'put'
        })
    },
    // 查看医院详情
    getHospitalById(id){
        return request({
            url: `${api_name}/show/${id}`,
            method: 'get'
        })
    }
}