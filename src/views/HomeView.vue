<template>
  <div class="addTask">
    <img alt="logo" src="../assets/logoStudious2.png">
    <HelloWorld mes="Hello World!"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>

<style scoped>
img{
    padding-bottom: 50px;
}

</style>
