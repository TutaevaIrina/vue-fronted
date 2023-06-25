<template>
    <div class="container">
        <div class="addTask">
            <input v-model="nameField" placeholder="Enter title" type="text" ref="nameInput">
            <input v-model="descriptionField" placeholder="Enter description" ref="descriptionInput">
            <input v-model="deadlineField" placeholder="Select date" type="text" ref="deadlineInput">
            <button type="button" @click="submitForm">
                <font-awesome-icon icon="circle-plus" size="3x" class="circle-plus-icon" />
            </button>
        </div>
        <div>
            <div class = "errorText"></div>
        </div>
        <div>
            <h3 class = "h_yourTasks">Your tasks</h3>
        </div>
        <div class="filter">
            <select class="todoOptions">
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="deleted">Deleted</option>
            </select>
        </div>
        <div class="todoTable">
            <div class = "row">
            </div>
            <table class="table">
                <thead>
                <tr>
                    <th class ="column_checkbox"></th>
                    <th class ="column_task">Task</th>
                    <th class ="column_description">Description</th>
                    <th class ="column_deadline">Deadline</th>
                    <th class ="column_status">Status</th>
                    <th class ="column_action"></th>
                </tr>
                </thead>
                <tbody class="tasks" data-todo-option="active">
                <tr v-for="task in tasks" :key="task.id">
                    <td><input type="checkbox"></td>
                    <td>{{ task.name }}</td>
                    <td>{{ task.description }}</td>
                    <td>{{ formatDate(task.deadline) }}</td>
                    <td>{{ task.status }}</td>
                    <td>
                        <button @click="edit">
                            <font-awesome-icon icon="pen" class="pen"/>
                        </button>
                        <button @click="remove()">
                            <font-awesome-icon icon="trash" class="trash"/>
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
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
library.add(faCirclePlus);
library.add(faTrash);
library.add(faPen);

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
            filterCrit: ''
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
                    this.tasks = result
                })
                .catch(error => console.log('error', error))
        },
        save () {
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
                })
                .catch(error => console.log('error', error))
        },
        remove(id){
            const endpoint = `http://localhost:8080/delete/${id}`;
            const requestOptions = {
                method: 'DELETE',
                redirect: 'follow'
            };

            fetch(endpoint, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('Deleted', result);
                })
                .catch(error => {
                    console.log('Error:', error);
                });

        },
        edit(){

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
            let name = this.nameField.trim();
            let date = this.deadlineField.trim();
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
                this.nameField = ""; // Reset input fields
                this.descriptionField = "";
                this.deadlineField = "";
                document.querySelector(".errorText").innerHTML = "";
            }
        }
    }
}

</script>

<style scoped>

input{
    margin-right: 25px;
    width:100%;
    color: #00144A;
}
button{
    width:60px;
    color: #0057d2;
    background:  #EBF8FF;
    border-radius: 50%;
    margin-right: 20px;

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
.column_checkbox{
    width: 5%;
}
.column_task{
    width: 20%;
}
.column_description{
    width: 30%;
}
.column_deadline{
    width: 15%;
}
.column_status{
    width: 15%;
}
.column_action{
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
.errorText{
    color: red;
    padding-bottom: 50px;
}
.table{
    color: #D1EFFF;
    text-align: left;

}
.h_yourTasks{
    padding-top: 20px;
    text-align: center;
    text-transform: uppercase;
    -webkit-text-stroke: 1px  #0057d2;
    -webkit-text-fill-color: #D1EFFF;
}

</style>
