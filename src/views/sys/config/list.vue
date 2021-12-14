<template>
  <article class="flex1 flex-column calendar-list-container app-container">
    <el-form :inline="true" :model="filter_params" class="filter-container">
      <el-input @keyup.enter.native="onSearch" class="filter-item" placeholder="key"
                v-model="filter_params.key"
                style="width: 180px" filterable clearable>
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="onSearch">Seach
      </el-button>
      <router-link :to="{name:'configAddForm'}">
        <el-button class="filter-item" style="margin-left: 10px;" type="success"
                   icon="el-icon-plus">
          Add
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
          label="Actions"
          width="90">
          <template slot-scope="scope">
            <router-link :to="{name:'configEditForm',params:{id : scope.row.id}}">
              <el-button
                type="text"
                size="small">
                Edit
              </el-button>
            </router-link>
            <el-button
              @click.native.prevent="deleteRow(scope.row)"
              type="text"
              size="small">
              Del
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
          prop="id"
          label="id"
          width="80">
        </el-table-column>
        <el-table-column
          prop="paramKey"
          label="key"
          width="250">
        </el-table-column>
        <el-table-column
          prop="paramValue"
          label="value"
          width="200">
        </el-table-column>
        <el-table-column
          prop="status"
          label="Status"
          width="100">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="Comment"
          width="200">
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
    name: 'configList',
    mixins: [list],
    data() {
      return {
        filter_params: {},
        items: []
      }
    },
    mounted() {
    },
    methods: {
      async getList() {
        let res = await this.loadListData('/sys/config/list')
        if (res.code === 0) {
          this.items = res.data.list
        }
      },
      deleteRow(config) {
        this.$confirm('Deletion could not be restored, continue?', 'Hint', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.confirmDelete(config)
        })
      },
      async confirmDelete(config) {
        let res = await this.$store.api.newReq('/sys/config/delete').post([config.id])
        if (res.code === 0) {
          this.getList();
          this.$message({
            type: 'success',
            message: 'Delete successfully',
            duration: 1500
          })
        } else {
          this.$message.error(res.msg)
        }
      }
    },
    created() {
      this.getList()
    }
  }
</script>
