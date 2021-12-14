<template>
  <article>
    <sticky className="sub-navbar draft">
      <el-button type="success" @click="save">Save</el-button>
    </sticky>

    <section class="app-container">
      <el-form ref="form" :model="form" label-width="100px" style="width: 600px">
        <el-form-item label="Key">
          <el-input v-model="form.paramKey" placeholder="key"></el-input>
        </el-form-item>
        <el-form-item label="Value">
          <el-input v-model="form.paramValue" placeholder="value"></el-input>
        </el-form-item>
        <el-form-item label="Status">
          <el-radio-group v-model="form.status">
            <el-radio label="1">enable</el-radio>
            <el-radio label="0">disable</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Comment">
          <el-input v-model="form.remark" placeholder="comment"></el-input>
        </el-form-item>
      </el-form>
    </section>
  </article>
</template>

<script>
  import Sticky from '@/components/Sticky'

  export default {
    name: 'configForm',
    data() {
      return {
        form: {},
      }
    },
    components: {
      Sticky
    },
    computed: {},
    mounted() {
      if (this.$route.params.id) {
        this.get(this.$route.params.id)
      }
    },
    methods: {
      async save() {
        if (!this.form.paramKey) {
          this.$message.error('key must not be null')
          return
        }

        if (!this.form.paramValue) {
          this.$message.error('value must not be null')
          return
        }

        let res = {}
        if (this.form.id) {
          res = await this.$store.api.newReq('/sys/config/update').post(this.form)
        } else {
          res = await this.$store.api.newReq('/sys/config/save').post(this.form)
        }
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: 'Save successfully',
            duration: 1500,
            onClose: async () => {
              await this.$store.dispatch('delVisitedViews', { path: this.$router.currentRoute.path })
              this.$router.replace('/sys/config/list')
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      },
      async get(id) {
        let res = await this.$store.api.newReq('/sys/config/info/' + id).get()
        if (res.code === 0) {
          this.form = res.data
        } else {
          this.$message.error(res.msg)
        }
      }
    },
    created() {
    }
  }
</script>

<style scoped>
</style>
