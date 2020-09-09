const path = require('path')
const fs = require('fs')
const Koa = require('koa')
const KoaRouter = require('koa-router')
const app = new Koa()
const router = new KoaRouter()

const filePath = path.resolve(__dirname, 'resource/koa doc.pdf')

router.get('/', (ctx, next) => {
  ctx.body = `<p>当前模拟了一个获取pdf文件的接口，请用get请求<strong style="padding: 0 8px;">/api/getPdf</strong>接口</p>`
})
router.get('/api/getPdf', async (ctx, next) => {
  const res = new Promise((resolve, reject) => {
    fs.readFile(filePath, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve({ data, name: path.basename(filePath) })
      }
    })
  })
    .then(({ data, name }) => ({ ret: 0, data: { file: data, fileName: name } }))
    .catch((error) => ({
      ret: 1,
      data: null,
      msg: error.toString(),
    }))
  ctx.body = await res
})
app.use(router.routes()).use(router.allowedMethods())

app.listen(3011, () => {
  console.log('pdf server started at http://localhost:3011/')
})
