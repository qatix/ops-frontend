<template>
  <el-dialog v-el-drag-dialog title="请选择" :visible.sync="visible" class="dialog" width="40%"
             @close="$emit('update:show', false)"
             :show="show">
    <div class="tree-view">
      <div class="ptb-10 plr-10">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
      </div>
      <el-tree
        :data="formatTree"
        :show-checkbox="showCheckbox"
        :filter-node-method="filterNode"
        @check-change="handleCheckChange"
        ref="tree"
        node-key="id"
        :default-expanded-keys="[0]"
        :style="{'max-height': maxHeight}"
        class="tree-view-content"
      >
      </el-tree>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="save()">确认</el-button>
    </div>
  </el-dialog>
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
        default: true
      },
      maxHeight:{
        type: String,
        default: '200px'
      }
    },
    data() {
      return {
        filterText: '',
        visible: this.show
      }
    },
    computed: {
      formatTree() {
        let tree = [], _json = {}, data = [...this.data]
        data.map(function (item) {
          item.label = item.name
          delete item.name
          _json[item.id] = item
        })
        data.map(function (item) {
          let parent = _json[item.pid]
          if (parent) {
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
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
      save(){
        console.log('ddd')
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      show(a, b) {
        this.visible = a
      }
    }
  }
</script>
<style lang="scss">
  .tree-view{
    .tree-view-content{
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
</style>
