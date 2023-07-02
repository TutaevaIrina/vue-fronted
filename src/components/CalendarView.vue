<template>
    <div class="container">
        <div class="calendar-view">
            <h1>{{ msg }}</h1>
            <div class="header">
                <h1>{{ current.format('MMMM YYYY') }}</h1>
                <div class="d-flex align-items-center">
                    <button class="btn btn-primary mr-2" @click="prevMonth">Prev</button>
                    <button class="btn btn-primary" @click="nextMonth">Next</button>
                </div>
            </div>
            <table class="table">
                <thead>
                <tr>
                    <th scope="col" v-for="dayName in dayNames" :key="dayName">{{ dayName }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="week in weeks" :key="week">
                    <td v-for="day in week" :class="{'other': day.other, 'today': day.today}" :key="day.date">
                        <button class="day-button" @click="openDay(day)" @mouseover="showFingerSign(day)" @mouseleave="hideFingerSign(day)">
                            <div class="day-number">{{ day.date.date() }}</div>
                            <div class="day-tasks" v-show="day.tasks.length > 0">
                                <span v-for="(task, index) in day.tasks" class="task-point" :style="{ backgroundColor: getTaskColor(index) }" :key="index"></span>
                            </div>
                            <div class="finger-sign" v-show="day.showFingerSign"></div>
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="details" :class="{'in': openDetails, 'out': !openDetails}" @animationend="handleAnimationEnd">
                <div class="arrow"></div>
                <div class="events" :class="{'in': openDetails, 'out': !openDetails}">
                    <div v-if="selectedDay">
                        <div v-for="event in selectedDay.events" class="event" :class="{'empty': !event}" :key="event">
                            {{ event.title }}
                        </div>
                        <div v-for="task in selectedDay.tasks" class="task" :class="{'empty': !task}" :key="task">
                            {{ task.name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment'

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
        },
        legend() {
            const categories = ['blue', 'orange', 'green', 'yellow'];
            return categories.map((category) => ({
                text: category,
                color: category,
            }));
        },
    },

    methods: {
        fetchTasks() {
            // Make an HTTP request to fetch tasks from the backend
            // You can use a library like Axios or the built-in fetch API

            // Example using Axios:
            axios
                .get('http://localhost:8080/tasks')
                .then((response) => {
                    // Assign the fetched tasks to the component data
                    this.tasks = response.data.map((task) => ({
                        name: task.name,
                        deadline: moment(task.deadline, 'YYYY-MM-DD').toDate(), // Parse the deadline using the correct format
                    }));

                    // Draw the calendar
                    this.draw();
                })
                .catch((error) => {
                    // Handle error
                    console.error('Error fetching tasks:', error);
                });
        },

        draw() {
            // Draw the calendar
            this.drawMonth();

            const currentDay = this.month.querySelector('.today');
            if (currentDay) {
                currentDay.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
        },
        getTaskColor(index) {
            const colors = ['#D1EFFF', '#4DB1FF', '#0057D2', '#0040B0']; // Define an array of colors
            const colorIndex = index % colors.length; // Get the color index based on the task index
            return colors[colorIndex]; // Return the color for the task point
        },

        drawMonth() {
            if (this.month) {
                this.oldMonth = this.month;
                this.next = moment(this.current).isAfter(this.oldMonth);
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

        closeDay() {
            this.openDetails = false;
            this.selectedDay = null;
        },

        nextMonth() {
            this.current.add(1, 'month');
            this.fetchTasks();
        },

        prevMonth() {
            this.current.subtract(1, 'month');
            this.fetchTasks();
        },
        formatDate(date) {
            return moment(date).format('Do MMMM YYYY');
        },

        handleAnimationEnd() {
            if (this.oldMonth && this.oldMonth.parentNode) {
                this.oldMonth.parentNode.removeChild(this.oldMonth);
                this.oldMonth = null;
            }
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

<style>
@import url('https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css');
.day-tasks {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
}

.task-point {
    display: inline-block;
    width: 10px; /* Increase the size of the task point */
    height: 10px; /* Increase the size of the task point */
    background-color: red; /* Replace with desired color */
    border-radius: 50%;
    margin: 2px; /* Add spacing between the task points */
}

.finger-sign {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    /* Replace with the path to your finger sign image */
    background-size: cover;
    opacity: 0.8;
    pointer-events: none;
}

.day-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    position: relative; /* Add position relative to the day button */
}

.details {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    width: 200px;
    height: 200px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    z-index: 1; /* Add a higher z-index to the details container */
}

.in {
    opacity: 1;
    visibility: visible;
    z-index: 1; /* Add a higher z-index to the details container */
}

.out {
    opacity: 0;
    visibility: hidden;
    z-index: -1; /* Set a negative z-index to move the details container behind the calendar */
}


.arrow {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #fff;
}

.events {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.event,
.task {
    margin-bottom: 5px;
}

.empty {
    color: gray;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.week {
    display: flex;
}

.day {
    flex: 1;
    position: relative;
    text-align: center;
    padding: 10px 0;
}

.other {
    color: gray;
}

.today {
    border-radius: 50%;
}

.day-number {
    font-weight: bold;
}

.table {
    table-layout: fixed;
    width: 100%;
}

.btn {
    font-size: 16px;
}
</style>
