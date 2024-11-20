import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import RoomDetail from "../components/RoomDetail.vue";
import TenantsList from "../components/TenantsList.vue";
import RoomAdd from "../components/RoomAdd.vue";
import TenantDetail from "../components/TenantDetail.vue";
import AddTenant from "../components/AddTenant.vue";
import MaintenanceList from "../components/MaintenanceList.vue";
import AddMaintenance from "../components/AddMaintenance.vue";
import CompleteMaintenance from "../components/CompleteMaintenance.vue";
import EditMaintenance from "../components/EditMaintenance.vue";
import RentalsList from "../components/RentalsList.vue";
import RentalDetails from "../components/RentalDetails.vue";
import CreateRental from "../components/CreateRental.vue";
import EditTenant from "../components/EditTenant.vue";
import TenantListDeleted from "../components/TenantListDeleted.vue";
import EditRoom from "../components/EditRoom.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/add-room",
    name: "RoomAdd",
    component: RoomAdd,
  },
  {
    path: "/edit/:room_id",
    name: "EditRoom",
    component: EditRoom,
  },
  {
    path: "/:room_id", // ID của phòng sẽ được truyền vào URL
    name: "RoomDetail",
    component: RoomDetail,
    props: true, // Truyền tham số ID vào component
  },
  {
    path: "/tenants",
    name: "Tenant",
    component: TenantsList,
  },
  {
    path: "/tenants/deleted",
    name: "TenantListDeleted",
    component: TenantListDeleted,
  },
  {
    path: "/tenants/edit/:tenant_id",
    name: "EditTenant",
    component: EditTenant,
  },
  {
    path: "/tenants/:tenant_id",
    name: "TenantDetail",
    component: TenantDetail,
    props: true,
  },
  {
    path: "/tenants/add-tenant",
    name: "addTenant",
    component: AddTenant,
  },
  {
    path: "/maintenance",
    name: "MaintenanceList",
    component: MaintenanceList,
  },
  {
    path: "/maintenance/add-maintenance/:room_id",
    name: "AddMaintenance",
    component: AddMaintenance,
  },
  {
    path: "/maintenance/complete/:maintenance_id",
    name: "CompleteMaintenance",
    component: CompleteMaintenance,
  },
  {
    path: "/maintenance/edit/:maintenance_id",
    name: "editMaintenance",
    component: EditMaintenance,
  },
  {
    path: "/rentals",
    name: "RentalsList",
    component: RentalsList,
  },
  {
    path: "/rentals/:rental_id",
    name: "RentalDetails",
    component: RentalDetails,
    props: true,
  },
  {
    path: "/rentals/create-rental",
    name: "CreateRental",
    component: CreateRental,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
