<template>
  <div class="app-container">
    <div class="el-toolbar">
      <el-button type="success" @click="exportData" plain><i class="fa fa-plus"/>导出数据</el-button>
      <el-button type="primary" @click="importData" plain><i class="fa fa-plus"/>导入数据</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="list"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="数据字典名称" width="180"> </el-table-column>
      <el-table-column prop="value" label="值" width="180"> </el-table-column>
      <el-table-column prop="dictCode" label="编码" width="180"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
    </el-table>
    <!-- 上传文件弹出层 -->
    <el-dialog title="导入数据" :visible.sync="dialogFormVisible" width="500px">
      <el-form label-position="right" label-width="170px">
        <el-form-item label="文件">
          <el-upload
            class="upload-demo"
            :action="'http://localhost:9001/admin/cmn/dict/importData'"
            :multiple="false"
            :on-success="onUploadSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xls文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dictApi from '@/api/yygh/dict'
export default {
  data() {
    return {
      list: [],
      loading: false,
      dialogFormVisible: false // 控制弹出层
    }
  },
  methods: {
    load(tree, treeNode, resolve) {
      dictApi.getDictList(tree.id)
        .then(response => {
          setTimeout(() => {
            resolve(response.data.list)
          }, 100)
        })
        
    },
    // 获取数据字典列表
    getDictList(id){
      this.loading = true
      dictApi.getDictList(id)
        .then(response => {
          this.loading = false
          this.list = response.data.list
        })
    },
    // 文件导出
    exportData(){
      window.open("http://localhost:8202/admin/cmn/dict/exportData")
    },
    // 文件导入
    importData(){
      this.dialogFormVisible = true
    },
    // 导入成功上传到服务器
    onUploadSuccess(response,file){
      this.$message.success('上传成功')
      this.dialogFormVisible = false
      this.getDictList(1)
    } 
  },
  created(){
    this.getDictList(1)
  }
}
</script>

<style>
</style>