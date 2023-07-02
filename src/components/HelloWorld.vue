<template>
    <div class="container">
        <div class="addTask">
            <input v-model="nameField" placeholder="Enter title" type="text" ref="nameInput" class="form-control">
            <input v-model="descriptionField" placeholder="Enter description" ref="descriptionInput" class="form-control">
            <input v-model="deadlineField" placeholder="Select date" type="text" ref="deadlineInput" class="form-control">
            <button type="button" @click="submitForm" class="btn btn-primary">
                <font-awesome-icon icon="circle-plus" size="2x" class="circle-plus-icon" />
            </button>
        </div>
        <div>
            <div class="errorText"></div>
        </div>
        <div>
            <h4 class="h_yourTasks">Your tasks</h4>
        </div>
        <div class="filter">
            <select class="form-select" v-model="filterCrit">
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="expired">Expired</option>
                <option value="all">All</option>
            </select>
        </div>
        <div class="todoTable">
            <div class="row"></div>
            <table class="table table-hover" style="background-color: #f8f9fa;">
                <thead class="table-head">
                <tr>
                    <th class="column-checkbox"></th>
                    <th class="column-task">Task</th>
                    <th class="column-description">Description</th>
                    <th class="column-deadline" @click="toggleSortDirection">
                        Deadline
                        <font-awesome-icon icon="sort" class="sort" @click="sort" />
                    </th>
                    <th class="column-status">Status</th>
                    <th class="column-action"></th>
                </tr>
                </thead>
                <tbody class="tasks">
                <tr v-for="task in filteredTasks" :key="task.id">
                    <td class="column_checkbox">
                        <button :class="['btn', 'btn-primary-check', { 'btn-success': task.completed }]" @click="toggleCompleted(task)">
                            <font-awesome-icon icon="check" class="check" />
                        </button>
                    </td>
                    <td class="column_task">
                        <span v-if="!task.editing">{{ task.name }}</span>
                        <input v-else type="text" v-model="task.name" class="form-control"/>
                    </td>
                    <td class="column_description">
                        <span v-if="!task.editing">{{ task.description }}</span>
                        <input v-else type="text" v-model="task.description" class="form-control"/>
                    </td>
                    <td class="column_deadline">
                        <span v-if="!task.editing">{{ formatDate(task.deadline) }}</span>
                        <input
                            v-else
                            type="date"
                            class="form-control"
                            v-model="task.deadline"
                            :min="getCurrentDate()"
                        />
                    </td>
                    <td class="column_status text-center">
                        <span v-if="task.completed" class="text-success">
                            <div class="text-completed">Completed
                            </div>
                        </span>
                        <span v-else-if="task.status === 'expired'" class="text-danger">
                             <div class="text-expired">Expired
                            </div>
                        </span>
                        <span v-else-if="task.status === 'active'" class="text-warning">
                            <div class="text-active">Active
                            </div>
                        </span>
                    </td>
                    <td class="column_action">
                        <button @click="edit(task)" class="btn btn-primary" v-if="!task.editing">
                            <font-awesome-icon icon="pen" class="pen" />
                        </button>
                        <button @click="update(task)" class="btn btn-success" v-if="task.editing">
                            <font-awesome-icon icon="floppy-disk" class="disk" />
                        </button>
                        <button @click="remove(task.id)" class="btn btn-danger">
                            <font-awesome-icon icon="trash" class="trash" />
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import "flatpickr/dist/flatpickr.css";
import flatpickr from "flatpickr";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {faCirclePlus, faFloppyDisk, faTrash, faPen, faCheck, faSort} from '@fortawesome/free-solid-svg-icons';
library.add(faCirclePlus);
library.add(faTrash);
library.add(faPen);
library.add(faCheck);
library.add(faFloppyDisk);
library.add(faSort);

export default {
    name: 'HelloWorld',
    props: {
        msg: String
    },
    components: {
        FontAwesomeIcon,
    },
    data() {
        return {
            tasks: [],
            nameField: '',
            descriptionField: '',
            deadlineField: '',
            filterCrit: 'all',
            sortDirection: 'desc',
        }
    },
    mounted() {
        flatpickr(this.$refs.deadlineInput, {
            minDate: "today"
        });
        this.loadTasks();
    },

    methods: {
        loadTasks() {
            const endpoint = 'http://localhost:8080/tasks';
            const requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch(endpoint, requestOptions)
                .then(response => response.json())
                .then(result => {
                    this.tasks = result.map(task => ({
                        ...task,
                        editing: false,
                        status: this.getTaskStatus(task.deadline),
                        completed: task.completed
                    }));
                })
                .catch(error => console.log('error', error))
        },
        save() {
            const endpoint = 'http://localhost:8080/add'
            const data = {
                name: this.nameField,
                description: this.descriptionField,
                deadline: this.deadlineField
            }
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
            fetch(endpoint, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data)
                    location.reload();
                })
                .catch(error => console.log('error', error))
        },
        remove(id) {
            const task = this.tasks.find((task) => task.id === id);
            if (confirm(`Are you sure you want to delete the task "${task.name}"?`)) {
                const endpoint = `http://localhost:8080/delete/${id}`;
                const requestOptions = {
                    method: 'DELETE',
                    redirect: 'follow'
                };
                fetch(endpoint, requestOptions)
                    .then(result => {
                        console.log('Deleted', result);
                        location.reload();
                    })
                    .catch(error => {
                        console.log('Error:', error);
                    });
            }
        },
        edit(task) {
            task.editing = true;
        },
        update(task) {
            const endpoint = `http://localhost:8080/edit/${task.id}`;
            if (
                this.nameField === task.name &&
                this.descriptionField === task.description &&
                this.deadlineField === task.deadline
            ) {
                task.editing = false;
                return;
            }

            const data = {
                name: task.name,
                description: task.description,
                deadline: task.deadline,
            };

            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };

            fetch(endpoint, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    this.loadTasks();
                })
                .catch(error => console.log('error', error));
            task.editing = false;
            this.deadlineField = task.deadline;
        },
        formatDate(date) {
            const options = {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
            };
            return new Date(date).toLocaleDateString('en-GB', options);
        },
        submitForm() {
            let name = this.nameField;
            let date = this.deadlineField;
            let errorText = "";
            if (name === "" && date === "") {
                errorText = "Enter the title and the date";
            } else if (name === "") {
                errorText = "Enter the title";
            } else if (date === "") {
                errorText = "Enter the date";
            }
            if (errorText !== "") {
                document.querySelector(".errorText").innerHTML = errorText;
            } else {
                this.save();
                this.loadTasks();
                this.nameField = "";
                this.descriptionField = "";
                this.deadlineField = "";
                document.querySelector(".errorText").innerHTML = "";
            }
        },
        getTaskStatus(deadline) {
            const currentDate = new Date();
            const taskDeadline = new Date(deadline);

            if (taskDeadline < currentDate) {
                return "expired";
            } else if (taskDeadline > currentDate) {
                return "active";
            } else {
                return "completed";
            }
        },
        toggleCompleted(task) {
            task.completed = !task.completed;

            const endpoint = `http://localhost:8080/edit/${task.id}`;
            const data = {
                completed: task.completed,
                name: task.name,
                description: task.description,
                deadline: task.deadline
            };

            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };

            fetch(endpoint, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch(error => console.log('error', error));
        },
        getCurrentDate() {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            let month = (currentDate.getMonth() + 1).toString();
            let day = currentDate.getDate().toString();

            if (month.length === 1) {
                month = '0' + month;
            }
            if (day.length === 1) {
                day = '0' + day;
            }
            return `${year}-${month}-${day}`;
        },

        toggleSortDirection() {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        }
    },
    computed: {
        filteredTasks() {
            const filter = this.filterCrit;
            if (filter === "active") {
                return this.sortedTasks.filter(
                    (task) => !task.completed && task.status === "active"
                );
            } else if (filter === "completed") {
                return this.sortedTasks.filter((task) => task.completed);
            } else if (filter === "expired") {
                return this.sortedTasks.filter(
                    (task) => !task.completed && task.status === "expired"
                );
            } else if (filter === "all") {
                return this.sortedTasks;
            }
            return this.sortedTasks;
        },
        sortedTasks() {
            const sorted = [...this.tasks];
            sorted.sort((a, b) => {
                const dateA = new Date(a.deadline);
                const dateB = new Date(b.deadline);
                if (this.sortDirection === 'asc') {
                    return dateA - dateB;
                } else {
                    return dateB - dateA;
                }
            });
            return sorted;
        },
    }
}

</script>

<style scoped>

input {
    margin-right: 25px;
    width: 100%;
    color: #00144A;
}

button {
    width: 50px;
    height: 50px;
    color: #0057d2;
    background: #EBF8FF;
    border-radius: 50%;
    margin-right: 20px;
}

.circle-plus-icon {
    margin-left: -3px;
    margin-top: 3px;
}

.addTask {
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 30px;
}

.container {
    max-width: 100%;
    max-height: 100%;
    color: #00144A;
}

.todoTable {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-top: 50px;
    width: 100%;
}
.todoTable table.table-striped thead {
    background-color: #D1EFFF;
    color: #00144a;
}

.column_checkbox {
    width: 5%;
    background-color: #00144A;
    color: #EBF8FF;
}

.column_task {
    width: 20%;
    background-color: #00144A;
    color: #EBF8FF;
    font-size: medium;

}

.column_description {
    width: 30%;
    background-color: #00144A;
    color: #EBF8FF;
    font-size: medium;
}

.column_deadline {
    width: 15%;
    align-content: center;
    background-color: #00144A;
    color: #EBF8FF;
    font-weight: bolder;
}

.column_status {
    width: 3%;
    text-align: center;
    background-color: #00144A;
    color: #EBF8FF;
}

.column_action {
    width: 15%;
    background-color: #00144A;
    color: #EBF8FF;
    text-align: center;
}
.column-checkbox{
    background-color: #00144A;
}
.column-task{
    background-color: #00144A;
    color: #4DB1FF;
    font-size: large;
    font-weight: bold;
    padding-bottom: 20px;
}
.column-description{
    background-color: #00144A;
    color: #4DB1FF;
    font-size: large;
    font-weight: bold;
    padding-bottom: 20px;
}
.column-deadline{
    background-color: #00144A;
    color: #4DB1FF;
    font-size: large;
    font-weight: bold;
    padding-bottom: 20px;
}
.column-status{
    background-color: #00144A;
    color: #4DB1FF;
    font-size: large;
    font-weight: bold;
    padding-bottom: 20px;
    text-align: center;
}
.column-action{
    background-color: #00144A;
}
.filter {
    float: right;
    margin-right: 20px;
}
.form-select{
    font-weight: bolder;
}

.errorText {
    color: red;
    padding-bottom: 50px;
}
.text-success{
    font-weight: bold;
}
.text-warning{
    font-weight: bold;
}
.text-danger{
    font-weight: bold;
}

.table.table-hover {
    text-align: left;
}

.table.table-hover th,
.table.table-hover td {
    border: none;
}
.table-hover tbody tr:hover td, .table-hover tbody tr:hover th {
    background-color: #0040B0;
}
.form-control{
    background-color: #EBF8FF;
    color: #0040B0;
}

.h_yourTasks {
    padding-top: 20px;
    text-align: center;
    text-transform: uppercase;
    -webkit-text-stroke: 1px #0057d2;
    -webkit-text-fill-color: #D1EFFF;
}

.btn-primary-check:hover,
.btn-primary-check:focus {
    color: #28a745;
    border-color: #28a745;
}
.form-select{
    background-color: #EBF8FF;
    color: #0040B0;
}
.text-completed{

    background-color: #F5FAE5;
    width: 105px;
    color: #188918;
    font-size: medium;
    border-radius: 40%;
    text-align-all: center;
    padding: 5px;

}
.text-expired{
    background-color: #FFEAF4;
    width: 105px;
    color: #D20A0A;
    border-radius: 40%;
    text-align-all: center;
    padding: 5px;
}
.text-active{
    background-color: #FFF8D6;
    width: 105px;
    color: #C35500;
    border-radius: 40%;
    text-align-all: center;
    padding: 5px;
}


.btn.btn-primary-check:hover .circle-plus-icon,
.btn.btn-primary-check:focus .circle-plus-icon {
    color: #28a745;
}

</style>

