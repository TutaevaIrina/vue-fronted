<template>
    <div class="about">
        <h1>Your tasks</h1>
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
