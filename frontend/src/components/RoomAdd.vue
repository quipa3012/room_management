<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <h2 class="col-lg-4 text-center">Thêm phòng trọ mới</h2>
    </div>

    <div class="row justify-content-center">
      <form @submit.prevent="addRoom" class="col-lg-4">
        <!-- Các trường nhập liệu cho thông tin phòng -->
        <div class="mb-3">
          <label for="roomId" class="form-label">Số phòng</label>
          <input
            type="text"
            id="roomId"
            v-model="newRoom.room_id"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
          <label for="price" class="form-label">Giá phòng</label>
          <input
            type="number"
            step="100000"
            id="price"
            v-model="newRoom.price"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
          <label for="capacity" class="form-label">Sức chứa</label>
          <input
            type="number"
            step="1"
            id="capacity"
            v-model="newRoom.capacity"
            class="form-control"
            required
          />
        </div>
        <div class="row justify-content-center">
          <button type="submit" class="btn btn-outline-dark col-lg-4">
            Thêm phòng
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
      newRoom: {
        room_id: "",
        price: 0,
        status: "đang trống",
      },
    };
  },
  methods: {
    async addRoom() {
      try {
        await axios.post("/rooms", this.newRoom);
        alert("Phòng trọ đã được thêm thành công!");
        this.$router.push("/");
      } catch (error) {
        console.error("Lỗi khi thêm phòng trọ:", error);
      }
    },
  },
};
</script>
