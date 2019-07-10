<template>
  <div id="app">
    <img alt="Nem logo" src="./assets/logo.png">
    <GetWalletComponent msg="Export Ledger Wallet"/>
  </div>
</template>

<script>
import GetWalletComponent from './components/GetWalletComponent.vue'
import SignComponent from './components/SignComponent.vue'

export default {
  name: 'app',
  components: {
    GetWalletComponent,
    SignComponent
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
