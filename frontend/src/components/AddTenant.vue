<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <h2 class="col-lg-4 text-center mb-4">Thêm Thành Viên Mới</h2>
    </div>

    <div class="row justify-content-center">
      <form @submit.prevent="handleSubmit" class="col-lg-4">
        <!-- Các trường nhập liệu cho thông tin thành viên -->
        <div class="mb-3">
          <label for="tenantId" class="form-label">CCCD</label>
          <input
            type="text"
            class="form-control"
            id="tenantId"
            v-model="tenant_id"
            required
          />
        </div>
        <div class="mb-3">
          <label for="fullName" class="form-label">Họ và Tên</label>
          <input
            type="text"
            class="form-control"
            id="fullName"
            v-model="full_name"
            required
          />
        </div>
        <div class="mb-3">
          <label for="phoneNumber" class="form-label">Số Điện Thoại</label>
          <input
            type="text"
            class="form-control"
            id="phoneNumber"
            v-model="phone_number"
            required
          />
        </div>
        <div class="mb-3">
          <label for="dateOfBirth" class="form-label">Ngày Sinh</label>
          <input
            type="date"
            class="form-control"
            id="dateOfBirth"
            v-model="date_of_birth"
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Giới Tính</label>
          <select class="form-control" v-model="gender" required>
            <option :value="1">Nam</option>
            <option :value="0">Nữ</option>
          </select>
        </div>
        <div class="row justify-content-center">
          <button type="submit" class="btn btn-outline-dark col-lg-5">
            Thêm Thành Viên
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tenant_id: "", // CCCD nhập vào
      full_name: "",
      phone_number: "",
      date_of_birth: "",
      gender: 1, // Mặc định là Nam
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const newTenant = {
          tenant_id: this.tenant_id, // Truyền tenant_id người dùng nhập
          full_name: this.full_name,
          phone_number: this.phone_number,
          date_of_birth: this.date_of_birth,
          gender: this.gender,
        };

        // Gọi API để thêm thành viên mới
        const response = await axios.post("/tenants", newTenant);
        console.log(response.data.message);
        alert("Thêm thành viên thành công!");
        this.$router.push("/tenants");

        this.resetForm();
      } catch (error) {
        console.error("Lỗi khi thêm thành viên mới:", error);
        alert("Có lỗi xảy ra khi thêm thành viên.");
      }
    },
    resetForm() {
      this.tenant_id = "";
      this.full_name = "";
      this.phone_number = "";
      this.date_of_birth = "";
      this.gender = 1;
    },
  },
};
</script>

<style scoped>
h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.form-label {
  font-weight: bold;
}
</style>
