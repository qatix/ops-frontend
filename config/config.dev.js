const prefix = 'admin_api'
const api = 'http://localhost:8080/admin'

module.exports = {
  BASE_URL: 'http://localhost:8888/',
  API_SERVER: api,
  PROXY: {
    "/": "http://localhost:8080/admin"
  }
}

