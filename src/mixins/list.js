export default {
  data() {
    return {
      pager: {
        page: 1,
        limit: 20,
        sort: 'create_time',
        order: 'DESC',
        count: 0
      },
      table_max_height: 0,
      visible_pagination: false,
      filter_params: {},
      loading: true
    }
  },
  methods: {
    onSearch() {
      this.pager.page = 1
      this.getList()
    },
    setTableHeight() {
      this.table_max_height = this.$refs.listTable.offsetHeight
    },
    async exportListData(api, cb) {
      let filterParams = {...this.filter_params, ...this.pager}
      for (var key in filterParams) {
        if (filterParams[key] === '') {
          delete filterParams[key]
        }
      }

      this.loading = true
      let res = await api(filterParams)
      this.loading = false
      if (res.code === 0) {
        window.open(res.url, +new Date())
      }
    },
    async getListData(api, cb) {
      let filterParams = {...this.filter_params, ...this.pager}
      for (var key in filterParams) {
        if (filterParams[key] === '') {
          delete filterParams[key]
        }
      }
      this.loading = true
      let data = await api(filterParams)
      this.loading = false
      if (this.table_max_height === 0) {
        this.setTableHeight()
      }
      if (data.code == 0) {
        if (this.pager.page === 1) {
          this.handelPager(data.data.totalCount)
        }
      }
      return data
    },
    async loadListData(url, cb) {
      let filterParams = {...this.filter_params, ...this.pager}
      for (var key in filterParams) {
        if (filterParams[key] === '') {
          delete filterParams[key]
        }
      }
      this.loading = true
      let data = await this.$store.api.newReq(url).get(filterParams)
      this.loading = false
      if (this.table_max_height === 0) {
        this.setTableHeight()
      }
      if (data.code == 0) {
        console.log('pager:')
        console.log(this.pager)
        console.log(data.data)
        // console.log(this.data())
        if (this.pager.page === 1) {
          this.handelPager(data.data.totalCount)
        }
      }
      return data
    },
    handelPager(count) {
      this.pager.count = Number(count)
      if (count > this.pager.limit) {
        this.visible_pagination = true
      } else {
        this.visible_pagination = false
      }
    },
    handleSizeChange(e) {
      // console.log(e)
    },
    handleCurrentChange(page) {
      this.pager.page = page
      this.getList()
    },
    sort(e) {
      let sort = e.prop, order = e.order === 'descending' ? 'DESC' : 'ASC'
      this.pager.sort = sort
      this.pager.order = order
      this.pager.page = 1
      this.getList()
    }
  }
}
