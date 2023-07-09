# vue

# Task Management Application

This is a task management application built with Vue.js. It allows users to create, update, and delete tasks with deadlines and track their status.

## Features

- Add tasks with a title, description, and deadline.
- Edit existing tasks and update their details.
- Mark tasks as completed.
- Delete tasks.
- Filter tasks based on their status (active, completed, expired, or all).
- Sort tasks based on their deadline.
- View tasks in a table format.
- Use a calendar view to visualize tasks for different dates.

## Technologies Used

- Vue.js
- flatpickr for date selection
- Font Awesome for icons
- HTML/CSS


## API Endpoints

The application interacts with a backend API to perform CRUD operations on tasks. The following endpoints are used:

-GET /tasks: Retrieve all tasks.
-POST /add: Add a new task.
-PUT /edit/:id: Update an existing task.
-DELETE /delete/:id: Delete a task.

# Credits

This project was developed by https://tutaevairina.github.io/vue-frontend/.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
