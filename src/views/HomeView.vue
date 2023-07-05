<template>
  <div class="addTask">
    <img alt="logo" src="../assets/logoStudious2.png">
    <TasksView msg="© 2023 Studious. All rights reserved."/>
  </div>
</template>

<script>
import TasksView from '@/components/TasksView.vue'

export default {
  name: 'HomeView',
  components: {
    TasksView: TasksView
  }
}
</script>

<style scoped>
img{
    padding-bottom: 50px;
}

</style>
