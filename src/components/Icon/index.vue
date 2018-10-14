<template>
  <i :class="iconClass" v-html="content"></i>
</template>

<script>
  export default {
    name: 'icon',
    props: {
      content: {
        type: String,
        required: true
      },
      className: {
        type: String
      }
    },
    computed: {
      iconClass() {
        if (this.className) {
          return 'fw ' + this.className
        } else {
          return 'fw'
        }
      }
    }
  }
</script>

<style scoped>
  @font-face {
    font-family: 'iconfont';  /* project id 652184 */
    src: url('//at.alicdn.com/t/font_652184_qkds7ege32jll3di.eot');
    src: url('//at.alicdn.com/t/font_652184_qkds7ege32jll3di.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_652184_qkds7ege32jll3di.woff') format('woff'),
    url('//at.alicdn.com/t/font_652184_qkds7ege32jll3di.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_652184_qkds7ege32jll3di.svg#iconfont') format('svg');
  }
  .fw {
    font-family: 'iconfont';
    font-style: normal;
  }
</style>
