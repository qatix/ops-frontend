<template>
  <article>
    <sticky className="sub-navbar draft">
      <el-button type="success" @click="save">保存</el-button>
    </sticky>

    <section class="app-container">
      <el-form ref="form" :model="form" label-width="100px" style="width: 600px">
        <el-form-item label="商品名称">
          <el-input v-model="form.name" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item label="编号">
          <el-input v-model="form.no" placeholder="编号"></el-input>
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="form.model" placeholder="型号"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" placeholder="描述"></el-input>
        </el-form-item>
        <el-form-item label="售价">
          <el-input v-model="form.price" placeholder="售价"></el-input>
        </el-form-item>
      </el-form>
    </section>
  </article>
</template>

<script>
  import Sticky from '@/components/Sticky'

  export default {
    name: 'productForm',
    data () {
      return {
        form: {},
      }
    },
    components: {
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
        /*
        if (!this.form.name) {
           this.$message.error('名称不能为空')
           return
         }
         */

        let res = {}
        if (this.form.id) {
          res = await this.$store.api.newReq('/base/product/update').post(this.form)
        } else {
          res = await this.$store.api.newReq('/base/product/save').post(this.form)
        }
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功',
            duration: 1500,
            onClose: async () => {
              await this.$store.dispatch('delVisitedViews', {path: this.$router.currentRoute.path})
              this.$router.replace('/base/product/list')
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      },
      async get (id) {
        let res = await this.$store.api.newReq('/base/product/info/' + id).get()
        if (res.code == 0) {
          this.form = res.data
        } else {
          this.$message.error(res.msg)
        }
      }
    },
    created () {
    }
  }
</script>

<style scoped>
</style>

