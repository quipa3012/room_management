<template>
  <div class="container mt-4">
    <h2 class="mb-4">Danh sách thành viên</h2>

    <div class="row mb-5">
      <div class="col-lg-10 mt-4">
        <router-link to="/tenants/add-tenant" class="btn btn-outline-dark">
          Thêm thành viên
        </router-link>
        <router-link to="/tenants/deleted" class="btn btn-outline-danger ms-3">
          Xem thành viên đã xóa
        </router-link>
      </div>
    </div>

    <div v-if="tenants.length > 0" class="row">
      <div
        class="col-md-4 mb-3"
        v-for="tenant in tenants"
        :key="tenant.tenant_id"
      >
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{ tenant.full_name }}</h5>
            <p class="card-text">
              Điện thoại: {{ tenant.phone_number }} <br />
              Ngày sinh: {{ $formatDate(tenant.date_of_birth) }} <br />
              Giới tính: {{ $formatGender(tenant.gender) }}
            </p>
            <router-link
              :to="`/tenants/${tenant.tenant_id}`"
              class="btn btn-outline-dark"
              >Xem thông tin</router-link
            >
            <router-link
              :to="`/tenants/edit/${tenant.tenant_id}`"
              class="btn btn-outline-dark mx-1"
              >Chỉnh sửa</router-link
            >
            <button
              @click="deleteTenant(tenant.tenant_id)"
              class="btn btn-outline-dark"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Không có thành viên nào.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tenants: [], // Mảng chứa thông tin thành viên
    };
  },
  async created() {
    try {
      // Gọi API để lấy danh sách thành viên
      const response = await axios.get("/tenants"); // Giả sử API trả về danh sách thành viên tại "/tenants"
      this.tenants = response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thành viên:", error);
    }
  },
  methods: {
    async deleteTenant(tenant_id) {
      if (confirm("Bạn có chắc chắn muốn xóa thành viên này?")) {
        try {
          // Gọi API xóa thành viên
          await axios.delete(`/tenants/${tenant_id}`);
          // Sau khi xóa thành công, xóa thành viên khỏi danh sách hiển thị
          this.tenants = this.tenants.filter(
            (tenant) => tenant.tenant_id !== tenant_id
          );
          alert("Thành viên đã được xóa.");
        } catch (error) {
          console.error("Lỗi khi xóa thành viên:", error);
          alert("Không thể xóa thành viên.");
        }
      }
    },
  },
};
</script>

<style scoped>
h2 {
  font-size: 1.5rem;
}

.card-title {
  font-weight: bold;
}

.card-text {
  font-size: 14px;
}

.card-body {
  padding: 15px;
}
</style>
