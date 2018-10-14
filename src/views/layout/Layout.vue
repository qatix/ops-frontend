<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <tags-view></tags-view>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
  import {Navbar, Sidebar, AppMain, TagsView} from './components'
  import ResizeMixin from './mixin/ResizeHandler'
  import io from 'socket.io-client'
  import playAudio from '@/utils/audioBd'

  export default {
    name: 'layout',
    data () {
      return {
        socket: {}
      }
    },
    mixins: [ResizeMixin],
    components: {
      Navbar,
      Sidebar,
      AppMain,
      TagsView
    },
    computed: {
      sidebar () {
        return this.$store.state.app.sidebar
      }
    },
    methods: {
      async playAudio (text) {
        let res = await this.$store.api.getBdtoken()
        if (res.code === 0) {
          playAudio(text, res.access_token, this.$store.state.user.user.id)
        }
      },
      initSocket () {
        const socket = io('https://www.edaishen.net:8095', {path: '/im'})

        this.socket = socket

        let that = this

        socket.on('connect', (socket) => {
          console.log('connection')

          var connectData = {
            id: this.$store.state.user.user.id,
            name: this.$store.state.user.user.name
          }

          console.log(connectData)

          that.socket.emit('connection', connectData)
        })

        socket.on('connect_error', (socket) => {
          console.log('connect_error')
        })

        socket.on('connect_failed', (socket) => {
          console.log('connect_failed')
        })
        socket.on('reconnect', (attemptNumber) => {
          console.log('reconnect')

        })
        socket.on('message', (message) => {
          console.log(message)
          if (message.type == 'new-order') {
            this.playAudio('你有一个新的订单,订单号为:' + message.params.no)
          }
        })
      }
    },
    mounted () {
      //this.initSocket()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>
