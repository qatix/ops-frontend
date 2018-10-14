<template>
  <article class="flex1 flex-column calendar-list-container app-container">
    <el-form :inline="true" :model="filter_params" class="filter-container">
      <el-input @keyup.enter.native="onSearch" class="filter-item" placeholder="渠道/Code" v-model="filter_params.key"
                style="width: 180px" filterable clearable>
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      <router-link :to="{name:'phoneAddForm'}">
        <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-plus">
          添加
        </el-button>
      </router-link>
    </el-form>
    <section class="flex1" ref="listTable">
      <el-table
        :data="items"
        border
        size="small"
        fit
        :max-height="table_max_height"
        v-loading="loading"
      >
        <el-table-column
          fixed="left"
          label="操作"
          width="90">
          <template slot-scope="scope">
            <router-link :to="{name:'phoneEditForm',params:{id : scope.row.id}}">
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
          label="id"
          width="80">
        </el-table-column>
        <el-table-column
          prop="channel"
          label="渠道"
          width="150">
        </el-table-column>
        <el-table-column
          prop="code"
          label="机型代码"
          width="150">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          width="100">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="140">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="140">
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
    name: 'phoneList',
    mixins: [list],
    data () {
      return {
        filter_params: {},
        items: []
      }
    },
    mounted () {
    },
    methods: {
      async getList () {
        let res = await this.loadListData('/base/phone/list')
        if (res.code === 0) {
          this.items = res.data.list
        }
      },
      deleteRow (phone) {
        this.$confirm('删除不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmDelete(phone)
        })
      },
      async confirmDelete (phone) {
        let res = await this.$store.api.newReq('/base/phone/delete').post([phone.id])
        if (res.code == 0) {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功',
            duration: 1500
          })
        } else {
          this.$message.error(res.msg)
        }
      }
    },
    created () {
      this.getList()
    }
  }
</script>

