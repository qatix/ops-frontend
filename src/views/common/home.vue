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
               >查询
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
  import * as echarts from 'echarts'
  import { deepClone } from '@/utils/index'
  import moment from 'moment';

  export default {
    name: 'documentation',
    data () {
      return {
        filter_params: {
          filter_group: 'last7days',
          date_start: moment().subtract(3,"days").format('yyyy-MM-DD'),
          date_end: moment().format('yyyy-MM-DD'),
        },
        tab_active: 'source_type'
      }
    },
    methods: {
      onChangeTab () {
        if (this.data.filter_params.filter_group == 'custom') {
          return
        }
      },
      initChart(){
        var chartDom = document.getElementById('sales-report');
        var myChart = echarts.init(chartDom);
        var option;

        option = {
          title: {
            text: 'Stacked Line'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
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
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: 'Email',
              type: 'line',
              stack: 'Total',
              data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: 'Union Ads',
              type: 'line',
              stack: 'Total',
              data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
              name: 'Video Ads',
              type: 'line',
              stack: 'Total',
              data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
              name: 'Direct',
              type: 'line',
              stack: 'Total',
              data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
              name: 'Search Engine',
              type: 'line',
              stack: 'Total',
              data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
          ]
        };
        option && myChart.setOption(option);
      }
    },
    mounted () {
      this.initChart()
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
