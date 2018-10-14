<template>
  <article class="flex1 flex-column calendar-list-container app-container">
    <el-form :inline="true" :model="filter_params" class="filter-container">
      <el-input @keyup.enter.native="onSearch" class="filter-item" placeholder="用户名" v-model="filter_params.username"
                style="width: 180px" filterable clearable>
      </el-input>
      <el-input @keyup.enter.native="onSearch" class="filter-item" placeholder="邮箱" v-model="filter_params.email"
                style="width: 180px" filterable clearable>
      </el-input>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>

      <router-link :to="{name:'userAddForm'}">
        <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-plus">
          添加
        </el-button>
      </router-link>
    </el-form>
    <section class="flex1" ref="listTable">
      <el-table
        :data="users"
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
            <router-link :to="{name:'userEditForm',params:{id : scope.row.id}}">
              <el-button
                type="text"
                size="small">
                编辑
              </el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="用户ID"
          width="60">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="150">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="120">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="所属部门"
          width="120">
        </el-table-column>
        <el-table-column
          label="管理员"
          class="text-center"
          width="120">
          <template slot-scope="scope">
           <span>
               <i class="el-icon-check color-success" v-if="scope.row.id == 1"></i>
               <i class="el-icon-close color-danger" v-else></i>
             </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          class="text-center"
          width="80">
          <template slot-scope="scope">
           <span>
               <i class="el-icon-check color-success" v-if="scope.row.status"></i>
               <i class="el-icon-close color-danger" v-else></i>
             </span>
          </template>
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
    name: 'userList',
    mixins: [list],
    data () {
      return {
        filter_params: {},
        users: []
      }
    },
    methods: {
      async getList () {
        let res = await this.loadListData('/sys/user/list')
        if (res.code === 0) {
          this.users = res.data.list
        }
      }
    },
    created () {
      this.getList()
    }
  }
</script>

