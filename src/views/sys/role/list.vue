<template>
  <article class="flex1 flex-column calendar-list-container app-container">
    <el-form :inline="true" :model="filter_params" class="filter-container">
      <el-input @keyup.enter.native="onSearch" class="filter-item" placeholder="部门名称" v-model="filter_params.name"
                style="width: 180px" filterable clearable>
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      <router-link :to="{name:'roleAddForm'}">
        <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-plus">
          添加
        </el-button>
      </router-link>
    </el-form>
    <section class="flex1" ref="listTable">
      <el-table
        :data="roles"
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
            <router-link :to="{name:'roleEditForm',params:{id : scope.row.id}}">
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
          prop="id"
          label="角色ID"
          width="80">
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
          width="150">
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="所属部门"
          width="100">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          width="100">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
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
    name: 'roleList',
    mixins: [list],
    data () {
      return {
        filter_params: {
          name: ''
        },
        roles: []
      }
    },
    mounted () {
      console.log('mounted')
    },
    methods: {
      async getList () {
        let res = await this.loadListData('/sys/role/list')
        if (res.code === 0) {
          this.roles = res.data.list
        }
      },
      deleteRow (role) {
        this.$confirm('删除不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmDelete(role)
        })
      },
      async confirmDelete (role) {
        let res = await this.$store.api.newReq('/sys/role/delete').post([role.id])
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
      console.log('created')
      this.getList()
    }
  }
</script>

