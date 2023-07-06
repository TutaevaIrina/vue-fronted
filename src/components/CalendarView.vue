<template>
    <div class="space">
    </div>
    <div class="containerCalendar">
        <div class="calendar-view">
            <div class="header">
                <h1>{{ current.format('MMMM YYYY') }}</h1>
                <div class="d-flex align-items-center">
                    <button class="btn btn-primary mr-2" @click="prevMonth">Prev</button>
                    <button class="btn btn-primary next" @click="nextMonth">Next</button>
                </div>
            </div>
            <table class="table">
                <thead class="dayWeek">
                <tr>
                    <th scope="col" v-for="dayName in dayNames" :key="dayName">{{ dayName }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="week in weeks" :key="week">
                    <td v-for="day in week" :class="{'other': day.other, 'today': day.today}" :key="day.date">
                        <button class="day-button" @click="openDay(day)" @mouseover="showFingerSign(day)" @mouseleave="hideFingerSign(day)">
                            <div class="day-number">{{ day.date.date() }}</div>
                            <div class="day-tasks">
                                <span v-for="(task, index) in day.tasks" class="task-point" :style="{ backgroundColor: getTaskColor(index) }" :key="index"></span>
                            </div>
                            <div class="finger-sign" v-show="day.showFingerSign"></div>
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="tasks-section">
            <div v-if="selectedDay">
                <div v-for="task in selectedDay.tasks" class="task" :class="{'empty': !task}" :key="task">
                    {{ task.name }}
                </div>
            </div>
        </div>
    </div>
    <footer>
        <div class="footer-content">
            <div class="contact-details">
                <p>Email: info@studious.com</p>
                <p>Phone: 123-456-7890</p>
            </div>
        </div>
        <div class="bottom-bar">
            <p>© 2023 Studious. All rights reserved.</p>
        </div>
    </footer>
</template>

<script>
const moment = require('moment');
const axios = require('axios');
export default {
    name: 'CalendarView',
    props: {
        msg: String
    },

    data() {
        return {
            tasks: [],
            today: moment(),
            current: moment().date(1),
            events: [],
            month: null,
            oldMonth: null,
            next: true,
            openDetails: false,
            selectedDay: null,
            dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            dropdownOpen: false
        };
    },

    created() {
        this.fetchTasks();
    },

    computed: {
        monthTitle() {
            return this.current.format('MMMM YYYY');
        },
        weeks() {
            const weeks = [];
            let date = this.current.clone().startOf('month').startOf('week');

            for (let i = 0; i < 6; i++) {
                const week = [];
                for (let j = 0; j < 7; j++) {
                    const day = {
                        date: date.clone(),
                        name: date.format('ddd'),
                        number: date.date(),
                        other: date.month() !== this.current.month(),
                        today: date.isSame(this.today, 'day'),
                        events: this.getEventsForDate(date),
                        tasks: this.getTasksForDate(date),
                        showFingerSign: false,
                    };
                    week.push(day);
                    date.add(1, 'day');
                }
                weeks.push(week);
            }

            return weeks;
        }
    },
    watch: {
        current: {
            handler() {
                this.openDetails = false;
            },
            deep: true,
        },
    },

    methods: {
        fetchTasks() {
            axios
                .get('http://localhost:8080/tasks')
                .then((response) => {
                    // Assign the fetched tasks to the component data
                    this.tasks = response.data.map((task) => ({
                        name: task.name,
                        deadline: moment(task.deadline, 'YYYY-MM-DD').toDate(), // Parse the deadline using the correct format
                    }));

                    this.draw();
                })
                .catch((error) => {
                    console.error('Error fetching tasks:', error);
                });
        },

        draw() {
            this.drawMonth();

            const currentDay = this.month.querySelector('.today');
            if (currentDay && typeof currentDay.scrollIntoView === 'function') {
                currentDay.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
        },
        getTaskColor(index) {
            const colors = ['#1B90FF', '#4DB1FF', '#0057D2']; // Define an array of colors
            const colorIndex = index % colors.length; // Get the color index based on the task index
            return colors[colorIndex]; // Return the color for the task point
        },

        drawMonth() {
            if (this.month) {
                this.oldMonth = this.month;
                this.next = moment(this.current, 'YYYY-MM-DD').isAfter(moment(this.oldMonth, 'YYYY-MM-DD'));
            }

            const month = document.createElement('div');
            month.className = 'month';

            const weeks = this.weeks;

            weeks.forEach((week) => {
                const weekElement = document.createElement('div');
                weekElement.className = 'week';

                week.forEach((day) => {
                    const dayElement = document.createElement('div');
                    dayElement.className = `day ${day.other ? 'other' : ''} ${day.today ? 'today' : ''}`;
                    dayElement.innerHTML = `
              <div class="day-number">${day.number}</div>
              <div class="day-tasks" v-show="day.tasks.length > 0"></div>
              <div class="finger-sign" v-show="day.showFingerSign"></div>
            `;

                    const buttonElement = document.createElement('button');
                    buttonElement.className = 'day-button';
                    buttonElement.addEventListener('click', () => {
                        this.openDay(day);
                    });
                    buttonElement.appendChild(dayElement);

                    weekElement.appendChild(buttonElement);
                });

                month.appendChild(weekElement);
            });

            this.month = month;
        },

        getEventsForDate(date) {
            return this.events.filter(event => moment(event.deadline).isSame(date, 'day'));
        },

        openDay(day) {
            if (day.tasks.length > 0) {
                this.selectedDay = day;
                this.selectedDay.tasks = this.getTasksForDate(day.date);
                this.openDetails = true;
            } else {
                this.selectedDay = null;
                this.openDetails = false;
            }
        },

        getTasksForDate(date) {
            return this.tasks.filter(task => moment(task.deadline).isSame(date, 'day'));
        },

        nextMonth() {
            this.current.add(1, 'month');
            this.fetchTasks();
            this.closeDayDetails();
        },

        prevMonth() {
            this.current.subtract(1, 'month');
            this.fetchTasks();
            this.closeDayDetails();
        },

        closeDayDetails() {
            this.selectedDay = null;
            this.openDetails = false;
        },

        formatDate(date) {
            return moment(date).format('DD MMMM YYYY');
        },

        showFingerSign(day) {
            day.showFingerSign = true;
        },

        hideFingerSign(day) {
            day.showFingerSign = false;
        },
    },
};
</script>

<style scoped>


body {
    background-color: #00144A;
}

.day-tasks {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    background-color: white;
}

.task-point {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin: 2px;
}

.finger-sign {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background-size: cover;
    opacity: 0.8;
    pointer-events: none;
}

.day-button {
    border: none;
    cursor: pointer;
    padding: 0;
    position: relative;
}

.task {
    margin-bottom: 5px;
}

.day-number {
    color: #00144A;
    font-size: 18px;
}
.dayWeek th {
    font-size: x-large;
    color: #0040B0;
}

.containerCalendar {

    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    color: #EBF8FF;
    background-color: #0040B0;
}

.header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    color: #EBF8FF;
}

.day-number {
    font-weight: bold;
    background-color: white;
    color: #00144A;
}

.table {
    table-layout: fixed;
    width: 100%;
    background-color: #0057d2;
}

.btn {
    font-size: 16px;
    background-color: #0057d2;
    color: #EBF8FF;
}
.space{
    padding-bottom: 20px;
}

.today {
    border-radius: 50%;
}
.other{
    background-color: #EBF8FF;
}
.other .day-number {
    background-color: #EBF8FF;
}
.other .day-tasks {
    background-color: #EBF8FF;
}

.footer-content{
    flex-shrink: 0;
    padding-top: 150px;
}
.bottom-bar{
    padding-bottom: 50px;
}




</style>


