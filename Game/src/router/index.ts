import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import DND from "../views/Dnd.vue";

const routes: Array<RouteRecordRaw> = [{
    path: "/", name: "Home",
    component: Home},
    {path: "/login", name: "Login",
    component: Login},
    {path: "/register", name: "Register",
    component: Register},
    {path: "/dnd", name: "Dnd",
    component: DND}
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
