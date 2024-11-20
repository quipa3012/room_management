<template>
  <div class="container mt-4" v-if="tenant">
    <h2 class="mb-4">Chi tiết thành viên</h2>

    <!-- Thông tin cá nhân -->
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">Thông tin cá nhân</h5>
        <p class="card-text">
          Họ và tên: {{ tenant.full_name }} <br />
          CCCD: {{ tenant.tenant_id }} <br />
          Điện thoại: {{ tenant.phone_number }} <br />
          Ngày sinh: {{ $formatDate(tenant.date_of_birth) }} <br />
          Giới tính: {{ $formatGender(tenant.gender) }}
        </p>
      </div>
    </div>

    <!-- Thông tin hợp đồng và phòng -->
    <div v-if="tenant.rental_id" class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">Thông tin hợp đồng</h5>
        <p class="card-text">
          Mã hợp đồng: {{ tenant.rental_id }} <br />
          Ngày bắt đầu: {{ $formatDate(tenant.start_date) }} <br />
          Ngày kết thúc: {{ $formatDate(tenant.end_date) }} <br />
          Giá thuê: {{ tenant.rental_price }} VND <br />
          Đặt cọc: {{ tenant.deposit }} VND
        </p>
      </div>
    </div>

    <!-- Thông tin phòng -->
    <div v-if="tenant.room_id" class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">Thông tin phòng</h5>
        <p class="card-text">
          Mã phòng: {{ tenant.room_id }} <br />
          Giá phòng: {{ tenant.room_price }} VND <br />
          Sức chứa: {{ tenant.capacity }} người <br />
          Trạng thái phòng: {{ tenant.room_status }}
        </p>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Đang tải...</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["tenant_id"], // Nhận tham số ID từ URL
  data() {
    return {
      tenant: null,
    };
  },
  async created() {
    try {
      // Gọi API để lấy chi tiết thành viên
      const response = await axios.get(`/tenants/${this.tenant_id}`);
      this.tenant = response.data;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết thành viên:", error);
    }
  },
};
</script>

<style scoped>
.card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
