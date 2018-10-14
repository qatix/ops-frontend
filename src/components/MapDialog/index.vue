<template>
  <el-dialog v-el-drag-dialog title="选择地址" :visible.sync="visible" class="dialog" width="80%"
             @close="$emit('update:show', false)"
             :show="show">
    <section style="position: relative" v-loading="loading">
      <div id="map-container" style="height: 600px"></div>
      <div class="map-search">
        <el-input type="text" id="keyword" name="keyword" placeholder="请输入关键词" class="search-input"
                  ref="search_input" v-model="search_key" @keyup.enter.native="search"/>
        <el-button type="primary" icon="el-icon-search" @click="search"></el-button>
      </div>
      <div id="search-result" class="search-result" v-show="show_result"></div>
    </section>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="save()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import AMap from 'AMap'
  import elDragDialog from '@/directive/el-dragDialog'

  let map, autocomplete, placeSearch, placeSearchRender, search_result = []
  export default {
    name: 'Amap',
    directives: {elDragDialog},
    props: {
      show: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        visible: this.show,
        city: '',
        address: '',
        poi_list: [],
        show_result: false,
        search_key: '',
        loading: true
      }
    },
    mounted() {
    },
    computed: {
      isVisible() {
        return this.visible
      }
    },
    methods: {
      loadMap() {
        let self = this
        map = new AMap.Map('map-container', {
          resizeEnable: true
        })

        /***************************************
         由于Chrome、IOS10等已不再支持非安全域的浏览器定位请求，为保证定位成功率和精度，请尽快升级您的站点到HTTPS。
         ***************************************/
        AMap.event.addListener(map, 'complete', () => {

          AMap.plugin(['AMap.Autocomplete', 'AMap.Geolocation', 'AMap.PlaceSearch'], () => {
            let geolocation = new AMap.Geolocation({
              enableHighAccuracy: true, //  是否使用高精度定位，默认:true
              timeout: 50, //  超过10秒后停止定位，默认：无穷大
              maximumAge: 0, // 定位结果缓存0毫秒，默认：0
              convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
              showButton: true, //  显示定位按钮，默认：true
              buttonPosition: 'RB',  // 定位按钮停靠位置，默认：'LB'
              buttonOffset: new AMap.Pixel(10, 20), //  定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              showMarker: true, //  定位成功后在定位到的位置显示点标记，默认：true
              showCircle: true, //  定位成功后用圆圈表示定位精度范围，默认：true
              panToLocation: true,  //  定位成功后将定位到的位置作为地图中心点，默认：true
              zoomToAccuracy: true  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            })
            map.addControl(geolocation)

            geolocation.getCurrentPosition()
            AMap.event.addListener(geolocation, 'complete', self.getCurrentPositionOnComplete)
            AMap.event.addListener(geolocation, 'error', () => {
              map.getCity((data) => {
                this.city = data.city
                autocomplete = new AMap.Autocomplete({
                  city: data.city,
                  input: "keyword"
                })

                placeSearch = new AMap.PlaceSearch({
                  pageSize: 20,
                  city: data.city,
                  map: map
                })
                placeSearchRender = new Lib.AMap.PlaceSearchRender()
                AMap.event.addListener(autocomplete, "select", this.autocompleteOnSelected)
                this.loading = false
              })
            })
          })
        })

      },
      getCurrentPositionOnComplete(res) {
        console.log({res})
        this.city = res.addressComponent.city
        autocomplete = new AMap.Autocomplete({
          city: res.addressComponent.city,
          input: "keyword"
        })

        placeSearch = new AMap.PlaceSearch({
          pageSize: 20,
          city: res.addressComponent.city,
          map: map
        })
        placeSearchRender = new Lib.AMap.PlaceSearchRender()
        AMap.event.addListener(autocomplete, "select", this.autocompleteOnSelected)
        this.loading = false
      },
      autocompleteOnSelected(e) {
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name, this.searchResult)
      },
      search() {
        if (this.search_key && !this.loading) {
          search_result = []
          if (autocomplete) {
            autocomplete.closeResult()
          }
          placeSearch.search(this.search_key, this.searchResult)
        }
      },
      searchResult(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          // AMap.event.addListener(map, "click", function (a,b) {
          //   console.log(a,b)
          // })
          let markers = map.getAllOverlays('marker')
          if (markers) {
            for (let i = 0, marker; markers[i]; i++) {
              marker = markers[i]
              marker.index = i
              marker.on('click', this.markerClick.bind(this, i))
            }
          }
          search_result = result.poiList.pois
          this.show_result = true
          placeSearchRender.autoRender({
            placeSearchInstance: placeSearch,
            methodName: "search",
            methodArgumments: [this.search_key, this.searchResult],
            data: result,
            map: map,
            panel: "search-result"
          })
        }
      },
      markerClick(index, e) {
        placeSearchRender._currentIndex = index
      },
      save() {
        if (placeSearchRender._currentIndex >= 0 && search_result[placeSearchRender._currentIndex]) {
          this.$emit('submit', search_result[placeSearchRender._currentIndex])
        } else {
          this.$emit('submit', {})
        }
        this.visible = false
      }
    },
    watch: {
      search_key(a, b) {
        if (a !== b || !a) {
          this.show_result = false
        }
      },
      show(a, b) {
        this.visible = this.show
        if (a && a !== b) {
          this.$nextTick(() => {
            this.show_result = false
            this.search_key = ''
            search_result = []
            this.loadMap()
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  .map-search {
    background-color: #ffffff;
    position: absolute;
    top: 15px;
    left: 15px;
    display: flex;
    align-items: stretch;
    box-shadow: 0 2px 2px rgba(0, 0, 0, .15);
    .search-input .el-input__inner {
      height: 50px;
      border-radius: 0;
      border: none;
      width: 240px;
    }
    .el-button--primary {
      border-radius: 0;
      font-size: 18px;
    }
    .poi-list {
      display: none;
      position: absolute;
      top: 50px;
      left: 0;
      right: 0;
      max-height: 240px;
      overflow-y: auto;
      background: #ffffff;
      box-shadow: 0 2px 2px rgba(0, 0, 0, .15);
      border-top: 1px solid #eee;
      .item {
        display: flex;
        align-items: baseline;
        padding: 8px 10px;
        border-bottom: 1px solid #eee;
        .address {
          color: #888;
        }
      }
    }
  }

  .search-result {
    position: absolute;
    top: 66px;
    left: 15px;
    height: 240px;
    overflow-y: auto;
    background: #ffffff;
    box-shadow: 0 2px 2px rgba(0, 0, 0, .15);
    border-top: 1px solid #eee;
    .amap_lib_placeSearch {
      border: none;
      width: 300px;
      .poi-title a {
        display: none;
      }
    }
  }

  .amap-sug-result {
    z-index: 99999;
  }


</style>
