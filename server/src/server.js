const path = require('path')
const fs = require('fs')
const Koa = require('koa')
const KoaRouter = require('koa-router')
const app = new Koa()
const router = new KoaRouter()

router.get('/', (ctx, next) => {
  ctx.body = `<p>当前模拟了一个获取pdf文件的接口，请用get请求<span style="color: #1480ff; padding: 0 5px;">/api/getPdf</span>接口</p>`
})
router.get('/api/getPdf', async (ctx, next) => {
  const res = new Promise((resolve, reject) => {
    fs.readFile(
      path.resolve(__dirname, 'resource/koa doc.pdf'),
      (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      }
    )
  })
    .then(data => ({ ret: 0, data }))
    .catch(error => ({
      ret: 1,
      data: null,
      msg: error.toString()
    }))
  ctx.body = await res
})
app.use(router.routes()).use(router.allowedMethods())
// app.use(ctx => {
//   ctx.body = 'Hello World'
// })

app.listen(3011, () => {
  console.log('pdf server started at 3011')
})
