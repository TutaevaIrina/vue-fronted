<template>
  <nav>
    <router-link to="/">Your tasks</router-link> |
    <router-link to="/about">Calendar</router-link>
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #4DB1FF;
}

nav {
  padding: 40px;
}

nav a {
  font-weight: bold;
  color: #0057d2;
}

nav a.router-link-exact-active {
  color: #D1EFFF;
    font-size: x-large;

}
</style>
