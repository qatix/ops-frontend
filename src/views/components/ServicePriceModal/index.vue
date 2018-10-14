<template>
  <el-dialog v-el-drag-dialog :title="title" :visible.sync="visible" class="dialog" @close="$emit('update:show', false)"
             :show="show">

    <el-tabs style="height: 420px;" class="tabs-in-modal" v-loading="loading" v-model="tab_active"
             @tab-click="changeTab">
      <el-tab-pane :label="tab.label" v-for="(tab, tab_index) in tabs" :key="tab.id" :name="tab.field">
        <section style="padding: 0 15px">
          <el-table
            :data="prices"
            border
            size="small"
            fit
            style="width: 100%;"
            max-height="300"
          >
            <el-table-column
              fixed="left"
              label="操作"
              width="80">
              <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" size="mini"
                           @click="deletePriceRow(scope.$index)" circle
                           :loading="scope.row.loading"></el-button>
              </template>
            </el-table-column>

            <el-table-column
              :label="tab.type_name"
              width="200">
              <template slot-scope="scope">
                <el-select placeholder="请选择..." v-model="scope.row.ref_id">
                  <el-option v-for="item in select_data" :key="item.id" :value="item.id"
                             :label="item.name">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column
              label="价格">
              <template slot-scope="scope">
                <el-input v-model="scope.row.price" @blur="savePrice(scope.$index)"/>
              </template>
            </el-table-column>
          </el-table>
          <div style="padding: 10px">
            <el-button type="success" icon="el-icon-plus" size="small" @click="addPriceRow()">
              添加价格
            </el-button>
          </div>
        </section>
      </el-tab-pane>
    </el-tabs>

    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="save()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import list from '@/mixins/list'
  import dialog from '@/mixins/dialog'
  import elDragDialog from '@/directive/el-dragDialog'

  let original_prices = {
    star_level_prices: [],
    platform_prices: []
  }

  let tabs = [
    {id: 2, label: '星级设置', type_name: '星级', field: 'star_level_prices'},
    {id: 1, label: '平台设置', type_name: '平台', field: 'platform_prices'},
  ]

  let form = {
    ref_type_field: 'star_level_prices',
    ref_type: 2,
    star_level_prices: [],
    platform_prices: [],
  }
  export default {
    name: 'ServicePriceModal',
    directives: {elDragDialog},
    mixins: [list, dialog],
    props: ['service'],
    data () {
      return {
        service_prices: [],
        form: {
          ...form
        },
        tabs: [...tabs],
        loading: true,
        tab_active: 'star_level_prices',
        config: this.$store.state.app.config
      }
    },
    computed: {
      title () {
        return `${this.service.name || ''}-价格设置`
      },
      prices () {
        return [...this.form[this.form.ref_type_field]]
      },
      select_data () {
        if (this.form.ref_type === 2) {
          return [...this.config.star_levels]
        }
        return [...this.config.platforms]
      }
    },
    methods: {
      async getServicePrices () {
        this.loading = true
        let res = await this.$store.api.servicePriceGets({service_id: this.service.id})
        this.loading = false
        if (res.code === 0) {
          let star_level_prices = [], platform_prices = []
          res.data.map(item => {
            item.ref_id = Number(item.ref_id)
            if (item.ref_type === '1') {
              platform_prices.push(item)
            } else {
              star_level_prices.push(item)
            }
          })
          this.form.star_level_prices = star_level_prices
          this.form.platform_prices = platform_prices
          this.service_prices = res.data
        } else {
          this.$message.error(res.msg)
        }
      },
      changeTab () {
        let index = 0
        if (this.tab_active === 'platform_prices') {
          index = 1
        }
        this.form.ref_type = this.tabs[index].id
        this.form.ref_type_field = this.tabs[index].field
      },
      addPriceRow () {
        this.form[this.form.ref_type_field].push({
          id: 0,
          ref_id: null,
          price: 0,
          loading: false
        })
      },
      async savePrice (index) {

        let tab_type = this.form.ref_type_field
          , item = this.form[tab_type][index]
          , original_item = original_prices[tab_type][index]
          , res = {}

        if (original_item && item.ref_id === original_item.ref_id && item.price === original_item.price) {
          return
        }

        let post_data = {
          service_id: this.service.id,
          ref_type: this.form.ref_type,
          ref_id: item.ref_id,
          price: item.price
        }

//        if (!post_data.price) {
//          this.$message.error('请设置价格')
//          return
//        }
//        if (!post_data.ref_id) {
//          this.$message.error('请选择价格类型')
//          return
//        }

        if (!post_data.ref_type || !post_data.service_id) {
          this.$message.error('参数不正确')
          return
        }
        item.loading = true
        if (post_data.id) {
          res = await this.$store.api.servicePriceUpdate(post_data)
        } else {
          res = await this.$store.api.servicePriceAdd(post_data)
        }
        item.loading = false
        if (res.code === 0) {
          if (res.id) {
            item.id = res.id
          }
          original_prices[tab_type][index] = {...item}
          this.$message.success('保存成功')
        } else {
          this.$message.error(res.msg || '保存失败')
        }
      },
      async deletePriceRow (index) {
        let tab_type = this.form.ref_type_field
          , item = this.form[tab_type][index]
        if (!item.id) {
          this.form[tab_type].splice(index, 1)
          original_prices[tab_type].splice(index, 1)
        } else {
          let post_data = {
            service_id: this.service.id,
            ref_type: this.form.ref_type,
            ref_id: item.ref_id,
            price: item.price,
            id: item.id
          }
          item.loading = true
          let res = await this.$store.api.servicePriceDelete(post_data)
          item.loading = false
          if (res.code === 0) {
            this.form[tab_type].splice(index, 1)
            original_prices[tab_type].splice(index, 1)
            this.$message.success('删除成功')
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        }
      },
      save () {
        this.visible = false
      }
    },
    watch: {
      show (a, b) {
        if (a === true && a !== b) {
          this.form = {...form}
          original_prices = {
            star_level_prices: [],
            platform_prices: []
          }
          this.tab_active = 'star_level_prices'
          this.getServicePrices()
        }
      }
    }
  }
</script>
