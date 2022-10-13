<template>
    <div class = "app-container">
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="省份">
                <el-select v-model="searchObj.provinceCode" 
                placeholder="请选择省"
                @change="provinceChanged">
                    <el-option v-for="item in provinceList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="城市">
                <el-select v-model="searchObj.cityCode" placeholder="请选择市">
                    <el-option v-for="item in cityList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="医院名称">
                <el-input v-model="searchObj.hosname" placeholder="医院名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="fetchData()" icon="el-icon-search">查询</el-button>
                <el-button type="info" @click="resetData">清空</el-button>
            </el-form-item>
        </el-form> 
            <!-- banner列表 -->
        <el-table v-loading="listLoading" :data="list"
                border
            fit
            highlight-current-row>

            <el-table-column
            label="序号"
            width="60"
            align="center">
                <template slot-scope="scope">
                    <span v-text="(page - 1) * limit + scope.$index + 1"></span>
                        <!-- {{ (page - 1) * limit + scope.$index + 1 }} -->
                </template>
            </el-table-column>

            <el-table-column label="医院logo">
                <template slot-scope="scope">
                <img :src="'data:image/jpeg;base64,'+scope.row.logoData" width="80">
                </template>
            </el-table-column>

            <el-table-column prop="hosname" label="医院名称"/>
            <el-table-column prop="param.hosType" label="等级" width="90"/>
            <el-table-column prop="param.fullAddress" label="详情地址"/>
            <el-table-column label="状态" width="80">
                <template slot-scope="scope">
                        <!-- {{ scope.row.status === 0 ? '未上线' : '已上线' }} -->
                        <span v-text="scope.row.status === 0 ? '未上线' : '已上线'"></span>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间"/>

            <el-table-column label="操作" width="230" align="center">
                <template slot-scope="scope">
                    <router-link :to="'/yygh/hospSet/hospital/show/'+scope.row.id">
                        <el-button type="primary" size="mini">查看</el-button>
                    </router-link>
                    <router-link :to="'/yygh/hospSet/hospital/schedule/'+scope.row.hoscode">
                        <el-button type="primary" size="mini">排班</el-button>
                    </router-link>

                    <el-button v-if="scope.row.status == 1"  type="danger" size="mini" @click="updateStatus(scope.row.id, 0)">下线</el-button>
                    <el-button v-if="scope.row.status == 0"  type="success" size="mini" @click="updateStatus(scope.row.id, 1)">上线</el-button>
                </template>

            </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination
            :current-page="page"
            :total="total"
            :page-size="limit"
            :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
            style="padding: 30px 0; text-align: center;"
            layout="sizes, prev, pager, next, jumper, ->, total, slot"
            @current-change="fetchData"
            @size-change="changeSize"
        />
           
    </div>    
</template>

<script>

import hospApi from '@/api/yygh/hosp'

export default {
    data() {
        return {
            list: [],
            total: 0,
            page: 1,
            limit: 10,
            searchObj: {
                provinceCode: '',
                cityCode: '',
                hosname: ''
            },
            provinceList: [],
            cityList: [],
            listLoading: false
        }
    },
    methods: {
        // 查找所有的省
        findByDictCode(dictCode){
            hospApi.getByDictCode(dictCode)
                .then(response => {
                    this.provinceList = response.data.list
                })
        },
        // 分页查找医院的信息
        fetchData(page = 1){
            this.page = page
            this.listLoading = true
            hospApi.getPageList(this.page,this.limit,this.searchObj)
                .then(response => {
                    this.listLoading = false
                    // 每页数据集合
                    this.list = response.data.pages.content
                    // 总记录数
                    this.total = response.data.pages.totalElements
                })
        },
        // 查找所有的城市
        findByParentId(id){
            hospApi.getByParentId(id)
                .then(response => {
                    this.cityList = response.data.list
                })
        },
        // 选择某个省
        provinceChanged(){
            // 将市列表清空
            this.cityList = []
            // 查询条件市也清空
            this.searchObj.cityCode = ''
            // 查找该省份下的所有城市信息
            this.findByParentId(this.searchObj.provinceCode)
        },
        // 更新医院状态信息
        updateStatus(id,status){
          hospApi.updateStatus(id,status)  
            .then(response => {
                if (response.code === 20000){
                    this.fetchData(this.page)
                }
            })
        },
        // 清除搜索信息
        resetData(){
            this.searchObj = {
                provinceCode: '',
                cityCode: '',
                hosname: ''
            }
            this.cityList = []
            this.fetchData()
        },
        // 改变每页数量
        changeSize(size){
            this.limit = size
            this.fetchData()
        }
        

    },
    created(){
        // 查找所有的省
        this.findByDictCode('Province')
        // 查找医院列表信息
        this.fetchData()
    }
}
</script>
