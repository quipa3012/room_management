<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <h2 class="mb-4 col-lg-5 text-center">
        Chỉnh sửa lịch sử bảo trì #{{ maintenanceId }}
      </h2>
    </div>

    <!-- Form chỉnh sửa -->
    <div class="row justify-content-center">
      <form @submit.prevent="updateMaintenance" class="col-lg-5">
        <div class="mb-3">
          <label for="description" class="form-label">Mô tả</label>
          <textarea
            id="description"
            class="form-control"
            v-model="maintenance.description"
            rows="3"
          ></textarea>
        </div>

        <div class="mb-3">
          <label for="expense" class="form-label">Chi phí (VND)</label>
          <input
            type="number"
            step="10000"
            id="expense"
            class="form-control"
            v-model="maintenance.expense"
          />
        </div>

        <div class="row justify-content-center">
          <button type="submit" class="btn btn-outline-dark col-lg-3">
            Cập nhật
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
      maintenanceId: this.$route.params.maintenance_id, // Lấy maintenanceId từ URL
      maintenance: {
        description: "",
        expense: null,
      },
    };
  },
  async created() {
    try {
      // Lấy thông tin chi tiết bảo trì khi trang được tạo
      const response = await axios.get(
        `http://localhost:3000/api/maintenance/${this.maintenanceId}`
      );
      this.maintenance = response.data; // Gán dữ liệu nhận được vào đối tượng maintenance
    } catch (error) {
      console.error("Lỗi khi lấy thông tin lịch sử bảo trì:", error);
    }
  },
  methods: {
    async updateMaintenance() {
      try {
        // Gửi yêu cầu PUT để cập nhật thông tin
        await axios.put(
          `http://localhost:3000/api/maintenance/${this.maintenanceId}`,
          this.maintenance
        );
        alert("Cập nhật thành công!");
        this.$router.push("/maintenance"); // Chuyển về trang danh sách lịch sử bảo trì
      } catch (error) {
        console.error("Lỗi khi cập nhật lịch sử bảo trì:", error);
        alert("Có lỗi xảy ra khi cập nhật!");
      }
    },
  },
};
</script>

<style scoped>
h2 {
  font-size: 1.5rem;
}
</style>
