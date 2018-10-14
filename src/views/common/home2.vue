<template>
  <div class="app-container flex1" style="background: #f1f4f7; padding: 30px; overflow-y: auto">
    <div class="flex1 echarts-panel">
      <header class="flex">
        <div class="title flex1">总单量</div>
      </header>
      <section id="sales-report" class="content"></section>
    </div>
    <div class="flex1 flex" style="margin-top: 30px">
      <div class="flex1 echarts-panel">
        <header class="flex">
          <div class="title flex1">收入统计</div>
        </header>
        <section id="sales-report2" class="content"></section>
      </div>
      <div class="flex1 echarts-panel" style="margin-left: 30px">
        <header class="">
          <div class="title">业务产值占比</div>
        </header>
        <section id="service-price" class="content"></section>
      </div>
    </div>

  </div>
</template>
<script>
  import echarts from 'echarts'

  export default {
    name: 'documentation',
    data () {
      return {
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
        service_price_echart_init: false,
        service_price_echart: {},
        tab_active: 'income'
      }
    },
    methods: {
      onChangeTab (item) {
        this.setOptionSalesReport()
      },
      async getSalesReport () {
        let res = await this.$store.api.salesReport()
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
          for (let key in res.report.income_data) {
            let item = res.report.income_data[key]
            this.sales_report_data.legend.income.push(item.name)
            this.sales_report_data.series.income.push({...item, type: 'line', smooth: true})
          }

          this.setOptionSalesReport()
        } else {
          this.$message.error(res.msg || '产值占比数据获取失败')
        }
      },
      setOptionSalesReport () {
        let type = this.tab_active
        this.sales_report_options.legend.data = this.sales_report_data.legend[type]
        this.sales_report_options.series = this.sales_report_data.series[type]

        this.sales_report_echart.setOption(this.sales_report_options)
      },
      async getServicesWithPrice () {
        let res = await this.$store.api.getServicesWithPrice()
        if (res.code === 0) {
          if (!this.service_price_echart_init) {
            this.service_price_echart = echarts.init(document.getElementById('service-price'))
            this.service_price_echart_init = true
          }

          let data = {
            legendData: [],
            seriesData: [],
            selected: {}
          }
          res.data = res.data.sort((a, b) => b.price - a.price)
          res.data.map(item => {
            item.value = item.price
            data.seriesData.push(item)
            data.legendData.push(item.name)
            data.selected[item.name] = item.price > 0
          })

          this.service_price_echart.setOption({
            title: {
              show: false,
            },
            tooltip: {
              trigger: 'item',
              formatter: '{b}<br/> {c}元 ({d}%)'
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              right: 10,
              top: 20,
              bottom: 20,
              data: data.legendData,

              selected: data.selected
            },
            series: [
              {
                name: '业务',
                type: 'pie',
                radius: '55%',
                center: ['40%', '50%'],
                data: data.seriesData,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          })
        } else {
          this.$message.error(res.msg || '产值占比数据获取失败')
        }

      },
    },
    mounted () {
      this.getSalesReport()
      this.getServicesWithPrice()
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
