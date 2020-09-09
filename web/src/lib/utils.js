export const fileDownloader = (blob, fileName) => {
  if (window.navigator.msSaveOrOpenBlob) {
    //msSaveOrOpenBlob方法返回bool值
    navigator.msSaveBlob(blob, fileName) //本地保存
  } else {
    const link = document.createElement('a') //a标签下载
    link.href = window.URL.createObjectURL(blob)
    link.download = fileName
    link.click()
    window.URL.revokeObjectURL(link.href)
  }
}
