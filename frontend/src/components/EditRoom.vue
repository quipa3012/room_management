<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <h2 class="mb-4 col-lg-4 text-center">Chỉnh sửa phòng</h2>
    </div>

    <div class="row justify-content-center">
      <div v-if="room" class="col-lg-4">
        <form @submit.prevent="updateRoom">
          <div class="mb-3">
            <label for="capacity" class="form-label">Sức chứa:</label>
            <input
              v-model="room.capacity"
              type="number"
              id="capacity"
              class="form-control"
              min="1"
              required
            />
          </div>

          <div class="mb-3">
            <label for="price" class="form-label">Giá:</label>
            <input
              v-model="room.price"
              type="number"
              id="price"
              class="form-control"
              min="0"
              step="100000"
              required
            />
          </div>
          <div class="row justify-content-center">
            <button type="submit" class="btn btn-outline-dark col-lg-3">
              Cập nhật
            </button>
          </div>
        </form>
      </div>
      <div v-else>
        <p>Phòng không tồn tại!</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      room: null,
    };
  },
  async created() {
    const roomId = this.$route.params.room_id;
    try {
      const response = await axios.get(`/rooms/${roomId}`);
      this.room = response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin phòng:", error);
    }
  },
  methods: {
    async updateRoom() {
      const roomId = this.$route.params.room_id;
      try {
        const response = await axios.put(`/rooms/${roomId}`, {
          capacity: this.room.capacity,
          price: this.room.price,
        });

        if (response.status === 200) {
          alert("Cập nhật phòng thành công!");

          this.$router.push("/");
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật phòng:", error);
        alert("Có lỗi xảy ra khi cập nhật phòng!");
      }
    },
  },
};
</script>

<style scoped></style>
