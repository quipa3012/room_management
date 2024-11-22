<template>
  <div class="container mt-5">
    <h2 class="mb-4">Hoàn tất sửa chữa</h2>
    <p class="lead">
      Đang hoàn tất sửa chữa cho lịch sử sửa chữa #{{ maintenance_id }}
    </p>

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
      maintenance_id: this.$route.params.maintenance_id,
      maintenance: null,
    };
  },
  async created() {
    try {
      const response = await axios.get(`/maintenance/${this.maintenance_id}`);
      this.maintenance = response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sửa chữa:", error);
    }
  },
  methods: {
    async completeMaintenance() {
      try {
        await axios.put(`/maintenance/complete/${this.maintenance_id}`);

        alert("Lịch sử sửa chữa đã được hoàn thành!");

        this.$router.push("/maintenance");
      } catch (error) {
        console.error("Lỗi khi hoàn tất sửa chữa:", error);
      }
    },
  },
  computed: {
    statusText() {
      if (this.maintenance) {
        return this.maintenance.status === 0 ? "Chưa hoàn tất" : "Đã hoàn tất";
      }
      return "";
    },
    statusClass() {
      if (this.maintenance) {
        return this.maintenance.status === 0 ? "text-danger" : "text-success";
      }
      return "";
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
