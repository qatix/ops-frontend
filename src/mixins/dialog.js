import elDragDialog from '@/directive/el-dragDialog'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  directives: {elDragDialog},
  data() {
    return {
      visible: this.show
    }
  },
  watch: {
    show(a, b) {
      this.visible = this.show
    }
  }
}
