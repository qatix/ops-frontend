<template>
  <div class="el-input el-input--suffix is-focus">
    <input type="text" autocomplete="off" :placeholder="placeholder" readonly="readonly" class="el-input__inner" v-model="value">
    <span class="el-input__suffix">
      <span class="el-input__suffix-inner">
        <i class="el-select__caret el-icon-arrow-right"></i>
      </span>
    </span>
  </div>
</template>

<script>
  export default {
    name: 'ForInput',
    props: {
      placeholder: {
        type: String,
        default: '请选择...'
      },
      value: String
    },
    data() {
      return {}
    },
    watch: {
      value(a) {
        this.$emit('input', a)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
