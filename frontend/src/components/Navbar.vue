<template>
  <nav class="navbar navbar-expand border-bottom bg-dark">
    <div class="container">
      <router-link class="navbar-brand text-light" to="/"
        >TRANG CHỦ</router-link
      >
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/tenants" class="nav-link active text-light"
              >THÀNH VIÊN</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/rentals" class="nav-link active text-light"
              >HỢP ĐỒNG</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/maintenance" class="nav-link active text-light"
              >SỬA CHỮA
            </router-link>
          </li>
        </ul>

        <form class="d-flex" role="search">
          <input
            class="form-control me-2"
            type="search"
            placeholder="tìm tên hoặc phòng"
            aria-label="Search"
          />
          <button class="btn btn-outline-light" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
};
</script>

<style scoped>
h1 {
  margin: 0;
  font-size: 2rem;
}
</style>
