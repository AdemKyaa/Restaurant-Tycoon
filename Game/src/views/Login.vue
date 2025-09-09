<template>
    <div class="login-container">
        <form action="">
            <div class="card p-4">
                <div class="header">Login</div>
                <div class="mb-3">
                    <input 
                    id="username"
                    type="text"
                    placeholder="Username"
                    v-model="inp_name"
                    class="form-control"
                    required
                    autocomplete="off">
                </div>
                <div class="mb-3">
                    <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    v-model="inp_password"
                    class="form-control"
                    required>
                </div>
                <div class="login-btn">
                    <button @click="login" class="btn btn-blue btn-primary w-100">Login</button>
                    <button @click="register" class="btn btn-blue btn-primary w-100">Register</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { loggedIn, userData } from '../composables/database';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const { users } = userData();
        const inp_name = ref("");
        const inp_password = ref("");

        const router = useRouter();
        const login = () => {
            const user = users.value.find((u) => u.name === inp_name.value && u.password === inp_password.value);
                if (user) {
                    loggedIn(inp_name.value);
                    router.push('/');
                }
                else{
                    alert(`Hatalı ya da eksik giriş`)
                }
            }
            const register = () => {
                router.push('/register');
        }

        return {inp_name, inp_password, login, register};
    }
}
</script>