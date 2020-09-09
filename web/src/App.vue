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
    PdfBox,
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html,body,#app {
  height: 100%;
}
#app {
  font-family: 'PingFangSC-Regular', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
}
</style>
