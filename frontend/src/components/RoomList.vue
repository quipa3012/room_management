<template>
  <div class="container mt-4">
    <h2 class="mb-4">Danh sách phòng trọ</h2>

    <div class="row">
      <div class="col-lg-10 mt-4">
        <router-link to="/add-room" class="btn btn-outline-dark">
          Thêm phòng trọ
        </router-link>
      </div>

      <div class="mb-5 col-lg-2">
        <label for="filterStatus" class="form-label"
          >Lọc theo trạng thái:</label
        >
        <select
          id="filterStatus"
          v-model="filterStatus"
          class="form-select"
          @change="filterRooms"
        >
          <option value="">Tất cả</option>
          <option value="đang trống">Trống</option>
          <option value="đang thuê">Đang cho thuê</option>
          <option value="đang sửa chữa">Đang sửa chữa</option>
        </select>
      </div>
    </div>

    <div class="row">
      <div
        class="col-md-4 mb-3"
        v-for="room in filteredRooms"
        :key="room.room_id"
      >
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Phòng số: {{ room.room_id }}</h5>
            <p class="card-text">
              Giá: {{ $formatCurrency(room.price) }} VND <br />
              <span :class="getStatusClass(room.status)">
                Trạng thái phòng: {{ room.status }}
              </span>
              <br />
              <span :class="getMaintenanceStatusClass(room.maintenance_status)">
                Trạng thái sửa chữa: {{ room.maintenance_status_text }}
              </span>
            </p>
            <router-link :to="`/${room.room_id}`" class="btn btn-outline-dark">
              Xem chi tiết
            </router-link>
            <router-link
              :to="`/edit/${room.room_id}`"
              class="btn btn-outline-dark mx-1"
            >
              Chỉnh sửa
            </router-link>
            <router-link
              v-if="room.maintenance_status !== 0"
              :to="`/maintenance/add-maintenance/${room.room_id}`"
              class="btn btn-outline-dark"
              >Bảo trì</router-link
            >
            <!-- Nút Xóa -->
            <button
              @click="deleteRoom(room.room_id)"
              class="btn btn-outline-dark mx-1"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      rooms: [],
      filterStatus: "",
      filteredRooms: [],
    };
  },
  async created() {
    try {
      const response = await axios.get("/rooms");
      this.rooms = response.data;

      this.rooms = this.rooms.map((room) => {
        room.maintenance_status_text =
          room.maintenance_status === 0 ? "Đang sửa chữa" : "Không có sửa chữa";

        return room;
      });

      this.filteredRooms = [...this.rooms];
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phòng trọ:", error);
    }
  },
  methods: {
    getStatusClass(status) {
      if (status === "đang trống") {
        return "badge bg-success";
      } else if (status === "đang thuê") {
        return "badge bg-primary";
      }
      return "";
    },

    getMaintenanceStatusClass(status) {
      if (status === 0) {
        return "badge bg-danger";
      }
      return "badge bg-secondary";
    },

    filterRooms() {
      if (this.filterStatus === "") {
        this.filteredRooms = [...this.rooms];
      } else if (this.filterStatus === "đang sửa chữa") {
        this.filteredRooms = this.rooms.filter(
          (room) => room.maintenance_status === 0
        );
      } else {
        this.filteredRooms = this.rooms.filter(
          (room) => room.status === this.filterStatus
        );
      }
    },

    async deleteRoom(roomId) {
      if (confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
        try {
          await axios.delete(`/rooms/${roomId}`);
          this.rooms = this.rooms.filter((room) => room.room_id !== roomId);
          this.filteredRooms = [...this.rooms];
          alert("Phòng đã được xóa.");
        } catch (error) {
          console.error("Lỗi khi xóa phòng:", error);
          alert("Không thể xóa phòng. Vui lòng thử lại sau.");
        }
      }
    },
  },
};
</script>

<style scoped>
h2 {
  font-size: 1.5rem;
}
</style>
