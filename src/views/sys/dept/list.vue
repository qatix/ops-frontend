<template>
  <article class="flex1 flex-column calendar-list-container app-container">
    <el-form :inline="true" :model="filter_params" class="filter-container">
      <router-link :to="{name:'deptAddForm'}">
        <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-plus">
          添加
        </el-button>
      </router-link>
    </el-form>
    <section class="flex1" ref="listTable">
      <el-table
        :data="departments"
        border
        size="small"
        fit
        :max-height="table_max_height"
        v-loading="loading"
      >
        <el-table-column
          fixed="left"
          label="操作"
          width="120">
          <template slot-scope="scope">
            <router-link :to="{name:'deptEditForm',params:{id : scope.row.id}}">
              <el-button
                type="text"
                size="small">
                编辑
              </el-button>
            </router-link>
            <el-button
              @click.native.prevent="deleteRow(scope.row)"
              type="text"
              size="small">
              删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="部门名称"
          width="150">
        </el-table-column>
        <el-table-column
          prop="orderNum"
          label="排序"
          width="150">
        </el-table-column>
      </el-table>
    </section>
    <section class="ptb-10" v-if="visible_pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pager.limit"
        layout="prev, pager, next, jumper"
        :total="pager.count"
      >
      </el-pagination>
    </section>
  </article>
</template>

<script>
  import list from '@/mixins/list'

  export default {
    name: 'departmentList',
    mixins: [list],
    data () {
      return {
        filter_params: {
          name: ''
        },
        departments: []
      }
    },
    methods: {
      async getList () {
        let res = await this.loadListData('/sys/dept/list')
        if (res.code === 0) {
          this.departments = res.data
        }
      },
      deleteRow (department) {
        this.$confirm('删除不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmDelete(department)
        })
      },
      async confirmDelete (department) {
        let res = await this.$store.api.newReq('/sys/dept/delete').post('id=' + department.id)
        if (res.code == 0) {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功',
            duration: 1500
          })
        } else {
          this.$message.error(res.msg || '删除失败')
        }
      }
    },
    created () {
      this.getList()
    }
  }
</script>

