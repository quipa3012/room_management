<template>
  <div class="container mt-4">
    <h2 class="mb-4">Lịch sử bảo trì các phòng</h2>

    <!-- Lọc theo trạng thái -->
    <div class="row">
      <div class="col-lg-10"></div>
      <div class="mb-4 col-lg-2">
        <label for="statusFilter" class="form-label">Lọc theo trạng thái</label>
        <select
          v-model="statusFilter"
          id="statusFilter"
          class="form-select"
          @change="filterByStatus"
        >
          <option value="">Tất cả</option>
          <option value="0">Đang sửa chữa</option>
          <option value="1">Hoàn thành</option>
        </select>
      </div>
    </div>

    <!-- Hiển thị danh sách lịch sử bảo trì -->
    <div v-if="filteredMaintenanceList.length" class="row">
      <div
        class="col-md-4 mb-3"
        v-for="maintenance in filteredMaintenanceList"
        :key="maintenance.maintenance_id"
      >
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">
              Lịch sử bảo trì #{{ maintenance.maintenance_id }}
            </h5>
            <p class="card-text">
              Phòng số: {{ maintenance.room_id }} <br />
              Ngày bảo trì: {{ $formatDate(maintenance.maintenance_date) }}
              <br />
              Mô tả: {{ maintenance.description }} <br />
              Chi phí: {{ $formatCurrency(maintenance.expense) }} VND
              <span :class="getStatusClass(maintenance.status)">
                {{ getStatusText(maintenance.status) }}
              </span>
            </p>

            <!-- Chỉ hiển thị nút nếu trạng thái là "Đang sửa chữa" (status = 0) -->
            <div v-if="maintenance.status === 0">
              <router-link
                :to="`/maintenance/complete/${maintenance.maintenance_id}`"
                class="btn btn-outline-dark"
              >
                Hoàn tất sửa chữa
              </router-link>
              <router-link
                :to="`/maintenance/edit/${maintenance.maintenance_id}`"
                class="btn btn-outline-dark mx-1"
              >
                Chỉnh sửa
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Nếu không có dữ liệu bảo trì -->
    <div v-else>
      <p>Chưa có lịch sử bảo trì nào.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      maintenanceList: [], // Danh sách các lịch sử bảo trì
      statusFilter: "", // Trạng thái lọc
      filteredMaintenanceList: [], // Danh sách đã lọc
    };
  },
  async created() {
    try {
      // Gọi API để lấy danh sách lịch sử bảo trì
      const response = await axios.get("/maintenance");
      this.maintenanceList = response.data;

      // Khởi tạo danh sách đã lọc bằng tất cả dữ liệu
      this.filteredMaintenanceList = this.maintenanceList;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lịch sử bảo trì:", error);
    }
  },
  watch: {
    // Lắng nghe sự thay đổi của statusFilter để lọc lại dữ liệu
    statusFilter(newStatus) {
      this.filterByStatus();
    },
  },
  methods: {
    // Phương thức trả về trạng thái dựa trên status
    getStatusText(status) {
      return status === 0 ? "Đang sửa chữa" : "Hoàn thành";
    },
    // Phương thức trả về class tương ứng với trạng thái
    getStatusClass(status) {
      return status === 0 ? "badge bg-danger" : "badge bg-success";
    },
    // Phương thức lọc theo trạng thái
    filterByStatus() {
      if (this.statusFilter === "") {
        // Nếu không lọc, hiển thị tất cả
        this.filteredMaintenanceList = this.maintenanceList;
      } else {
        // Lọc theo trạng thái (0 hoặc 1)
        this.filteredMaintenanceList = this.maintenanceList.filter(
          (maintenance) => maintenance.status === parseInt(this.statusFilter)
        );
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
