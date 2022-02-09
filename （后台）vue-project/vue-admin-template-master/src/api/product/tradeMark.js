// 获取品牌管理的数据模块
import request from '@/utils/request';
// 获取品牌列表接口
// /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })


// 处理添加品牌的操作
// 新增品牌:  /admin/product/baseTrademark/save   post   携带两个参数:品牌名称,品牌logo
// 对于新增的品牌,不需要给服务器传递id,id是由服务器生成的

// 修改品牌
// /admin/product/baseTrademark/update    put   
// id   名称    logo
export const reqAddOrUpdateTradeMark = (trademark) => {

    if (trademark.id) {
        // 修改
        return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: trademark })
    } else {
        // 新增
        return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: trademark });
    }
}

// 删除品牌
// /admin/product/baseTrademark/remove/{id}
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })