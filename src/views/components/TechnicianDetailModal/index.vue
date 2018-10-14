<template>
  <el-dialog v-el-drag-dialog title="师傅详情" :visible.sync="visible" class="dialog" @close="$emit('update:show', false)"
             :show="show" width="80%">

    <el-tabs style="height: 400px" class="tabs-in-modal" v-loading="loading" v-model="activeTab">
      <el-tab-pane label="基本信息" style=" overflow-y: auto; height: 340px" name="tab1">
        <section class="plr-15">
          <div class="el-table el-table--fit el-table--border table-detail">
            <table cellspacing="0" cellpadding="0" border="0" class="el-table__body">
              <tbody>
              <tr>
                <td class="row-title">姓名</td>
                <td>{{technician.name}}</td>
                <td class="row-title">手机号</td>
                <td>{{technician.mobile}}</td>
                <td class="row-title ">授权</td>
                <td>
                  <span class="color-success" v-if="technician.is_authorized === 1">已授权</span>
                  <span class="color-danger" v-else>未授权</span>

                  <el-button type="danger" size="small" v-if="technician.is_authorized" @click="deauthorize()">取消授权
                  </el-button>
                  <el-button type="success" size="small" @click="authorize" v-else>授权</el-button>
                </td>
              </tr>

              <tr>
                <td class="row-title">累计余额</td>
                <td class="color-success">{{technician.total_balance}}元</td>
                <td class="row-title ">当前余额</td>
                <td class="font-weight color-danger">{{technician.balance}}元</td>
                <td class="row-title ">定金</td>
                <td class="">{{technician.deposit}}元</td>
              </tr>

              <tr>
                <td class="row-title">已接工单</td>
                <td>{{technician.total_order}}</td>
                <td class="row-title">星级</td>
                <td>{{technician.star}}</td>
                <td class="row-title">当前状态</td>
                <td>
                  <el-tag type="success" size="small" v-if="technician.work_status" hit>开工中</el-tag>
                  <el-tag type="info" size="small" v-else hit>未开工</el-tag>
                </td>
              </tr>
              <tr>
                <td class="row-title">添加时间</td>
                <td colspan="5">{{technician.date_added}}</td>
              </tr>
              <tr>
                <td colspan="6" class=" text-center">
                  <div class="flex">
                    <div class="flex1">
                      <a class="" :href="resetImageSrc(technician.id_front_image)" target="_blank">
                        <img :src="technician.id_front_image"/>
                        <br/>
                        身份证正面
                      </a>
                    </div>
                    <div class="flex1">
                      <a class="" :href="resetImageSrc(technician.driving_license_front_image)" target="_blank">
                        <img :src="technician.driving_license_front_image"/>
                        <br/>
                        行驶证正面
                      </a>
                    </div>
                    <div class="flex1"></div>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>
      </el-tab-pane>

      <el-tab-pane label="银行卡" name="tab2">
        <section class="plr-15">
          <el-table :data="technician.bank_cards" border size="small" fit :max-height="340">
            <el-table-column
              prop="no"
              label="银行卡号"
              width="150">
            </el-table-column>

            <el-table-column
              prop="bank_name"
              label="银行名称"
              width="120">
            </el-table-column>

            <el-table-column
              prop="address"
              label="开户行地址">
            </el-table-column>

            <el-table-column
              prop="name"
              label="持卡人">
            </el-table-column>

            <el-table-column
              prop="mobile"
              label="预留手机号">
            </el-table-column>

            <el-table-column
              prop="date_added"
              label="添加时间"
              width="150">
            </el-table-column>
          </el-table>
        </section>
      </el-tab-pane>

      <el-tab-pane label="余额变更记录" name="tab3">
        <section class="plr-15">
          <el-table :data="technician.balance_histories" border size="small" fit :max-height="340">
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
              width="150">
            </el-table-column>
          </el-table>
        </section>
      </el-tab-pane>

      <el-tab-pane label="提现记录" name="tab4">
        <section class="plr-15">
          <el-table :data="technician.withdraw_cash_histories" border size="small" fit :max-height="340">
            <el-table-column
              prop="no"
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
              width="150">
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
    name: 'TechnicianDetailModal',
    directives: {elDragDialog},
    mixins: [list, dialog],
    props: ['id'],

    data () {
      return {
        technician: {
          bank_cards: [],
          balance_histories: [],
          withdraw_cash_histories: []
        },
        loading: true,
        activeTab: 'tab1'
      }
    },
    computed: {},
    methods: {
      async get () {
        this.loading = true
        let res = await this.$store.api.technicianGet({id: this.id})
        this.loading = false
        if (res.code === 0) {
          this.technician = res.data
        } else {
          this.$message.error(res.msg)
        }
      },
      async authorize () {
        this.$confirm(`确定要给${this.technician.name}授权吗?`, '提示', {
          confirmButtonText: '确定授权',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await this.$store.api.technicianAuthorize({id: this.technician.id})
          if (res.code === 0) {
            await this.$store.dispatch('getBaseData')
            this.$message.success('授权成功')
            this.technician.is_authorized = 1
          } else {
            this.$message.error(res.msg || '授权失败')
          }
        }).catch(() => {
        })
      },
      async deauthorize () {
        this.$confirm(`确定要取消${this.technician.name}的授权吗?`, '提示', {
          confirmButtonText: '取消授权',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await this.$store.api.technicianDeauthorize({id: this.technician.id})
          if (res.code === 0) {
            await this.$store.dispatch('getBaseData')
            this.$message.success('取消授权成功')
            this.technician.is_authorized = '0'
          } else {
            this.$message.error(res.msg || '取消授权失败')
          }
        }).catch(() => {
        })
      },
      resetImageSrc (src = '') {
        return src.replace('?imageView/2/w/100/h/100', '')
      }
    }
    ,
    watch: {
      show (a, b) {
        if (a === true && a !== b) {
          this.activeTab = 'tab1'
          this.get()
        }
      }
    }
  }
</script>
