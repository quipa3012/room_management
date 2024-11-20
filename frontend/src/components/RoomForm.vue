<template>
  <div>
    <h2>Thêm phòng trọ mới</h2>
    <form @submit.prevent="addRoom">
      <div>
        <label for="room_id">Mã phòng:</label>
        <input type="number" id="room_id" v-model="room.room_id" required />
      </div>
      <div>
        <label for="capacity">Sức chứa:</label>
        <input type="number" id="capacity" v-model="room.capacity" required />
      </div>
      <div>
        <label for="price">Giá phòng:</label>
        <input type="number" id="price" v-model="room.price" required />
      </div>
      <button type="submit">Thêm phòng</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      room: {
        room_id: "",
        capacity: "",
        price: "",
        status: "đang trống",
      },
    };
  },
  methods: {
    async addRoom() {
      try {
        await this.axios.post("/rooms", this.room);
        this.$emit("room-added");
        this.room = {
          room_id: "",
          capacity: "",
          price: "",
          status: "đang trống",
        };
        alert("Thêm phòng thành công!");
      } catch (error) {
        console.error("Lỗi khi thêm phòng:", error);
      }
    },
  },
};
</script>
