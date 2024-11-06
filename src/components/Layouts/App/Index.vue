<template>
    <div>
        <Header v-if="isAuthenticated" />
        <Navbar v-if="isAuthenticated" />
        <Sidebar v-if="isAuthenticated" />
        <div class="page-wrapper">
            <router-view v-slot="{ Component, route }">
                <transition name="slide" mode="out-in">
                    <component :is="Component" :key="route.path"></component>
                </transition>
            </router-view>
            <footer class="footer footer-transparent d-print-none">
                <div class="container-fluid">
                    <div class="row text-center align-items-center flex-row-reverse">
                        <div class="col-lg-auto ms-lg-auto">
                            <ul class="list-inline list-inline-dots mb-0">
                                <li class="list-inline-item">
                                    <router-link to="/login" class="link-secondary"></router-link>
                                </li>
                            </ul>
                        </div>
                        <div class="col-12 col-lg-auto mt-3 mt-lg-0">
                            <ul class="list-inline list-inline-dots mb-0">
                                <li class="list-inline-item">
                                    Copyright &copy; {{ new Date().getFullYear() }}
                                    <a href="." class="link-secondary">Unidad de Desarrollo Web</a>. Todos los derechos
                                    reservados
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    </div>
</template>
<script setup>
import Header from "@/components/Layouts/App/Header.vue";
import Navbar from "@/components/Layouts/App/Navbar.vue";
import Sidebar from "@/components/Layouts/App/Sidebar.vue";

import { useAuthStore } from '@/stores/auth';
import { onMounted, computed } from "vue";

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated());

onMounted(async () => {
    if (isAuthenticated.value) {
        await authStore.fetchPermissions();
    }
});


</script>
<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: opacity 0.6s, transform 0.6s;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    transform: translateX(-10%);
}
</style>