<template>
  <div class="app-container" style="width:35%">
    <el-form label-position="right" label-width="80px" :model="hospset">
      <el-form-item label="医院名称">
        <el-input v-model="hospset.hosname"></el-input>
      </el-form-item>
      <el-form-item label="医院编码">
        <el-input v-model="hospset.hoscode" :readonly="readonly"></el-input>
      </el-form-item>
      <el-form-item label="API地址">
        <el-input v-model="hospset.apiUrl"></el-input>
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="hospset.contactsName"></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="hospset.contactsPhone"></el-input>
      </el-form-item>
      <el-form-item align="center">
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
        <el-button :disabled="saveBtnDisabled" type="info" @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import hospital from "@/api/yygh/hospital";
export default {
  data() {
    return {
      hospset: {},
      // 是否禁用按钮防止重复提交
      saveBtnDisabled: false,
      readonly: false
    }
  },
  methods: {
    // 取消提交
    cancle() {
      this.hospset = {}
      this.$router.push({
        path: "/yygh/hospset/list"
      })
    },
    saveOrUpdate() {
      this.saveBtnDisabled = true
      let arr = Object.keys(this.hospset)
      console.log(arr)
      if (Object.keys(this.hospset).length === 0){
        this.$message({
          type: 'error',
          message: '请输入内容'
        })
        this.saveBtnDisabled = false;
        return
      }
      
      if (!this.hospset.id){
        this.saveData()
      } else {
        this.updateData()
      }
      
    },
    saveData() {
      hospital.saveData(this.hospset).then((response) => {
        this.$message({
          type: "success",
          message: "保存成功"
        })
        //注意：路由跳转时 使用 $router ,有r
        this.$router.push({
          path: "/yygh/hospset/list"
        })
      }).catch(reponse=>{
        this.$message({
          showClose: true,
          message: reponse,
          type:'warning'
        })
        this.saveBtnDisabled = false
      })
    },
    // 根据id回显数据
    fetchDataById(id){
      hospital.getById(id)
        .then(response => {
          this.hospset = response.data.item
        })
    },
    // 更新数据
    updateData(){
      hospital.updateById(this.hospset)
        .then(response => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        })
        .then(response=>{
            this.$router.push({
                path:'/yygh/hospset/list'
            })
        })
        .catch(() => {
          this.saveBtnDisabled = false
        })
    }
  },
  created(){
    if (this.$route.params && this.$route.params.id) {
      this.readonly = true
      const id = this.$route.params.id
      this.fetchDataById(id)
    }
  }
}
</script>