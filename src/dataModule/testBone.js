import axios from 'axios'
import { originalUrl } from './UrlList'

// 使用拦截器在发送请求前添加 token
axios.interceptors.request.use(config => {
  // 从 sessionStorage 中获取
  // config.headers.Authorization = window.sessionStorage.getItem('token')
  config.headers.Authorization = 'test token'
  // 必须 return config
  return config
})

function fetch(me, params = null, methods = 'post', thenFun = null, catchFun = null, whetherTest = false) {
  /** params 为参数，以键值对形式传递
   *  methods 为请求方式，默认 post
   *  thenFun 为正确获取 response 后的回调函数
   *  catchFun 是异步请求错误后的回调函数
   */
  if (whetherTest) {
    // 设置基础 url，而后设置 url 时会自动拼接
    axios.defaults.baseURL = 'http://localhost:3008/'
  } else {
    axios.defaults.baseURL = originalUrl
  }
  try {
    // 没有输入参数，直接退出
    if (params === null) throw new Error( 'fetch 报错：没有输入参数')
    if (methods === 'post' || methods === 'POST') {
      axios.post(me.url, params)
        .then(function (response) {
          if (thenFun === null) return
          thenFun(response, me)
        })
        .catch(function (error) {
          if (catchFun === null) return
          catchFun(error)
        });
    } else if (methods === 'get' || methods === 'GET') {
      // 添加随机数，避免浏览器误认为重复请求发送
      const random = Math.random().toString();
      let urlString = ''
      // 将参数整理为 url 字符串
      for (let i in params) {
        urlString = urlString + `&${i}=${params[i]}`
      }
      // 发起 get 请求
      axios.get(me.url + `?random=${random}` + urlString)
        .then(function (response) {
          if (thenFun === null) return
          thenFun(response, me)
        })
        .catch(function (error) {
          if (catchFun === null) return
          catchFun(error)
        });
    } else if (methods === 'put' || methods === 'PUT') {
      axios.put(me.url, params)
        .then(function (response) {
          if (thenFun === null) return
          thenFun(response, me)
        })
        .catch(function (error) {
          if (catchFun === null) return
          catchFun(error)
        });
    } else if (methods === 'delete' || methods === 'DELETE') {
      axios.delete(me.url, params)
      .then(function (response) {
        if (thenFun === null) return
        thenFun(response, me)
      })
      .catch(function (error) {
        if (catchFun === null) return
        catchFun(error)
      });
    } else throw new Error('fetch 报错：没有使用正确的请求方式')
  } catch (err) {
    console.error(err)
  }
}

function toJSON(rawData) {
  try {
    let objectType = Object.prototype.toString.call(rawData).split(' ')[1]
    objectType = objectType.split('').splice(0, objectType.length - 1).join('')
    if (objectType === 'Object') {
      const jsonString = JSON.stringify(rawData)
      return JSON.parse(jsonString)
    }
    throw new Error('输入数据类型错误：rawData 不可以非对象形式输入')
  } catch (err) {
    console.error(err)
  }
}

function cloneMap(aimMap) {
  const result = new Map()
  for (let [key, value] of aimMap) {
    result.set(key, value)
  }
  return result
}

class ModelMap {
  constructor() {
    this.modelMap = new Map()
  }

  get(key) {
    return this.modelMap.get(key)
  }

  set(key, value) {
    return this.modelMap.set(key, value)
  }

  has(key) {
    return this.modelMap.has(key)
  }

  delete(key) {
    return this.modelMap.delete(key)
  }

  clear() {
    return this.modelMap.clear()
  }

  setJsonToMap(response, me) {
    const keys = Object.keys(response.data.result)
    for (let i of keys) {
      me.modelMap.set(i, response.data.result[i])
    }
    return me.modelMap
  }
}

export class Model extends ModelMap{
  constructor(props) {
    super(props)
		this.collection = null
		this.id = ''
		this.cid = ''
    this.changed = ''
    this.url = 'project.json'
    // this.structure = [{
    //   name: 'test1',
    //   type: 'String'
    // }, {
    //   name: 'test2',
    //   type: 'Array'
    // }]
	}

  toJSON(rawData) {
    return toJSON(rawData)
  }

  fetch(params, url, methods, thenFun, catchFun, whetherTest) {
    this.url = url === undefined ? this.url : url
    fetch(this, params, methods, thenFun, catchFun, whetherTest)
	}

  save(params = null, url='', thenFun = null, catchFun = null) {
    this.fetch(params, url, 'post', thenFun, catchFun)
	}

  validate(params) {
    // let filterResult = true
    // for (let i in params) {
    //   let objectType = Object.prototype.toString.call(params[i]).split(' ')[1]
    //   objectType = objectType.split('').splice(0, objectType.length - 1).join('')
    //   filterResult = this.structure.some(function (value) {
    //     if (value.name === i && value.type === objectType) return true
    //   })
    // }
    // if (filterResult === true) return true
    // return false
	}

  isValid(params) {
    return this.validate(params)
	}

  clone() {
    return cloneMap(this.modelMap)
	}

	isNew(){
	}

	hasChanged() {
	}
}

// 静态变量
// 	this.model
// 	this.url

class ModelArray {
  constructor() {
    this.modelArray = []
  }

  push(newModel) {
    this.modelArray.push(newModel)
  }
}

export class Collection extends ModelArray{
  constructor(props) {
    super(props)
		// this.model = Model
    this.url = 'project.json'
	}

  toJSON(params) {
    toJSON(params)
	}

  clone() {
    return this.modelArray.map(function (value, index) {
  　　return value.clone(value.modelMap)
    })
  }

  add(items) {
    for (let i = 0; i < items.length; i++) {
      const singleModel = new Model()
      const item = items[i]
      for (let x in item) {
        singleModel.set(x, item[x])
      }
      this.modelArray.push(singleModel)
    }
    // console.log(this.modelArray)
  }

  // 清空原有 modelArray 后，在进行添加
  addAfterClear(items, me) {
    const length = me.modelArray.length
    for (let i = 0; i < length; i++) {
      me.modelArray.pop()
    }
    me.add(items.data.result)
  }

  fetch(params = null, url = '', methods = 'post', thenFun = null, catchFun = null) {
    this.url = url
    fetch(this, params, methods, thenFun, catchFun)
  }
}



// 测试
// const bone = new Model()
// let testObject = { a: 'a' }
// let testNum = 12
// bone.set('cloneMap1', 'cloneMap1')
// bone.set('cloneMap2', 'cloneMap2')
// console.log(bone.toJSON(testObject))
// bone.fetch({ab: 'ab', cd: 'cd'}, 'get')
// // let testObject2 = { test1: 'a', test2: {} }
// // let testObject3 = { test1: 'a', test2: [] }
// // console.log(bone.validate(testObject3))
// console.log(bone.get('cloneMap1'))
// console.log(bone.clone())

// const collection = new Collection()
// collection.push(bone)
// console.log(collection.modelArray)
// // console.log(collection.modelArray)
// console.log(collection.clone())
// collection.fetch({}, 'get', 'project.json', collection.add)
// console.log('collection', collection.modelArray)
