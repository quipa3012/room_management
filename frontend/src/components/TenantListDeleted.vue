<template>
  <div class="container mt-4">
    <h2 class="mb-4">Danh sách thành viên đã xóa</h2>

    <div v-if="deletedTenants.length > 0" class="row">
      <div
        class="col-md-4 mb-3"
        v-for="tenant in deletedTenants"
        :key="tenant.id"
      >
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{ tenant.full_name }}</h5>
            <p class="card-text">
              Điện thoại: {{ tenant.phone_number }} <br />
              Ngày sinh: {{ $formatDate(tenant.date_of_birth) }} <br />
              Giới tính: {{ $formatGender(tenant.gender) }}
            </p>
            <button
              class="btn btn-outline-success"
              @click="restoreTenant(tenant.tenant_id)"
            >
              Khôi phục
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Không có thành viên đã xóa.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      deletedTenants: [], // Mảng chứa thông tin thành viên đã xóa
    };
  },
  async created() {
    try {
      // Gọi API để lấy danh sách thành viên đã xóa
      const response = await axios.get("/tenants/deleted");
      this.deletedTenants = response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thành viên đã xóa:", error);
    }
  },
  methods: {
    async restoreTenant(tenant_id) {
      try {
        // Gọi API để khôi phục thành viên
        await axios.put(`/tenants/restore/${tenant_id}`);

        // Xóa thành viên khôi phục khỏi danh sách hiện tại
        this.deletedTenants = this.deletedTenants.filter(
          (tenant) => tenant.tenant_id !== tenant_id
        );

        alert("Khôi phục thành viên thành công!");
      } catch (error) {
        console.error("Lỗi khi khôi phục thành viên:", error);
        alert("Khôi phục thành viên thất bại!");
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
