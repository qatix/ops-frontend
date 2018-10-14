<template>
  <el-dropdown class="tree-input-view" trigger="click" ref="tree-input-view-dropdown">
    <div class="el-dropdown-link" ref="tree-input-view-dropdown-title">
      <el-input
        :placeholder="placeholder"
        v-model="filterText"
        v-if="!selected.label || showCheckbox"
      >
      </el-input>
      <el-input
        :placeholder="placeholder"
        v-model="selected.label"
        v-if="selected.label && !showCheckbox"
        clearable
        readonly
        @clear="onClear"
      >
      </el-input>
    </div>
    <el-dropdown-menu slot="dropdown" class="tree-input-view-dropdown-menu" ref="tree-input-view-dropdown-menu"
                      :style="{'width': width}">
      <el-tree
        :data="formatTree"
        :show-checkbox="showCheckbox"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
        ref="tree"
        node-key="id"
        :default-expanded-keys="[0]"
        :style="{'max-height': maxHeight}"
        class="tree-view-content"
      >
      </el-tree>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  import elDragDialog from '@/directive/el-dragDialog'

  export default {
    name: 'TreeView',
    directives: {elDragDialog},
    props: {
      data: {
        type: Array,
        default: function () {
          return []
        }
      },
      show: {
        type: Boolean,
        default: false
      },
      showCheckbox: {
        type: Boolean,
        default: false
      },
      maxHeight: {
        type: String,
        default: '200px'
      },
      value: {
        type: String,
        default: '',
      },
      placeholder:{
        type: String,
        default: '输入关键字进行过滤',
      }
    },
    data() {
      return {
        filterText: '',
        width: '150px',
        visible: this.show,
        selected: {}
      }
    },
    computed: {
      formatTree() {
        let tree = [], _json = {}, data = [...this.data], data2 = []
        data.map((item) => {
          let t = {
            id: item.id,
            label: item.name,
            pid: item.pid
          }
          item.label = item.name
          if (item.id === this.value) {
            this.selected = {...t}
          }
          _json[item.id] = t
          data2.push(t)
        })

        data2.map(function (item) {
          let parent = _json[item.pid]
          if (parent && item.pid !== 0) {
            parent.children = parent.children || []
            parent.children.push(item)
          } else {
            tree.push(item)
          }
        })
        return tree
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      handleNodeClick(node, state) {
        const $dropdown = this.$refs['tree-input-view-dropdown']
        if (!this.showCheckbox) {
          $dropdown.hide()
          this.filterText = ''
          this.selected = node
          this.$emit('selected', node)
        }
      },
      onClear() {
        this.filterText = ''
        this.selected = {}
        this.$emit('cleaer', {})
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      show(a, b) {
        this.visible = a
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.width = this.$refs['tree-input-view-dropdown-title'].offsetWidth + 'px'
      })
    }
  }
</script>
<style lang="scss">
  .tree-input-view {
    width: 100%;

  }

  .tree-input-view-dropdown-menu {
    .tree-view-content {
      overflow-x: hidden;
      overflow-y: auto;
    }
  }

</style>
