<template>
  <el-dialog v-el-drag-dialog title="选择未收款订单" :visible.sync="visible" class="dialog"
             @close="$emit('update:show', false)" :show="show">
    <div class="flex1 flex-column calendar-list-container app-container" style="height: 500px;" v-loading="loading">
      <el-form :inline="true" :model="filter_params" class="filter-container">
        <el-input @keyup.enter.native="onSearch" class="filter-item" placeholder="车牌号/名字/手机号"
                  v-model="filter_params.search_key" style="width: 150px" filterable clearable>
        </el-input>

        <el-date-picker class="filter-item"
                        v-model="filter_params.date_start"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        style="width: 200px"
                        placeholder="选择开始日期">
        </el-date-picker>

        <el-date-picker class="filter-item"
                        v-model="filter_params.date_end"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        style="width: 200px"
                        placeholder="选择截止日期">
        </el-date-picker>

        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </el-form>
      <section class="flex1" ref="listTable" style="width: 100%;">
        <el-table
          :data="orders"
          ref="multipleTable"
          tooltip-effect="dark"
          @selection-change="onSelectionChange"
          size="small"
          fit
          style="width: 100%;"
          :max-height="370"
        >

          <el-table-column
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column
            prop="no"
            label="订单号"
            width="150">
          </el-table-column>

          <el-table-column
            prop="license"
            class="text-center"
            label="车牌号"
            width="100">
          </el-table-column>

          <el-table-column
            prop="text_service"
            label="服务项目"
            class="text-center"
            width="80">
          </el-table-column>

          <el-table-column
            prop="total_amount"
            label="未收款金额"
            class="text-center"
            width="120">
          </el-table-column>

          <el-table-column
            prop="bill_date"
            label="订单日期"
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
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="confirmSelected()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import list from '@/mixins/list'
  import dialog from '@/mixins/dialog'
  import elDragDialog from '@/directive/el-dragDialog'

  export default {
    name: 'ChooseUnreceiptOrdersModal',
    directives: {elDragDialog},
    mixins: [list, dialog],
    props: {
      sourceId: {
        type: Number,
        default: 0
      },
    },
    data () {
      return {
        loading: false,
        filter_params: {},
        orders: [],
        selectedOrders: [],
      }
    },
    computed: {},
    methods: {
      async getList () {
        let res = await this.getListData(this.$store.api.unreceiptOrderGets)
        if (res.code === 0) {
          this.orders = res.data
        }
      },
      onSelectionChange (value) {
        this.selectedOrders = value
      },
      confirmSelected () {
        this.$emit('submit', this.selectedOrders)
        this.visible = false
      }
    },
    watch: {
      show (a, b) {
        if (a === true && a !== b) {
          this.selectedOrders = []
          this.filter_params.source_id = this.sourceId
          this.getList()
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
