import request from '@/utils/request'
// 后端接口的api地址
const api_name = '/admin/hosp/hospitalSet'

export default {
    // 查找所有医院设置信息不进行分页
    findAll() {
        return request({
            // 请求地址
            url: `${api_name}/findAll`,
            // 请求方式
            method: 'get'
        })
    },
    // 条件分页查询
    getPageList(page,limit,searchObj) {
        return request({
            url: `${api_name}/${page}/${limit}`,
            method: 'post',
            data: searchObj
        })
    },
    // 根据id删除数据(逻辑删除)
    removeById(id){
        return request({
            url: `${api_name}/${id}`,
            method: 'delete'
        })
    },
    // 锁定和解锁操作
    lockHospSet(id,status){
        return request({
            url: `${api_name}/lockHospitalSet/${id}/${status}`,
            method: 'put'
        })
    },
    // 添加医院信息
    saveData(hospset){
        return request({
            url: `${api_name}/saveHospSet`,
            method: 'post',
            data: hospset
        })
    },
    // 数据回显,根据id获取信息
    getById(id){
        return request({
            url: `${api_name}/getHospSet/${id}`,
            method: 'get'
        })
    },
    // 通过id更新数据
    updateById(hospset){
        return request({
            url: `${api_name}/updateHospSet`,
            method: 'put',
            data: hospset
        })
    },
    // 批量删除
    removeRows(idList){
        return request({
            url: `${api_name}/batchRemove`,
            method: 'delete',
            data: idList
        })
    }

}