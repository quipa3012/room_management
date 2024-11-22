<template>
  <div class="container mt-4">
    <h2 class="mb-4">Chi Tiết Hợp Đồng Thuê Phòng #{{ rental?.rental_id }}</h2>

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
      rental: null,
      paymentAmount: 0,
    };
  },
  async created() {
    const rentalId = this.$route.params.rental_id;
    try {
      const response = await axios.get(`/rentals/${rentalId}`);
      this.rental = response.data;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết hợp đồng:", error);
    }
  },
  methods: {
    confirmTerminateRental() {
      const isConfirmed = window.confirm(
        "Bạn có chắc chắn muốn chấm dứt hợp đồng này không?"
      );
      if (isConfirmed) {
        this.terminateRental();
      }
    },

    async terminateRental() {
      const rental_id = this.rental.rental_id;
      try {
        const response = await axios.put(`/rentals/terminate/${rental_id}`);
        this.rental.status = "không hiệu lực";
        alert("Hợp đồng đã được chấm dứt.");
      } catch (error) {
        console.error("Lỗi khi chấm dứt hợp đồng:", error);
        alert("Không thể chấm dứt hợp đồng.");
      }
    },

    async addPayment() {
      const isConfirmed = window.confirm(
        "Bạn có chắc chắn muốn thêm lần thanh toán này không?"
      );

      if (isConfirmed) {
        const rental_id = this.rental.rental_id;
        const amount = this.paymentAmount;
        try {
          const response = await axios.post("/rentals/payments", {
            rental_id,
            amount,
          });
          this.rental.payments.push(response.data);
          this.paymentAmount = 0;
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
