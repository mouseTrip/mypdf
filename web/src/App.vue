<template>
  <div id="app">
    <pdf-box />
  </div>
</template>

<script>
import PdfBox from './components/PdfBox'

export default {
  name: 'app',
  components: {
    PdfBox
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'PingFangSC-Regular', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #333;
}
</style>
