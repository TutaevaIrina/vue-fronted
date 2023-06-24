<template>
    <div class="container">
        <div :style="myStyle" id="container" >
        <div class="addTask">
            <input v-model="nameField" placeholder="Enter title" type="text" ref="nameInput">
            <input v-model="descriptionField" placeholder="Enter description" @keyup.enter="save()">
            <input v-model="deadlineField" placeholder="Select date" type="text" ref="deadlineInput">
            <button type="button" @click="submitForm">+</button>
        </div>
        <div>
            <div class = "errorText"></div>
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
            <h1> List of tasks</h1>
            </div>
            <table class="table">
                <thead>
                <tr>
                    <th></th>
                    <th id="Task">Task</th>
                    <th id="Description">Description</th>
                    <th id="Deadline">Deadline</th>
                    <th id="Status">Status</th>
                    <th id="Action">Action</th>
                    <th></th>
                </tr>
                </thead>
                <tbody class="tasks" data-todo-option="active">
                <tr v-for="task in tasks" :key="task.id">
                    <td><input type="checkbox"></td>
                    <td>{{ task.name }}</td>
                    <td>{{ task.description }}</td>
                    <td>{{ formatDate(task.deadline) }}</td>
                    <td>{{ task.status }}</td>
                    <td>{{ task.action }}</td>
                    <td><button @click="deleteTask">Delete</button></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    </div>
</template>


<script>
import "flatpickr/dist/flatpickr.css";
import flatpickr from "flatpickr";

export default {
    name: 'HelloWorld',
    props: {
        msg: String
    },
    data() {
        return {
            myStyle:{color:"#00144A"},
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
    width:400px;
    color: #00144A;
}
button{
    width:150px;
    color: #EBF8FF;
    background: #1B90FF;
    border-radius: 40px 40px 40px 40px / 200% 200%;
    margin-right: 50px;
}
.addTask {
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
.todoTable th#Task { width: 10%; }
.todoTable th#Description { width: 50%; }
.todoTable th#Deadline { width: 10%; }
.todoTable th#Status { width: 10%; }
.todoTable th#Action { width: 10%; }


.filter {
    float: right;
    margin-right: 20px;

}
.todoOptions {
    width: 150px;
    color: #EBF8FF;
    background: #1B90FF;
    border-radius: 30px 30px 30px 30px / 200% 200%;
}
.errorText{
    color: red;
}
.row{
    color: white;
    text-align:center;
    margin-right: 600px;
}

</style>
