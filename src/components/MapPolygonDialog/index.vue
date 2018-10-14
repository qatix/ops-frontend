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
        <el-button type="success" @click="startDrawing" v-if="drawing === 0">开始绘制</el-button>
        <el-button type="info" @click="editPolygonClose" v-if="drawing === 2">编辑完成</el-button>
        <el-button type="danger" @click="clearPolygon" v-if="drawing >= 2">清除</el-button>
      </div>
    </section>
    <div class="right-menu-wrapper" @click="visible_right_menu = false" v-show="visible_right_menu">
      <ul class="rigth-menu" :style="right_menu_style">
        <li @click="deletePolygon()">删除</li>
      </ul>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="save()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import AMap from 'AMap'
  import elDragDialog from '@/directive/el-dragDialog'

  let map, autocomplete, placeSearch, placeSearchRender, search_result = [], mouseTool, polylineEditors = {},
    polygons = {}
  export default {
    name: 'MapPolygonDialog',
    directives: {elDragDialog},
    props: {
      show: {
        type: Boolean,
        default: false
      },
      polygon: {
        type: Array,
        default: function (e) {
          return []
        }
      },
    },
    data() {
      return {
        right_menu_style: {
          left: 0,
          top: 0
        },
        visible_right_menu: false,
        polygon_id: '',
        visible: this.show,
        city: '',
        address: '',
        poi_list: [],
        show_result: false,
        search_key: '',
        loading: true,
        drawing: 0,
        paths: [],
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
          console.log(AMap)
          AMap.plugin(['AMap.Autocomplete', 'AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.MouseTool', 'AMap.PolyEditor'], () => {
            let geolocation = new AMap.Geolocation({
              enableHighAccuracy: true, //  是否使用高精度定位，默认:true
              timeout: 100, //  超过10秒后停止定位，默认：无穷大
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
            mouseTool = new AMap.MouseTool(map)

            AMap.event.addListener(mouseTool, 'draw', this.drawCompletion)

            if (this.paths.length > 0) {
              this.paths.map(item => {
                let polygonObj = new AMap.Polygon({
                  map: map,
                  path: item,
                  strokeColor: "#5da0f5",
                  strokeOpacity: 1,
                  strokeWeight: 2,
                  fillColor: "#5da0f5",
                  fillOpacity: 0.35
                })
                let id = `id_${polygonObj._amap_id}`
                polygons[id] = polygonObj
                AMap.event.addListener(polygons[id], 'rightclick', this.onRightClickPolygon)
                this.editPolygon(id)
              })

            }
          })
        })

      },
      getCurrentPositionOnComplete(res) {
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
        }
      },
      startDrawing() {
        this.$nextTick(() => {
          mouseTool.polygon()
          this.drawing = 1
        })
      },
      drawCompletion(e) {
        let id = `id_${e.obj._amap_id}`
        polygons[id] = e.obj
        AMap.event.addListener(polygons[id], 'rightclick', this.onRightClickPolygon)
        this.editPolygon(id)
      },
      onRightClickPolygon({pixel, target}) {
        this.right_menu_style.left = `${pixel.x - 10}px`
        this.right_menu_style.top = `${pixel.y + 40}px`
        this.polygon_id = `id_${target._amap_id}`
        this.visible_right_menu = true
      },
      editPolygon(id) {
        polylineEditors[id] = new AMap.PolyEditor(map, polygons[id])
        // AMap.event.addListener(polylineEditors[id], 'end', this.onEditPolygonEnd)
        polylineEditors[id].open()
      },
      clearPolygon() {
        this.path = []
        this.drawing = 0
        mouseTool.close(true)
      },

      editPolygonClose() {
        polylineEditor.close()
        this.drawing = 3

      },
      deletePolygon(e) {
        let id = this.polygon_id
        polylineEditors[id].close()
        polygons[id].setMap(null)
        this.polygon_id = ''
        delete polylineEditors[id]
        delete polygons[id]
      },
      save() {
        let paths = []
        for (let key in polygons) {
          if (polygons[key]) {
            let lines = polygons[key].getPath(), items = []
            let len = lines.length -1
            lines.map(({lng, lat}, index) => {
              items.push([lng, lat])
              if (index === len) {
                items.push(items[0])
              }
            })
            paths.push(items)
          }
        }

        this.$emit('submit', paths)
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
            this.drawing = 0
            polylineEditors = {}
            polygons = {}
            if (this.polygon && this.polygon.length > 0) {
              this.paths = [...this.polygon]
            }
            this.loadMap()
          })
        }

        // if (!a && a != b) {
        //   for(let id in polylineEditors) {
        //     polylineEditors[id].close()
        //     polygons[id].setMap(null)
        //     delete polylineEditors[id]
        //     delete polygons[id]
        //   }
        // }
      }
    }
  }
</script>
<style lang="scss">
  .map-search {
    position: absolute;
    top: 15px;
    left: 15px;
    display: flex;
    align-items: stretch;
    box-shadow: 0 2px 2px rgba(0, 0, 0, .15);
    .search-input .el-input__inner {
      background-color: #ffffff;
      height: 50px;
      border-radius: 0;
      border: none;
      width: 240px;
    }
    .el-button--primary {
      border-radius: 0;
      font-size: 18px;
    }
  }

  .right-menu-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 9999;
    .rigth-menu {
      position: absolute;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.5);
      color: #ffffff;
      padding: 0;
      margin: 0;
      list-style: none;
      border-radius: 5px;
      overflow: hidden;
      li {
        padding: 5px 10px;
        min-width: 80px;
      }
    }
  }


</style>
