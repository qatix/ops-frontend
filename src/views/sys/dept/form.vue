<template>
  <article>
    <sticky className="sub-navbar draft">
      <el-button type="success" @click="save">提交</el-button>
    </sticky>

    <section class="app-container">
      <el-form ref="form" :model="form" label-width="80px" style="width: 600px">
        <el-form-item label="部门名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="上级部门">
          <tree-input-view placeholder="" :data="deptTree" @selected="onSelected" @clear="onClear"
                           v-model="form.parentId"></tree-input-view>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.orderNum"></el-input>
        </el-form-item>
      </el-form>
    </section>
  </article>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import TreeInputView from '@/components/TreeInputView'

  export default {
    name: 'departmentForm',
    data () {
      return {
        form: {
          parentId: 0,
          parentName: '一级部门',
          orderNum: 0
        },
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
          this.$message.error('请填写部门名称')
          return
        }

        let res = {}
        if (this.form.id) {
          res = await this.$store.api.newReq('/sys/dept/update').post(this.form)
        } else {
          res = await this.$store.api.newReq('/sys/dept/save').post(this.form)
        }
        if (res.code === 0) {
          await this.$store.dispatch('getBaseData')
          this.$message({
            type: 'success',
            message: '提交成功',
            duration: 1500,
            onClose: async () => {
              await this.$store.dispatch('delVisitedViews', {path: this.$router.currentRoute.path})
              this.$router.replace('/sys/dept/list')
            }
          })
        } else {
          this.$message.error(res.msg || '提交失败')
        }
      },
      async get (id) {
        let res = await this.$store.api.newReq('/sys/dept/info/' + id).get()
        if (res.code == 0) {
          this.form = res.data
        } else {
          this.$message.error(res.msg || '获取失败')
        }
      },
      onSelected (node) {
        this.form.parentId = String(node.id)
        this.form.parentName = node.name
      },
      onClear (node) {
        this.form.parentId = '0'
      },
    }
  }
</script>

<style scoped>
</style>

