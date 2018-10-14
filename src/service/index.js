import XHR from './xhr'
import CONFIG from 'CONFIG'

let services = {}
let urlPre = ''

// if (CONFIG.PROXY_PRE) {
//   urlPre = CONFIG.PROXY_PRE
// } else {
urlPre = CONFIG.BASE_URL
// }

services['newReq'] = function (uri) {
  return new XHR(urlPre + uri)
}

export default services
