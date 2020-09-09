<template>
  <div class="container">
    <div id="canvas-wrap" class="container__view"></div>
    <div class="container__toolbar">
      <el-button size="mini" @click="onDownload">
        下载
      </el-button>
      <el-button size="mini" @click="onPrint">
        打印
      </el-button>
    </div>
    <iframe name="printContainer" class="container__print">
      <html>
        <body></body>
      </html>
    </iframe>
  </div>
</template>

<script>
import PDFJS from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.entry.js'
import { Loading, Message } from 'element-ui'
import { getPdf } from '@/request/api'
import { fileDownloader } from '@/lib/utils'
PDFJS.GlobalWorkerOptions.workerSrc = workerSrc
export default {
  data() {
    return {
      pdfContent: null,
      pdfPage: 0,
      pdfScale: 1,
      pdfName: '',
    }
  },
  computed: {
    printWindow() {
      return window.frames['printContainer']
    },
    printBody() {
      return this.printWindow.document.body
    },
  },
  mounted() {
    // 启动任务
    this.initPdf()
  },
  methods: {
    // 初始化pdf任务
    initPdf() {
      const loading = Loading.service({
        target: '.container__view',
        text: '加载PDF中...',
      })
      this.fetchPDFData()
        .then(pdf => {
          if (pdf) {
            console.log(pdf)
            this.pdfContent = pdf
            this.pdfPage = pdf.numPages
            // 执行完【pdf => canvas】的任务后，执行【canvas => image】的任务
            Promise.all(this.renderCanvas()).then(() => {
              this.canvas2img()
            })
          } else {
            Message.error({
              message: '获取PDF失败',
            })
          }
        })
        .catch(error => {
          Message.error({
            message: error ? error.toString() : 'Unknown Error',
          })
        })
        .finally(() => {
          loading.close()
        })
    },
    // 拉取PDF数据
    async fetchPDFData() {
      try {
        const { ret, data } = await getPdf()
        if (ret === 0) {
          const { file, fileName } = data
          this.pdfName = fileName
          const { data: binaryData } = file
          const loadingTask = PDFJS.getDocument({ data: binaryData })
          return loadingTask.promise
        }
      } catch (error) {
        return Promise.reject(error)
      }
      Message.error('获取PDF失败')
    },
    // pdf => canvas
    renderCanvas() {
      const renderTasks = []
      for (let i = 1; i <= this.pdfPage; i++) {
        renderTasks.push(this.appendPage(i))
      }
      return renderTasks
    },
    // canvas => image
    canvas2img() {
      for (let i = 1; i <= this.pdfPage; i++) {
        const target = document.getElementById('canvas_' + i)
        const img = new Image()
        img.src = target.toDataURL()
        this.printBody.appendChild(img)
      }
    },
    // 创建canvas容器，并将1页pdf渲染上去
    appendPage(pageIndex) {
      return this.pdfContent.getPage(pageIndex).then(page => {
        const viewport = page.getViewport({ scale: this.pdfScale || 1 })
        //在页面中创建canvas
        const canvas = document.createElement('canvas')
        canvas.id = 'canvas_' + pageIndex
        document.getElementById('canvas-wrap').append(canvas)
        const context = canvas.getContext('2d')
        canvas.height = viewport.height
        canvas.width = viewport.width
        // Render PDF page into canvas context
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        }
        return page.render(renderContext).promise
      })
    },
    // 下载
    onDownload() {
      this.pdfContent.getData().then(data => {
        const blob = new Blob([data], { type: 'application/pdf' })
        fileDownloader(blob, this.pdfName)
      })
    },
    // 打印
    onPrint() {
      this.printWindow.print()
    },
  },
}
</script>

<style lang="less">
.container {
  position: relative;
  width: 100%;
  height: 100%;
  &__view {
    width: 100%;
    padding-top: 44px;
    min-height: calc(100% - 44px);
    text-align: center;
    background: #333;
  }
  &__toolbar {
    position: fixed;
    display: flex;
    align-items: center;
    width: 100%;
    height: 44px;
    top: 0;
    padding: 0 16px;
    background-color: rgb(71, 71, 71);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.15),
      inset 0 -1px 0 rgba(255, 255, 255, 0.05), 0 1px 0 rgba(0, 0, 0, 0.15),
      0 1px 1px rgba(0, 0, 0, 0.1);
  }
  &__print {
    display: none;
  }
}
</style>
