<template>
  <article>
    <sticky className="sub-navbar draft">
      <el-button type="success" @click="save">提交</el-button>
    </sticky>

    <section class="app-container">
      <el-form ref="form" :model="form" label-width="80px" style="width: 600px">
        <el-form-item label="角色名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="上级部门">
          <tree-input-view placeholder="所属部门" :data="deptTree" @selected="onSelected" @clear="onClear"
                           v-model="form.deptId"></tree-input-view>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>

      </el-form>
    </section>
  </article>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import TreeInputView from '@/components/TreeInputView'

  export default {
    name: 'roleForm',
    data () {
      return {
        form: {},
        deptTree: [...this.$store.state.app.config.depts],
      }
    },
    components: {
      TreeInputView,
      Sticky
    },
    computed: {},
    mounted () {
      if (this.$route.params.id) {
        this.get(this.$route.params.id)
      }
    },
    methods: {
      async save () {
        if (!this.form.name) {
          this.$message.error('请填写角色名称')
          return
        }

        let res = {}
        if (this.form.id) {
          res = await this.$store.api.newReq('/sys/role/update').post(this.form)
        } else {
          res = await this.$store.api.newReq('/sys/role/save').post(this.form)
        }
        if (res.code === 0) {
          await this.$store.dispatch('getBaseData')
          this.$message({
            type: 'success',
            message: '提交成功',
            duration: 1500,
            onClose: async () => {
              await this.$store.dispatch('delVisitedViews', {path: this.$router.currentRoute.path})
              this.$router.replace('/sys/role/list')
            }
          })
        } else {
          this.$message.error(res.msg || '提交失败')
        }
      },
      async get (id) {
        let res = await this.$store.api.newReq('/sys/role/info/' + id).get()
        if (res.code == 0) {
          this.form = res.data
          this.form.deptId = String(res.data.deptId)
        } else {
          this.$message.error(res.msg || '获取角色失败')
        }
      },
      onSelected (node) {
        this.form.deptId = String(node.id)
      },
      onClear (node) {
        this.form.deptId = '0'
      },
    },
    created () {
    }
  }
</script>

<style scoped>
</style>

