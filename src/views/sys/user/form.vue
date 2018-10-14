<template>
  <article>
    <sticky className="sub-navbar draft">
      <el-button type="success" @click="save">提交</el-button>
    </sticky>
    <section class="app-container">

      <el-form ref="form" :model="form" label-width="80px" style="width: 600px">
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="所属部门">
          <tree-input-view placeholder="" :data="deptTree" @selected="onSelected" @clear="onClear"
                           v-model="form.deptId"></tree-input-view>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="form.roleIdList">
            <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id" name="roleIdList">{{role.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </section>
  </article>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import TreeInputView from '@/components/TreeInputView'

  export default {
    name: 'userForm',
    data () {
      return {
        form: {
          status: '1',
          deptId : '0'
        },
        roleList: [],
        deptTree: [...this.$store.state.app.config.depts]
      }
    },
    components: {
      Sticky,
      TreeInputView
    },
    computed: {},
    mounted () {
      if (this.$route.params.id) {
        this.get(this.$route.params.id)
      }
      this.getRoleList()
    },
    methods: {
      handleNodeClick (data) {
        console.log(data)
      },
      async save () {
        if (!this.form.username) {
          this.$message.error('请填写用户名')
          return
        }

        if (!this.form.mobile) {
          this.$message.error('请填写手机号')
          return
        }

        if (!this.form.id && !this.form.password) {
          this.$message.error('请填写密码')
          return
        }

        let res = {}
        if (this.form.id) {
          res = await this.$store.api.newReq('/sys/user/update').post(this.form)
        } else {
          res = await this.$store.api.newReq('/sys/user/save').post(this.form)
        }
        if (res.code === 0) {
          await this.$store.dispatch('getBaseData')
          this.$message({
            type: 'success',
            message: '提交成功',
            duration: 1500,
            onClose: async () => {
              await this.$store.dispatch('delVisitedViews', {path: this.$router.currentRoute.path})
              this.$router.replace('/sys/user/list')
            }
          })
        } else {
          this.$message.error(res.msg || '提交失败')
        }
      },
      async get (id) {
        let res = await this.$store.api.newReq('/sys/user/info/' + id).get()
        if (res.code == 0) {
          // res.data.deptId = String(res.data.deptId)
          res.data.status = String(res.data.status)
          this.form = res.data
        } else {
          this.$message.error(res.msg || '获取失败')
        }
      },
      async getRoleList () {
        let res = await this.$store.api.newReq('/sys/role/select').get()
        if (res.code == 0) {
          this.roleList = res.data
        }
      },
      onSelected (node) {
        this.form.deptId = String(node.id)
      },
      onClear (node) {
        this.form.deptId = '0'
      },
    }
  }
</script>

<style scoped>
</style>
