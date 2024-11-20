<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <h2 class="mb-4 col-lg-4">Lập Hợp Đồng Thuê Phòng</h2>
    </div>

    <div class="row justify-content-center">
      <form @submit.prevent="createRental" class="col-lg-4">
        <div class="form-group">
          <label for="room_id">Chọn phòng:</label>
          <select
            id="room_id"
            class="form-control"
            v-model="newRental.room_id"
            required
          >
            <option
              v-for="room in availableRooms"
              :key="room.room_id"
              :value="room.room_id"
            >
              Phòng {{ room.room_id }} ({{ room.price }} VND)
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="tenant_id">Chọn thành viên:</label>
          <select
            id="tenant_id"
            class="form-control"
            v-model="newRental.tenant_id"
            required
          >
            <option
              v-for="tenant in tenants"
              :key="tenant.tenant_id"
              :value="tenant.tenant_id"
            >
              {{ tenant.full_name }} ({{ tenant.phone_number }})
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="start_date">Ngày bắt đầu:</label>
          <input
            type="date"
            id="start_date"
            v-model="newRental.start_date"
            class="form-control"
            required
          />
        </div>

        <div class="form-group">
          <label for="end_date">Ngày kết thúc:</label>
          <input
            type="date"
            id="end_date"
            v-model="newRental.end_date"
            class="form-control"
            required
          />
        </div>

        <div class="form-group">
          <label for="deposit">Số tiền cọc:</label>
          <input
            type="number"
            step="500000"
            id="deposit"
            v-model="newRental.deposit"
            class="form-control"
            required
          />
        </div>

        <button type="submit" class="btn btn-outline-dark mt-3">
          Lập hợp đồng
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      newRental: {
        room_id: null,
        tenant_id: null, // Chỉ lưu 1 tenant
        start_date: "",
        end_date: "",
        deposit: 0,
        status: "đang hiệu lực", // Mặc định là "đang hiệu lực"
      },
      availableRooms: [], // Chỉ lưu phòng có trạng thái "đang trống"
      tenants: [],
    };
  },
  async created() {
    try {
      // Lấy danh sách phòng "đang trống" và thành viên từ API
      const roomsResponse = await axios.get("/rooms/hollow");
      const tenantsResponse = await axios.get("/tenants");
      this.availableRooms = roomsResponse.data; // Chỉ chứa phòng "đang trống"
      this.tenants = tenantsResponse.data;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu phòng và thành viên:", error);
    }
  },
  methods: {
    // Phương thức gửi yêu cầu tạo hợp đồng
    async createRental() {
      try {
        const response = await axios.post("/rentals", this.newRental);
        alert("Hợp đồng đã được lập thành công!");
        this.$router.push("/rentals");
      } catch (error) {
        console.error("Lỗi khi lập hợp đồng:", error);
        alert("Không thể lập hợp đồng.");
      }
    },
  },
};
</script>

<style scoped>
form {
  max-width: 600px;
  margin: 0 auto;
}

button {
  width: 30%;
  margin-left: 35%;
}

.d-flex {
  display: flex;
  align-items: center;
}

.mr-2 {
  margin-right: 0.5rem;
}
</style>
