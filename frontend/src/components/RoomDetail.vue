<template>
  <div v-if="room" class="container mt-4">
    <h2 class="mb-4">Chi tiết phòng trọ</h2>
    <div class="card">
      <div class="card-body">
        <!-- Thông tin phòng trọ -->
        <h5 class="card-title">Phòng số: {{ room.room_id }}</h5>
        <p class="card-text">
          Giá: {{ room.price }} VND <br />
          Sức chứa: {{ room.capacity }} người <br />
          Trạng thái: {{ room.status }}
        </p>
      </div>
    </div>

    <div v-if="room.rental_id" class="mt-4">
      <h3>Thông tin hợp đồng thuê</h3>
      <div class="card">
        <div class="card-body">
          <p>
            <strong>Ngày bắt đầu:</strong> {{ $formatDate(room.start_date) }}
          </p>
          <p>
            <strong>Ngày kết thúc:</strong> {{ $formatDate(room.end_date) }}
          </p>
          <p><strong>Giá thuê:</strong> {{ room.rental_price }} VND</p>
        </div>
      </div>

      <div v-if="room.tenant_id" class="mt-4">
        <h3>Thông tin người thuê</h3>
        <div class="card">
          <div class="card-body">
            <p><strong>Họ và tên:</strong> {{ room.full_name }}</p>
            <p><strong>Số điện thoại:</strong> {{ room.phone_number }}</p>
            <p>
              <strong>Ngày sinh:</strong> {{ $formatDate(room.date_of_birth) }}
            </p>
            <p><strong>Giới tính:</strong> {{ $formatGender(room.gender) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="container mt-4">
    <p>Đang tải...</p>
  </div>
</template>

<script>
export default {
  props: ["room_id"], // Nhận tham số ID từ URL
  data() {
    return {
      room: null,
    };
  },
  async created() {
    try {
      const response = await this.axios.get(`/rooms/${this.room_id}`);
      this.room = response.data;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết phòng trọ:", error);
    }
  },
};
</script>

<style scoped>
.card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
}

.card-body {
  padding: 15px;
}
</style>
