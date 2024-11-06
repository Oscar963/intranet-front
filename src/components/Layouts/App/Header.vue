<template>
    <header class="navbar navbar-expand-md d-print-none sticky-top bg-primary shadow-sm" data-bs-theme="light">
        <div class="container-fluid">
            <button class="navbar-toggler text-white" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbar-menu" aria-controls="navbar-menu" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <h1 class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal">
                <router-link to="/admin/home">
                    <img src="/img/logos/logo.png" alt="logo-muniarica" class="navbar-brand-image" />
                </router-link>
            </h1>
            <div v-if="isAuthenticated" class="navbar-nav flex-row order-md-last">
                <div class="d-none d-md-flex">
                    <span class="nav-link text-white">
                        Hola, {{ nombre }} </span>
                    <div class="vr"></div>
                </div>
                <div class="d-none d-md-flex">
                    <a href="#" class="nav-link text-white">
                        <!-- Download SVG icon from http://tabler-icons.io/i/bell -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="me-2 icon icon-tabler icons-tabler-outline icon-tabler-user">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                        </svg>
                        Perfil:&ensp;
                        <span v-for="(item, index) in roles" :key="index">
                            {{ item }} &ensp;
                        </span>
                    </a>
                    <div class="vr"></div>
                    <div class="nav-item dropdown d-none d-md-flex">
                        <a href="#" class="nav-link btn btn-ghost-primary text-white dropdown-toggle"
                            data-bs-toggle="dropdown">
                            <!-- Download SVG icon from http://tabler-icons.io/i/bell -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="icon icon-tabler icons-tabler-outline icon-tabler-settings">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path
                                    d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
                                <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                            </svg>
                            Configuración
                        </a>
                        <div class="dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card">
                            <router-link class="dropdown-item py-3" :to="{ name: 'Perfil' }">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="icon icon-tabler icons-tabler-outline icon-tabler-user-scan  me-2">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M10 9a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                    <path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
                                    <path d="M4 16v2a2 2 0 0 0 2 2h2" />
                                    <path d="M16 4h2a2 2 0 0 1 2 2v2" />
                                    <path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
                                    <path d="M8 16a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2" />
                                </svg>
                                Mis Datos</router-link>
                            <router-link class="dropdown-item py-3" :to="{ name: 'Contrasena' }">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="icon icon-tabler icons-tabler-outline icon-tabler-lock me-2">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path
                                        d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
                                    <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                                    <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
                                </svg>
                                Cambiar Contraseña</router-link>
                        </div>
                    </div>
                    <div class="vr"></div>
                    <a @click="logout()" href="#" class="nav-link btn btn-ghost-primary text-white">
                        Cerrar sesión</a>
                </div>
            </div>
        </div>
    </header>
</template>
<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

const router = useRouter();
const authStore = useAuthStore();
const $toast = useToast();
const isAuthenticated = computed(() => authStore.isAuthenticated());
const roles = computed(() => authStore.roles);
const nombre = computed(() => authStore.user.nombre);


const logout = async () => {
    try {
        const { message } = await authStore.logout();
        $toast.info(message, {
            position: 'top-right'
        });
        router.push({ name: 'Login' });

    } finally { }
};

</script>
<style scoped>
.navbar-brand-image {
    width: 255px;
    height: auto;
}

.vr {
    display: inline-block;
    align-self: stretch;
    width: 1px;
    min-height: 1em;
    background-color: #ccc;
    opacity: .25;
    margin: 10px;
}

.dropdown-item:hover,
.dropdown-item:focus {
    color: inherit;
    text-decoration: none;
    background-color: rgba(97, 104, 118, 0.09);
}
</style>
