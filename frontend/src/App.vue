<template>
  <div id="app">
    <header>
      <Navbar />
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
// Import các component đã tạo
import Navbar from "./components/Navbar.vue";

export default {
  name: "App",
  components: {
    Navbar, // Chỉ cần Navbar ở đây
  },
};
</script>
