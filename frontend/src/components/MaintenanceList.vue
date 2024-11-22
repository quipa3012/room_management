<template>
  <div class="container mt-4">
    <h2 class="mb-4">Lịch sử bảo trì các phòng</h2>

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
      maintenanceList: [],
      statusFilter: "",
      filteredMaintenanceList: [],
    };
  },
  async created() {
    try {
      const response = await axios.get("/maintenance");
      this.maintenanceList = response.data;

      this.filteredMaintenanceList = this.maintenanceList;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lịch sử bảo trì:", error);
    }
  },
  watch: {
    statusFilter(newStatus) {
      this.filterByStatus();
    },
  },
  methods: {
    getStatusText(status) {
      return status === 0 ? "Đang sửa chữa" : "Hoàn thành";
    },
    getStatusClass(status) {
      return status === 0 ? "badge bg-danger" : "badge bg-success";
    },
    filterByStatus() {
      if (this.statusFilter === "") {
        this.filteredMaintenanceList = this.maintenanceList;
      } else {
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
