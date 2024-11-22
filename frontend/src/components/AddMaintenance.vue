<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <h2 class="mb-4 col-lg-5 text-center">Thêm lịch sử sửa chữa</h2>
    </div>

    <div class="row justify-content-center">
      <form @submit.prevent="submitForm" class="col-lg-5">
        <div class="mb-3">
          <label for="description" class="form-label">Nội dung sửa chữa</label>
          <textarea
            id="description"
            v-model="description"
            class="form-control"
            rows="4"
            required
          ></textarea>
        </div>

        <div class="mb-3">
          <label for="expense" class="form-label">Giá tiền (VND)</label>
          <input
            type="number"
            step="10000"
            id="expense"
            min="0"
            v-model="expense"
            class="form-control"
            required
          />
        </div>

        <div class="row justify-content-center">
          <button type="submit" class="btn btn-outline-dark col-lg-3">
            Lưu sửa chữa
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
      room_id: this.$route.params.room_id,
      description: "",
      expense: "",
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await axios.post("/maintenance", {
          room_id: this.room_id,
          description: this.description,
          expense: this.expense,
        });

        if (response.status === 201) {
          alert("Thêm lịch sử sửa chữa thành công!");
          this.$router.push("/");
        } else {
          alert("Đã xảy ra lỗi khi thêm sửa chữa.");
        }
      } catch (error) {
        console.error(
          "Lỗi khi thêm lịch sử sửa chữa:",
          error.response ? error.response.data : error.message
        );
        alert("Đã xảy ra lỗi khi thêm sửa chữa. Vui lòng thử lại.");
      }
    },
  },
};
</script>
