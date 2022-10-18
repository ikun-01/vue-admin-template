import request from '@/utils/request'
const api_path = '/admin/user'

export default{
    getPageList(page,limit,searchObj){
        return request({
            url: `${api_path}/${page}/${limit}`,
            method: 'get',
            params: searchObj
        })
    },
    // 锁定和解锁用户
    lock(id,status){
        return request({
            url: `${api_path}/lock/${id}/${status}`,
            method: 'get'
        })
    }, 
    // 查看用户信息
    show(id){
        return request({
            url: `${api_path}/show/${id}`,
            method: 'get'
        })
    },
    // 用户认证
    approval(id,authStatus){
        return request({
            url: `${api_path}/approval/${id}/${authStatus}`,
            method: 'get'
        })
    }
}