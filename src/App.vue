<template>
<div id="apple">
    <router-view :key="$route.fullPath"></router-view>
</div>
</template>

<script>

export default {
  name: 'app',
 
}
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
#apple{
  width: 100%;
  height:100%
}
</style>
