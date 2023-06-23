<template>
    <div class="container">
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
            <table class="table">
                <thead>
                <tr>
                    <th></th>
                    <th>Task</th>
                    <th>Description</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th></th>
                </tr>
                </thead>
                <tbody class="tasks" data-todo-option="active">
                <tr v-for="task in tasks" :key="task.id">
                    <td><input type="checkbox"></td>
                    <td>{{ task.name }}</td>
                    <td>{{ task.description }}</td>
                    <td>{{ task.deadline }}</td>
                    <td>{{ task.status }}</td>
                    <td><button @click="deleteTask">Delete</button></td>
                </tr>
                </tbody>
            </table>
        </div>
        <h3>Installed CLI Plugins</h3>
        <ul>
            <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>
            <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-router" target="_blank" rel="noopener">router</a></li>
            <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a></li>
            <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-jest" target="_blank" rel="noopener">unit-jest</a></li>
        </ul>
        <h3>Essential Links</h3>
        <ul>
            <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
            <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
            <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
            <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
            <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
        </ul>
        <h3>Ecosystem</h3>
        <ul>
            <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
            <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
            <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
            <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
            <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
        </ul>
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
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color2: #001442;
}

input{
    margin-right: 25px;
    width:400px;
    color: #00144A;
}
button{
    width:50px;
    color: #EBF8FF;
    background: #1B90FF;
    border-radius: 40px 40px 40px 40px / 200% 200%;
}
.addTask {
    display: flex;
    flex-direction: row;
    padding: 30px;
}

.container {
    max-width: 100%;
    max-height: 100%;
}
.todoTable {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-top: 50px;
}

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

</style>
