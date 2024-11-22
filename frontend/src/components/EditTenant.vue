<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <h2 class="col-lg-4 text-center mb-4">Chỉnh sửa thông tin thành viên</h2>
    </div>

    <div class="row justify-content-center">
      <div v-if="tenant" class="col-lg-4">
        <form @submit.prevent="updateTenant">
          <div class="mb-3">
            <label for="full_name" class="form-label">Họ và tên</label>
            <input
              type="text"
              class="form-control"
              id="full_name"
              v-model="tenant.full_name"
              required
            />
          </div>
          <div class="mb-3">
            <label for="phone_number" class="form-label">Số điện thoại</label>
            <input
              type="text"
              class="form-control"
              id="phone_number"
              v-model="tenant.phone_number"
              required
            />
          </div>
          <div class="mb-3">
            <label for="date_of_birth" class="form-label">Ngày sinh</label>
            <input
              type="date"
              class="form-control"
              id="date_of_birth"
              v-model="tenant.date_of_birth"
              required
            />
          </div>
          <div class="mb-3">
            <label for="gender" class="form-label">Giới tính</label>
            <select
              class="form-control"
              id="gender"
              v-model="tenant.gender"
              required
            >
              <option :value="0">Nam</option>
              <option :value="1">Nữ</option>
            </select>
          </div>
          <div class="row justify-content-center">
            <button type="submit" class="btn btn-outline-dark col-lg-3">
              Cập nhật
            </button>
          </div>
        </form>
      </div>
      <div v-else>
        <p>Đang tải thông tin thành viên...</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tenant: null,
    };
  },
  async created() {
    try {
      const tenantId = this.$route.params.tenant_id;
      const response = await axios.get(`/tenants/${tenantId}`);
      this.tenant = response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin thành viên:", error);
    }
  },
  methods: {
    async updateTenant() {
      try {
        const tenantId = this.$route.params.tenant_id;
        const response = await axios.put(`/tenants/${tenantId}`, this.tenant);
        alert("Thông tin thành viên đã được cập nhật!");
        this.$router.push("/tenants");
      } catch (error) {
        console.error("Lỗi khi cập nhật thông tin thành viên:", error);
        alert("Không thể cập nhật thông tin.");
      }
    },
  },
};
</script>

<style scoped>
h2 {
  font-size: 1.5rem;
}

.form-label {
  font-weight: bold;
}

button {
  margin-top: 10px;
}
</style>
