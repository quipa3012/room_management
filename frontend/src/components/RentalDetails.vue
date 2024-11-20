<template>
  <div class="container mt-4">
    <h2 class="mb-4">Chi Tiết Hợp Đồng Thuê Phòng #{{ rental?.rental_id }}</h2>

    <!-- Hiển thị thông tin chi tiết hợp đồng -->
    <div v-if="rental">
      <div class="row justify-content-between">
        <div class="col-md-5 card">
          <p><strong>Người thuê:</strong> {{ rental.tenant_name }}</p>
          <p><strong>Số điện thoại:</strong> {{ rental.phone_number }}</p>
          <p>
            <strong>Ngày sinh:</strong> {{ $formatDate(rental.date_of_birth) }}
          </p>
          <p><strong>Giới tính:</strong> {{ $formatGender(rental.gender) }}</p>
        </div>
        <div class="col-md-5 card">
          <p><strong>Phòng số:</strong> {{ rental.room_id }}</p>
          <p>
            <strong>Giá phòng:</strong>
            {{ $formatCurrency(rental.room_price) }} VND
          </p>
          <p>
            <strong>Thời gian thuê:</strong>
            {{ $formatDate(rental.start_date) }} đến
            {{ $formatDate(rental.end_date) }}
          </p>
          <p>
            <strong>Giá thuê:</strong>
            {{ $formatCurrency(rental.rental_price) }} VND
          </p>
          <p>
            <strong>Đặt cọc:</strong> {{ $formatCurrency(rental.deposit) }} VND
          </p>
          <p><strong>Trạng thái:</strong> {{ rental.status }}</p>
        </div>
      </div>

      <!-- Hiển thị các lần thanh toán -->
      <div class="mt-4">
        <h4>Lịch sử thanh toán</h4>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Ngày thanh toán</th>
              <th>Số tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in rental.payments" :key="payment.payment_id">
              <td>{{ $formatDate(payment.payment_date) }}</td>
              <td>{{ $formatCurrency(payment.amount) }} VND</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Phần thanh toán -->
      <div class="row justify-content-center">
        <div class="mt-4 col-lg-2" v-if="rental.status === 'đang hiệu lực'">
          <h4>Thêm thanh toán</h4>
          <form @submit.prevent="addPayment">
            <div class="form-group">
              <label for="amount">Số tiền thanh toán:</label>
              <input
                type="number"
                step="100000"
                v-model="paymentAmount"
                class="form-control"
                id="amount"
                required
                min="0"
              />
            </div>
            <button type="submit" class="btn btn-outline-dark mt-2">
              Thanh toán
            </button>
          </form>
        </div>
      </div>

      <!-- Nút "Chấm dứt hợp đồng" chỉ hiển thị khi trạng thái hợp đồng là "đang hiệu lực" -->
      <div
        v-if="rental.status === 'đang hiệu lực'"
        class="row justify-content-center mb-5"
      >
        <button
          class="btn btn-outline-danger col-lg-2"
          @click="confirmTerminateRental"
        >
          Chấm dứt hợp đồng
        </button>
      </div>
    </div>

    <!-- Nếu không tìm thấy hợp đồng -->
    <div v-else>
      <p>Không tìm thấy hợp đồng.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      rental: null, // Chi tiết hợp đồng
      paymentAmount: 0, // Số tiền thanh toán nhập vào
    };
  },
  async created() {
    const rentalId = this.$route.params.rental_id;
    try {
      // Gọi API để lấy chi tiết hợp đồng
      const response = await axios.get(`/rentals/${rentalId}`);
      this.rental = response.data;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết hợp đồng:", error);
    }
  },
  methods: {
    // Phương thức hiển thị hộp thoại xác nhận trước khi chấm dứt hợp đồng
    confirmTerminateRental() {
      const isConfirmed = window.confirm(
        "Bạn có chắc chắn muốn chấm dứt hợp đồng này không?"
      );
      if (isConfirmed) {
        this.terminateRental(); // Nếu người dùng xác nhận, gọi phương thức chấm dứt hợp đồng
      }
    },

    // Phương thức chấm dứt hợp đồng
    async terminateRental() {
      const rental_id = this.rental.rental_id;
      try {
        // Gửi yêu cầu PUT để cập nhật trạng thái hợp đồng thành "không hiệu lực"
        const response = await axios.put(`/rentals/terminate/${rental_id}`);
        this.rental.status = "không hiệu lực"; // Cập nhật trạng thái ngay lập tức trên UI
        alert("Hợp đồng đã được chấm dứt.");
      } catch (error) {
        console.error("Lỗi khi chấm dứt hợp đồng:", error);
        alert("Không thể chấm dứt hợp đồng.");
      }
    },

    // Phương thức thêm thanh toán mới
    async addPayment() {
      // Hiển thị hộp thoại xác nhận trước khi thực hiện thanh toán
      const isConfirmed = window.confirm(
        "Bạn có chắc chắn muốn thêm lần thanh toán này không?"
      );

      if (isConfirmed) {
        const rental_id = this.rental.rental_id;
        const amount = this.paymentAmount;
        try {
          // Gửi yêu cầu POST để thêm thanh toán mới
          const response = await axios.post("/rentals/payments", {
            rental_id,
            amount,
          });
          this.rental.payments.push(response.data); // Thêm thanh toán mới vào danh sách thanh toán
          this.paymentAmount = 0; // Reset lại số tiền sau khi thanh toán
          alert("Thanh toán thành công!");
        } catch (error) {
          console.error("Lỗi khi thêm thanh toán:", error);
          alert("Không thể thêm thanh toán.");
        }
      } else {
        alert("Thanh toán bị hủy.");
      }
    },
  },
};
</script>

<style scoped>
h2 {
  font-size: 1.5rem;
}

.row {
  margin-top: 20px;
}

p {
  font-size: 1rem;
}

button {
  margin-top: 20px;
}
</style>
