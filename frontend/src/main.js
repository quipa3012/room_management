import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
import VueAxios from "vue-axios";
import router from "./router/";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";

const app = createApp(App);
app.use(VueAxios, axios);
app.use(router);

// Định nghĩa phương thức dùng chung cho toàn ứng dụng
app.config.globalProperties.$formatDate = function (dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day} tháng ${month} năm ${year}`;
};

app.config.globalProperties.$formatGender = function (gender) {
  return gender === 1 ? "Nam" : "Nữ";
};

app.config.globalProperties.$formatCurrency = function (amount) {
  return parseFloat(amount).toLocaleString("vi-VN");
};

axios.defaults.baseURL = "http://localhost:3000/api";

app.mount("#app");
