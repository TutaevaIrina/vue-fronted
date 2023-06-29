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
            </select>

        </div>
        <div class="todoTable">
            <div class="row"></div>
            <table class="table">
                <thead>
                <tr>
                    <th class="column_checkbox"></th>
                    <th class="column_task">Task</th>
                    <th class="column_description">Description</th>
                    <th class="column_deadline">Deadline</th>
                    <th class="column_status">Status</th>
                    <th class="column_action"></th>
                </tr>
                </thead>
                <tbody class="tasks">
                <tr v-for="task in tasks" :key="task.id">
                    <td class="column_checkbox">
                        <button class="btn btn-primary-check" @click="toggleCompleted(task)">
                            <font-awesome-icon icon="check" class="check" />
                        </button>
                    </td>
                    <td class="column_task">
                        <span v-if="!task.editing">{{ task.name }}</span>
                        <input
                            v-else
                            type="text"
                            v-model="task.name"
                            class="editable-field edited-field"
                        />
                    </td>
                    <td class="column_description">
                        <span v-if="!task.editing">{{ task.description }}</span>
                        <input
                            v-else
                            type="text"
                            v-model="task.description"
                            class="editable-field edited-field"
                        />
                    </td>
                    <td class="column_deadline">
                        <span v-if="!task.editing">{{ formatDate(task.deadline) }}</span>
                        <input
                            v-else
                            type="text"
                            v-model="task.deadline"
                            :ref="'deadlineInput_' + task.id"
                            class="editable-field edited-field"
                            @focus="openDatePicker(task.id)"
                        />
                    </td>
                    <td class="column_status">
                        <span v-if="task.completed" class="text-success">Completed</span>
                        <span v-else-if="task.status === 'expired'" class="text-danger">Expired</span>
                        <span v-else class="text-warning">{{ task.status }}</span>
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
import {faCirclePlus, faFloppyDisk, faTrash, faPen, faCheck} from '@fortawesome/free-solid-svg-icons';
library.add(faCirclePlus);
library.add(faTrash);
library.add(faPen);
library.add(faCheck);
library.add(faFloppyDisk);

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
            filterCrit: 'active'
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
        openDatePicker(taskId) {
            const inputElement = this.$refs['deadlineInput_' + taskId];
            const task = this.tasks.find(task => task.id === taskId);

            flatpickr(inputElement, {
                minDate: "today",
                onChange: function (selectedDates) {
                    task.deadline = selectedDates[0];
                }
            });
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
                completed: task.completed
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
        watch: {
            filterCrit: {
                handler() {
                    this.loadTasks();
                },
                immediate: true
            }
        }
    }
}

</script>

<style scoped>

.editable-field {
    border: none;
    outline: none;
    background-color: transparent;
    color: inherit;
    padding: 0;
    margin: 0;
    font-size: inherit;
    width: 100%;
}

.edited-field {
    border-bottom: 1px solid gray;
}

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

.column_checkbox {
    width: 5%;
}

.column_task {
    width: 20%;
}

.column_description {
    width: 30%;
}

.column_deadline {
    width: 15%;
}

.column_status {
    width: 15%;
}

.column_action {
    width: 15%;
}

.filter {
    float: right;
    margin-right: 20px;
}

.todoOptions {
    width: 150px;
    color: #EBF8FF;
    background: #0057d2;
    border-radius: 30px 30px 30px 30px / 200% 200%;
}

.errorText {
    color: red;
    padding-bottom: 50px;
}

.table {
    color: #D1EFFF;
    text-align: left;
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

.btn.btn-primary-check:hover .circle-plus-icon,
.btn.btn-primary-check:focus .circle-plus-icon {
    color: #28a745;
}

.status-completed {
    color: green; /* Change the text color to green for completed tasks */
}

.status-active {
    color: orange; /* Change the text color to orange for active tasks */
}
</style>
