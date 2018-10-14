<template>
  <div class="app-container flex1" style="background: #f1f4f7; padding: 30px; overflow-y: auto">
    <el-radio-group v-model="filter_params.filter_group" size="small" @change="onChangeTab">
      <el-radio-button label="last7days">最近7天</el-radio-button>
      <el-radio-button label="last30days">最近30天</el-radio-button>
      <el-radio-button label="last12months">最近12个月</el-radio-button>
      <el-radio-button label="custom">自定义</el-radio-button>
    </el-radio-group>

    <el-date-picker class="filter-item" v-if="filter_params.filter_group == 'custom'"
                    v-model="filter_params.date_start"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    filterable clearable
                    placeholder="选择开始日期">
    </el-date-picker>

    <el-date-picker class="filter-item" v-if="filter_params.filter_group == 'custom'"
                    v-model="filter_params.date_end"
                    type="date"
                    format="yyyy-MM-dd"
                    filterable clearable
                    value-format="yyyy-MM-dd"
                    placeholder="选择截止日期">
    </el-date-picker>

    <el-button class="filter-item" v-if="filter_params.filter_group == 'custom'" type="primary" icon="el-icon-search"
               @click="getSalesReport">查询
    </el-button>

    <div class="flex1 echarts-panel" style="margin-top: 20px">
      <header class="flex">
        <div class="title flex1">总单量</div>
      </header>
      <section id="sales-report" class="content"></section>
    </div>
  </div>
</template>
<script>
  import echarts from 'echarts'

  export default {
    name: 'documentation',
    data () {
      return {
        filter_params: {
          filter_group: 'last7days',
          date_start: '',
          date_end: ''
        },
        sales_report_echart_init: false,
        sales_report_echart: {},
        sales_report_data: {
          legend: {
            source_type: [],
            income: []
          },
          series: {
            source_type: [],
            income: []
          }
        },
        sales_report_options: {
          title: {
            show: false,
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: []
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: []
        },
        tab_active: 'source_type'
      }
    },
    methods: {
      onChangeTab () {
        if (this.data.filter_params.filter_group == 'custom') {
          return
        }

        this.getSalesReport()
      },
      async getSalesReport () {
        this.sales_report_data.legend.source_type = []
        this.sales_report_data.series.source_type = []

        let res = await this.$store.api.salesReport(this.filter_params)
        if (res.code === 0) {
          if (!this.sales_report_echart_init) {
            this.sales_report_echart = echarts.init(document.getElementById('sales-report'))
            this.sales_report_echart_init = true
          }
          this.sales_report_options.xAxis.data = res.report.categories
          res.report.source_type_data.map(item => {
            this.sales_report_data.legend.source_type.push(item.name)
            this.sales_report_data.series.source_type.push({...item, type: 'line', smooth: true})
          })

          this.setOptionSalesReport()
        } else {
          this.$message.error(res.msg || '数据获取失败')
        }
      },
      setOptionSalesReport () {
        let type = this.tab_active

        this.sales_report_options.legend.data = this.sales_report_data.legend[type]

        this.sales_report_options.series = this.sales_report_data.series[type]

        this.sales_report_echart.setOption(this.sales_report_options)
      }
    },
    mounted () {
      this.getSalesReport()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .echarts-panel {
    background: #ffffff;
    padding: 30px;
    .title {
      font-size: 20px;
      font-weight: bold;
    }
    .content {
      height: 400px;
    }
  }
</style>
