import axios from 'axios'
import { originalUrl } from './UrlList'
import {message} from "antd";

export function uploadFile(me, url, params, thenFun=null, catchFun=null) {
  const data = new FormData()
  const keys = Object.keys(params)
  let whetherContainedFile = false
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === 'file') whetherContainedFile = true
    data.append(keys[i], params[keys[i]])
  }
  console.log(originalUrl + url, params)
  if (whetherContainedFile === false) return
  axios.post(originalUrl + url, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => {
    if (thenFun === null) {
      message.success('操作成功！')
      return
    }
    thenFun(res, me)
  }).catch(err => {
    if (catchFun === null) {
      message.error('操作失败！')
      return
    }
    catchFun(err, me)
  })
}
