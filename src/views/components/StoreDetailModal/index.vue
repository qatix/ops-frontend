<template>
  <el-dialog v-el-drag-dialog title="商家详情" :visible.sync="visible" class="dialog" @close="$emit('update:show', false)"
             :show="show" width="80%">

    <el-tabs style="height: 300px;" class="tabs-in-modal" v-model="tab_active" v-loading="loading">
      <el-tab-pane label="基本信息" name="base">
        <section class="app-container">
          <div class="el-table el-table--fit el-table--border table-detail">
            <table cellspacing="0" cellpadding="0" border="0" class="el-table__body">
              <tbody>
              <tr>
                <td class="row-title">商家名称</td>
                <td>{{store.name}}</td>
                <td class="row-title">联系人</td>
                <td>{{store.manager_name}}</td>
                <td class="row-title">联系方式</td>
                <td>{{store.manager_mobile}}</td>

              </tr>

              <tr>
                <td class="row-title">累计记账</td>
                <td class="color-success">{{store.total_debt}}元</td>
                <td class="row-title ">当前记账</td>
                <td class="font-weight color-danger">{{store.debt}}元</td>
                <td class="row-title ">授权</td>
                <td>
                  <span class="color-success" v-if="store.is_authorized === 1">已授权</span>
                  <span class="color-danger" v-else>未授权</span>

                  <el-button type="danger" size="small" v-if="store.is_authorized" @click="deauthorize()">取消授权
                  </el-button>
                  <el-button type="success" size="small" @click="authorize" v-else>授权</el-button>
                </td>
              </tr>

              <tr>
                <td class="row-title">已接工单</td>
                <td>{{store.total_order}}</td>
                <td class="row-title">星级</td>
                <td>{{store.star}}</td>
                <td class="row-title">添加时间</td>
                <td>{{store.date_added}}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>
      </el-tab-pane>

      <el-tab-pane label="员工列表" name="users">
        <section class="flex1 app-container" ref="listTable">
          <el-table :data="store.users" border size="small" fit :max-height="200">
            <el-table-column
              prop="name"
              label="员工名字"
              width="150">
            </el-table-column>

            <el-table-column
              prop="mobile"
              label="手机号"
              width="120">
            </el-table-column>

            <el-table-column
              label="管理员"
              class="text-center"
              width="120">
              <template slot-scope="scope">
           <span>
               <i class="el-icon-check color-success" v-if="scope.row.is_admin"></i>
               <i class="el-icon-close color-danger" v-else></i>
             </span>
              </template>
            </el-table-column>

            <el-table-column
              prop="date_added"
              label="添加时间"
            >
            </el-table-column>
          </el-table>
        </section>
      </el-tab-pane>

      <el-tab-pane label="记账变更记录" name="debt_histories">
        <section class="flex1 app-container" ref="listTable">
          <el-table :data="store.debt_histories" border size="small" fit :max-height="200">
            <el-table-column
              prop="ref_no"
              label="相关单号"
              width="150">
            </el-table-column>

            <el-table-column
              prop="money"
              label="金额"
              width="120">
            </el-table-column>

            <el-table-column
              prop="comment"
              label="备注">
            </el-table-column>

            <el-table-column
              prop="date_added"
              label="添加时间"
              width="120">
            </el-table-column>
          </el-table>
        </section>
      </el-tab-pane>
    </el-tabs>

    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import list from '@/mixins/list'
  import dialog from '@/mixins/dialog'
  import elDragDialog from '@/directive/el-dragDialog'

  export default {
    name: 'StoreDetailModal',
    directives: {elDragDialog},
    mixins: [list, dialog],
    props: ['id'],
    data () {
      return {
        store: {
          users: [],
          debt_histories: []
        },
        tab_active: 'base',
        loading: true
      }
    },
    computed: {},
    methods: {
      async get () {
        this.loading = true
        let res = await this.$store.api.storeGet({id: this.id})
        this.loading = false
        if (res.code === 0) {
          res.data.is_authorized = parseInt(res.data.is_authorized)
          this.store = res.data
        } else {
          this.$message.error(res.msg)
        }
      },
      async authorize () {
        this.$confirm(`确定要给${this.store.name}授权吗?`, '提示', {
          confirmButtonText: '确定授权',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await this.$store.api.storeAuthorize({id: this.store.id})
          if (res.code === 0) {
            await this.$store.dispatch('getBaseData')
            this.$message.success('授权成功')
            this.store.is_authorized = 1
          } else {
            this.$message.error(res.msg || '授权失败')
          }
        }).catch(() => {
        })
      },
      async deauthorize () {
        this.$confirm(`确定要取消${this.store.name}的授权吗?`, '提示', {
          confirmButtonText: '取消授权',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await this.$store.api.storeDeauthorize({id: this.store.id})
          if (res.code === 0) {
            await this.$store.dispatch('getBaseData')
            this.$message.success('取消授权成功')
            this.store.is_authorized = 0
          } else {
            this.$message.error(res.msg || '取消授权失败')
          }
        }).catch(() => {
        })
      }
    },
    watch: {
      show (a, b) {
        if (a === true && a !== b) {
          this.tab_active = 'base'
          this.get()
        }
      }
    }
  }
</script>
