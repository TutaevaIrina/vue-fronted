<template>
    <div class="about">
        <img alt="logo" src="../assets/logoStudious2.png">
        <CalendarView msg="Calendar"/>
    </div>
</template>

<script>
import CalendarView from "@/components/CalendarView.vue";

export default {
    name: 'AboutView',
    components: {
        CalendarView
    }
}
</script>

<style scoped>

</style>
