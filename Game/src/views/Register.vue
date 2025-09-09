<template>
    <div class="login-container">
        <div class="card p-4">
            <form @submit.prevent="register">
                <div class="header">Register</div>
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
                    <button type="submit" class="btn btn-blue btn-primary w-100">Register</button>
                    <button @click="login" class="btn btn-blue btn-primary w-100">Login</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { addUser, userData } from '../composables/database';

export default {
    setup() {
        const { users } = userData();
        const inp_name = ref("");
        const inp_password = ref("");
        const router = useRouter();

        const register = async () => {
            const user = users.value.find((u) => u.name === inp_name.value && u.password === inp_password.value);
            if (user || register) {
                alert(`Kullanıcı mevcut! giriş yapmayı deneyin`)
            }
            else{
                try {
                    addUser(inp_name.value, inp_password.value);
                    router.push('/login');
                } catch(error){
                    throw error;
                }
            }
        };

        const login = () => {
            router.push('/login');
        }

        return {inp_name, inp_password, register, login};
    }
}
</script>