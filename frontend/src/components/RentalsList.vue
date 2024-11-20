<template>
  <div class="container mt-4">
    <h2 class="mb-4">Danh Sách Hợp Đồng Thuê Phòng</h2>

    <div class="row mb-5">
      <div class="col-lg-10 mt-4">
        <router-link to="/rentals/create-rental" class="btn btn-outline-dark">
          Lập hợp đồng
        </router-link>
      </div>
      <div class="col-lg-2 mb-5">
        <label for="filterStatus" class="form-label"
          >Lọc theo trạng thái:</label
        >
        <select
          class="form-select"
          v-model="selectedStatus"
          @change="filterRentals"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="đang hiệu lực">Đang hiệu lực</option>
          <option value="không hiệu lực">Hết hạn/ Đã hủy</option>
        </select>
      </div>
    </div>

    <!-- Hiển thị danh sách hợp đồng -->
    <div v-if="filteredRentals.length" class="row">
      <div
        class="col-md-4 mb-3"
        v-for="rental in filteredRentals"
        :key="rental.rental_id"
      >
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Hợp đồng #{{ rental.rental_id }}</h5>
            <p class="card-text">
              Người thuê: {{ rental.tenant_name }} <br />
              Phòng số: {{ rental.room_id }} <br />
              Giá phòng: {{ rental.room_price | currency }} VND <br />
              Thời gian thuê: {{ $formatDate(rental.start_date) }} đến
              {{ $formatDate(rental.end_date) }}
              <br />
              Giá thuê: {{ $formatCurrency(rental.rental_price) }} VND
              <br />
              Đặt cọc: {{ $formatCurrency(rental.deposit) }} VND
              <br />
              Trạng thái:
              <span :class="getStatusClass(rental.status)">
                {{ rental.status }}
              </span>
            </p>

            <!-- Liên kết tới chi tiết hợp đồng -->
            <router-link
              :to="`/rentals/${rental.rental_id}`"
              class="btn btn-outline-dark"
            >
              Xem chi tiết
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Nếu không có dữ liệu hợp đồng -->
    <div v-else>
      <p>Chưa có hợp đồng nào.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      rentals: [], // Danh sách tất cả các hợp đồng
      selectedStatus: "", // Trạng thái được chọn để lọc
      filteredRentals: [], // Danh sách hợp đồng sau khi lọc
    };
  },
  async created() {
    try {
      // Gọi API để lấy danh sách hợp đồng
      const response = await axios.get("/rentals");
      this.rentals = response.data;
      this.filteredRentals = this.rentals; // Gán danh sách hợp đồng ban đầu cho filteredRentals
    } catch (error) {
      console.error("Lỗi khi lấy danh sách hợp đồng:", error);
    }
  },
  methods: {
    // Phương thức trả về class tương ứng với trạng thái hợp đồng
    getStatusClass(status) {
      return status === "đang hiệu lực"
        ? "badge bg-success"
        : "badge bg-danger";
    },
    // Phương thức lọc hợp đồng theo trạng thái
    filterRentals() {
      if (this.selectedStatus === "") {
        this.filteredRentals = this.rentals; // Nếu không có trạng thái lọc, hiển thị tất cả
      } else {
        this.filteredRentals = this.rentals.filter(
          (rental) => rental.status === this.selectedStatus
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

.card {
  border: 1px solid #ddd;
}

.card-title {
  font-size: 1.25rem;
}

.card-text {
  font-size: 1rem;
}
</style>
