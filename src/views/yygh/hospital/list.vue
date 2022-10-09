<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchObj" class="demo-form-inline">
      <el-form-item label="医院名称">
        <el-input v-model="searchObj.hosname" placeholder="医院名称"></el-input>
      </el-form-item>
      <el-form-item label="医院编号">
        <el-input v-model="searchObj.hoscode" placeholder="医院编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clearData()">清空</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="removeRows()">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table 
      :data="rows"
      style="width: 100%"
      v-loading="loading"
      element-loading-text="数据加载中"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>

      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          <span v-text="scope.$index + 1 + (page - 1) * limit"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="hosname"
        label="医院名称"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="hoscode"
        label="医院编号"
        width="100"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="apiUrl" label="API地址" align="center">
      </el-table-column>
      <el-table-column prop="contactsName" label="联系人" align="center" width="80">
      </el-table-column>
      <el-table-column prop="contactsPhone" label="联系方式" align="center">
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" width="50">
        <template slot-scope="scope">
          <span v-text="scope.row.status === 0 ? '锁定' : '正常'"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
          <router-link :to="'/yygh/hospset/edit/' + scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit" plain
              >修改</el-button
            >
          </router-link>
          &nbsp;
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
            >删除</el-button
          >
          <el-button
            v-if="scope.row.status === 1"
            type="danger"
            size="small"
            icon="el-icon-lock"
            plain
            @click="lockHospSet(scope.row.id, 0)"
            >锁定</el-button
          >
          <el-button
            v-if="scope.row.status === 0"
            type="success"
            size="small"
            icon="el-icon-unlock"
            plain
            @click="lockHospSet(scope.row.id, 1)"
            >解锁</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      style="padding: 30px 0; text-align: center"
      @size-change="pageSizeChange"
      @current-change="fetchData"
      :current-page="page"
      :page-sizes="[3, 5, 7, 9]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>


<script>
import hospital from "@/api/yygh/hospital"
export default {
  data() {
    return {
      rows: [], // 返回的数据
      page: 1, // 查询第几页数据
      limit: 3, // 每页几条数据
      total: 0, // 总记录数
      searchObj: {}, //查询条件对象
      multipleSelection: [], // 记录选中的信息  每一个对象
      loading: false // 数据加载画面
    }
  },
  methods: {
    // 查询所有不分页
    findAll() {
      hospital.findAll().then((response) => {
        this.rows = response.data.list
      })
    },
    // 根据条件查询 分页
    fetchData(page = 1) {
      this.loading = true
      this.page = page
      hospital
        .getPageList(this.page, this.limit, this.searchObj)
        .then((response) => {
          this.loading = false
          this.rows = response.data.rows
          this.total = response.data.total
        })
    },
    // 清空操作
    clearData() {
      this.searchObj = {}
      this.fetchData()
    },
    // 修改每页记录数
    pageSizeChange(val) {
      this.limit = val
      this.fetchData()
    },
    // 根据id移除一条数据
    removeDataById(id) {
      this.$confirm("确定要删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return hospital.removeById(id)
        })
        .then(() => {
          if(this.rows.length === 1 && this.page > 1){
            this.fetchData(this.page - 1)
          }else{
            this.fetchData(this.page)
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          })
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '取消删除!',
          })
        })
    },
    // 锁定和解锁
    lockHospSet(id, status) {
      this.$confirm('确定要执行该操作吗?','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        hospital.lockHospSet(id, status)
        .then((response) => {
          this.$message({
            type:'success',
            message: '操作成功'
          })
          this.fetchData(this.page)
        })
      })
      .catch(() => {
        this.$message({
          type: 'error',
          message: '取消'
        })
      })

    },
    // 批量删除
    removeRows(){
      this.$confirm('此操作将永久删除医院是设置信息, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => { 
      var idList = this.multipleSelection.map(item => item.id)
      hospital.removeRows(idList)
        .then(reponse => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            
          })
          this.fetchData()
        })
      })
      .catch(() => {
        this.$message({
          type: 'error',
          message: '取消删除'
        })
      }) 
    },
    // 选中每个项
    handleSelectionChange(selection){
      this.multipleSelection = selection
    }
  },

  created() {
    // this.findAll()
    this.fetchData()
  }
}
</script>
