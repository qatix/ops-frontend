<template>
  <section class="uploader-panel">
    <div class="uploader-item uploader" v-if="showUploader">
      <input type="file" class="uploader-input" ref="input" @change="handleChange" :accept="accept">
      <i class="el-icon-plus"></i>
    </div>
    <div class="uploader-item uploader-picture" v-else>
      <img :src="imgURl" class="thumbnail"/>
      <div class="mask loading"  v-if="loading">
        <i class="el-icon-loading"></i>
        <div class="">上传中...</div>
      </div>
      <div class="full handle"  v-else>
        <a :href="uri" target="_blank"></a>
        <div class="delete" @click="deleteImage()"><i class="icon el-icon-close"></i></div>
      </div>
    </div>
  </section>
</template>

<script>
  import {Message} from 'element-ui'
  const replaceImageUrl = (url) => {
    return url.replace('?imageView/2/w/100/h/100', '')
  }
  export default {
    name: 'Upload',
    props: {
      accept: {
        type: String,
        default: 'image/jpeg,image/jpg,image/png'
      },
      upload:{
        type: Function
      },
      value: {
        type: String,
        default: '',
      }
    },
    data() {
      return {
        uri: '',
        local_path: '',
        show_uploader: true,
        loading: false
      }
    },
    computed: {
      showUploader(){
        if (this.value || this.local_path) {
          return false
        }
        return true
      },
      imgURl(){
        if (this.local_path) {
          return this.local_path
        }
        if (this.value) {
          this.uri = replaceImageUrl(this.value)
          return this.value
        }
        return ''
      }
    },
    methods: {
      handleChange(ev) {
        const files = ev.target.files
        if (!files) return
        this.show_uploader = false
        this.loading = true
        this.readPicture(files[0])
        this.uploader(files[0])
      },
      async uploader (file) {
        console.log(file)
        let res = await this.upload(file)
        this.loading = false
        if (res.code == 0) {
          this.uri = replaceImageUrl(res.url)
          this.$emit('input', res.url)
          this.$emit('uploaded', res.url)
        } else {
          Message.error('上传失败！')
          this.local_path = ''
          this.show_uploader = true
        }
      },
      readPicture(picture) {
        let reader = new FileReader()
        let self = this
        reader.readAsArrayBuffer(picture)
        reader.onload = function(e){
          let bf = this.result
          let blob = new Blob([bf],{type:"text/plain"})
          let str = URL.createObjectURL(blob)
          self.local_path = str
        }
      },
      deleteImage () {
        this.uri = ''
        this.local_path = ''
        this.loading = false
        this.show_uploader = true
        this.$emit('input', '')
      },
    },
    // watch: {
    //   value(a, b){
    //   }
    // }
  }
</script>
<style lang="scss">
  .full{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  .flex-column-center{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .flex{
    display: flex;
    align-items: center;
  }
  .uploader-panel {
    width: 150px;
    height: 150px;
    .uploader-item {
      @extend .flex-column-center;
      width: 100%;
      height: 100%;
      position: relative;
      &.uploader{
        background-color: #fbfdff;
        border: 1px dashed #c0ccda;
        border-radius: 6px;
        overflow: hidden;
        i {
          font-size: 28px;
          color: #8c939d;
        }
        .uploader-input{
          @extend .full;
          opacity: 0;
          z-index: 0;
        }
        &:hover{
          border-color: #409EFF;
        }
      }
      &.uploader-picture{
        box-shadow: 0 0 3px rgba(138, 79, 79, 0.1);
        border-radius: 6px;
        overflow: hidden;
        .thumbnail{
          max-width: 100%;
        }
        .handle {
          cursor: pointer;
          a {
            display: block;
            width: 100%;
            height: 100%;
            position: relative;
            z-index: 0;
          }
          .delete {
            display: block;
            position: absolute;
            right: -17px;
            top: -7px;
            width: 46px;
            height: 26px;
            background: #e64340;
            text-align: center;
            transform: rotate(45deg);
            box-shadow: 0 1px 1px #ccc;
            color: #fff;
            z-index: 1;
            cursor: pointer;
            .icon {
              font-size: 12px;
              margin-top: 12px;
              transform: rotate(-45deg);
            }
          }
        }
        .mask{
          @extend .full;
          @extend .flex-column-center;
          opacity: 0;
          font-size: 20px;
          background-color: rgba(0,0,0,.5);
          -webkit-transition: opacity .3s;
          transition: opacity .3s;
          border-radius: 6px;
          color: #fff;
          &.loading{
            font-size: 14px;
            opacity: 1;
            i{
               font-size: 29px;
            }
          }
          &:hover{
            opacity: 1;
          }
        }
      }
    }
  }
</style>
