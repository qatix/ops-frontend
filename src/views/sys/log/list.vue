<template>
  <article class="flex1 flex-column calendar-list-container app-container">
    <el-form :inline="true" :model="filter_params" class="filter-container">
      <el-input @keyup.enter.native="onSearch" class="filter-item" placeholder="用户名、操作" v-model="filter_params.key"
                style="width: 180px" filterable clearable>
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
    </el-form>
    <section class="flex1" ref="listTable">
      <el-table
        :data="logs"
        border
        size="small"
        fit
        :max-height="table_max_height"
        v-loading="loading"
      >
        <el-table-column
          prop="id"
          label="id"
          width="60">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="100">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          width="120">
        </el-table-column>
        <el-table-column
          prop="method"
          label="请求方法"
          width="200">
        </el-table-column>
        <el-table-column
          prop="params"
          label="请求参数"
          width="200">
        </el-table-column>
        <el-table-column
          prop="time"
          label="耗时(毫秒)"
          class="text-center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="IP地址"
          width="120">
        </el-table-column>
        <el-table-column
          prop="createDate"
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
        logs: [],
      }
    },
    methods: {
      async getList () {
        let res = await this.loadListData('/sys/log/list')
        if (res.code === 0) {
          this.logs = res.data.list
        }
      }
    },
    created () {
      this.getList()
    }
  }
</script>

