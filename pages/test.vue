<template>
  <div class="wrapper">
    <button @click="changeMessage">Change message</button>
    <button @dblclick="changeMessage">Change message</button>
    <button @mousemove="changeMessage">Change message</button>
  </div>
</template>

<script>
export default {
  methods: {
    changeMessage(e) {
      console.log(e, e.type);
    },
  },
};
</script>

<style scoped>
.wrapper {
  margin: 20vh 0;
}
</style>
