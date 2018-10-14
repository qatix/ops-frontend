<template>
  <el-dialog v-el-drag-dialog :title="title" :visible.sync="visible" class="dialog" @close="$emit('update:show', false)"
             :show="show">
    <div class="flex1 app-container">
      <el-form :inline="true">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="label" style="width: 100%">
              <el-input
                :type="type"
                :autosize="{ minRows: 4, maxRows:5}"
                :placeholder="placeholder"
                v-model="comment"
                style="width: 500px"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="save()" :loading="loading">{{btnTextAsync}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import elDragDialog from '@/directive/el-dragDialog'

  export default {
    name: 'TextAreaDialog',
    directives: {elDragDialog},
    props: {
      type: {
        type: String,
        default: 'textarea'
      },
      show: {
        type: Boolean,
        default: false
      },
      orderId: {
        default: ''
      },
      title: {
        type: String,
        default: '确认操作'
      },
      btnText: {
        type: String,
        default: '确认'
      },
      placeholder: {
        type: String,
        default: '请填写'
      },
      api: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      },
      field: {
        type: String,
        default: 'comment'
      },
      label: {
        type: String,
        default: '备注'
      }
    },
    data() {
      return {
        visible: this.show,
        comment: '',
        loading: false
      }
    },
    computed: {
      btnTextAsync() {
        return this.loading ? `${this.btnText}...` : this.btnText
      }
    },
    methods: {
      async save() {
        if (!this.api) {
          this.visible = false
          this.$emit('success', {})
          return
        }
        if (!this.orderId) {
          this.$message.error('id不正确')
          return
        }

        this.loading = true

        let res = await this.$store.api[this.api]({
          id: this.orderId,
          [this.field]: this.comment
        })
        this.loading = false
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功',
            duration: 1500,
            onClose: async () => {
              this.$emit('success', res.data)
              this.visible = false
            }
          })
        } else {
          this.$message.error(res.msg || '操作失败')
        }
      }
    },
    watch: {
      show(a, b) {
        this.visible = this.show
        if (a === true && a !== b) {
          this.comment = this.value
          this.loading = false
          this.getList()
        }
      }
    },
    mounted() {
    }
  }
</script>
