<template>
  <div class="container mt-5">
    <h2 class="mb-4">Hoàn tất sửa chữa</h2>
    <p class="lead">
      Đang hoàn tất sửa chữa cho lịch sử sửa chữa #{{ maintenance_id }}
    </p>

    <!-- Hiển thị thông tin sửa chữa nếu có -->
    <div v-if="maintenance" class="card p-3 mb-4">
      <h4 class="card-title">Thông tin sửa chữa</h4>
      <div class="mb-3">
        <p><strong>Phòng:</strong> Phòng {{ maintenance.room_id }}</p>
      </div>
      <div class="mb-3">
        <p><strong>Mô tả:</strong> {{ maintenance.description }}</p>
      </div>
      <div class="mb-3">
        <p>
          <strong>Chi phí sửa chữa:</strong>
          {{ $formatCurrency(maintenance.expense) }} VND
        </p>
      </div>
      <div class="mb-3">
        <p>
          <strong>Trạng thái:</strong>
          <span :class="statusClass">{{ statusText }}</span>
        </p>
      </div>
    </div>

    <!-- Nút hoàn tất sửa chữa -->
    <button
      class="btn btn-outline-dark btn-lg"
      @click="completeMaintenance"
      :disabled="maintenance && maintenance.status !== 0"
    >
      Hoàn tất
    </button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      maintenance_id: this.$route.params.maintenance_id, // Lấy maintenance_id từ URL
      maintenance: null, // Lưu thông tin sửa chữa
    };
  },
  async created() {
    try {
      // Gọi API để lấy chi tiết thông tin sửa chữa
      const response = await axios.get(`/maintenance/${this.maintenance_id}`);
      this.maintenance = response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sửa chữa:", error);
    }
  },
  methods: {
    // Phương thức hoàn tất sửa chữa
    async completeMaintenance() {
      try {
        // Gửi PUT request để hoàn tất sửa chữa
        await axios.put(`/maintenance/complete/${this.maintenance_id}`);

        alert("Lịch sử sửa chữa đã được hoàn thành!");

        // Chuyển hướng về trang danh sách lịch sử bảo trì
        this.$router.push("/maintenance");
      } catch (error) {
        console.error("Lỗi khi hoàn tất sửa chữa:", error);
      }
    },
  },
  computed: {
    // Trạng thái hiển thị cho sửa chữa
    statusText() {
      // Kiểm tra nếu maintenance tồn tại và có status
      if (this.maintenance) {
        return this.maintenance.status === 0 ? "Chưa hoàn tất" : "Đã hoàn tất";
      }
      return ""; // Nếu maintenance chưa có dữ liệu, trả về chuỗi rỗng
    },
    // Lớp CSS thay đổi màu sắc trạng thái
    statusClass() {
      // Kiểm tra nếu maintenance tồn tại và có status
      if (this.maintenance) {
        return this.maintenance.status === 0 ? "text-danger" : "text-success";
      }
      return ""; // Nếu maintenance chưa có dữ liệu, trả về chuỗi rỗng
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
}

h2 {
  font-size: 2rem;
  font-weight: bold;
}

h4 {
  font-size: 1.5rem;
  color: #333;
}

.card {
  background-color: #f9f9f9;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
}

p {
  font-size: 1.1rem;
}

button {
  width: 100%;
  font-size: 1.1rem;
  padding: 10px;
  border-radius: 5px;
}

.text-danger {
  color: #dc3545 !important;
}

.text-success {
  color: #28a745 !important;
}
</style>
