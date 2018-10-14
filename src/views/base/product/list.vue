<template>
  <article class="flex1 flex-column calendar-list-container app-container">
    <el-form :inline="true" :model="filter_params" class="filter-container">
      <el-input @keyup.enter.native="onSearch" class="filter-item" placeholder="名称" v-model="filter_params.name"
                style="width: 180px" filterable clearable>
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        <router-link :to="{name:'productAddForm'}" >
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
              <router-link :to="{name:'productEditForm',params:{id : scope.row.id}}">
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
                        width="50">
                </el-table-column>
                                                                    <el-table-column
                        prop="name"
                        label="商品名称"
                        width="100">
                </el-table-column>
                                                                    <el-table-column
                        prop="no"
                        label="编号"
                        width="100">
                </el-table-column>
                                                                    <el-table-column
                        prop="model"
                        label="型号"
                        width="100">
                </el-table-column>
                                                                    <el-table-column
                        prop="description"
                        label="描述"
                        width="100">
                </el-table-column>
                                                                    <el-table-column
                        prop="price"
                        label="售价"
                        width="100">
                </el-table-column>
                                                                    <el-table-column
                        prop="createTime"
                        label="创建时间"
                        width="100">
                </el-table-column>
                                                                    <el-table-column
                        prop="updateTime"
                        label="更新时间"
                        width="100">
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
    name: 'productList',
    mixins: [list],
    data() {
      return {
        filter_params: {
        },
        items: []
      }
    },
    mounted(){
    },
    methods: {
      async getList () {
        let res =  await this.loadListData('/base/product/list')
        if( res.code === 0) {
          this.items = res.data.list
        }
      },
      deleteRow(product){
        this.$confirm('删除不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmDelete(product)
        })
      },
    async confirmDelete(product){
      let res = await this.$store.api.newReq('/base/product/delete').post([product.id])
      if (res.code == 0) {
          this.getList();
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
    created() {
      this.getList()
    }
  }
</script>

