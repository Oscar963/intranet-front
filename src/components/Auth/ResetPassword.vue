<template>
    <div class="d-flex flex-column bg-white vh-100">
        <div class="page page-center">
            <div class="container py-4">
                <div class="text-center mb-4">
                    <a href="."
                        class="navbar-brand navbar-brand-autodark d-none d-md-block d-lg-block d-xl-block d-xxl-block"><img
                            src="/img/auth/reset-password.svg" style="width: 200px" alt="" /></a>
                </div>
                <div class="card-md">
                    <div class="card-body">
                        <form @submit.prevent="submit">
                            <h2 class="card-title text-center mb-4">Reestablece tu contraseña</h2>
                            <div class="mb-3">
                                <label for="label-password" class="form-label">Contraseña </label>
                                <div class="row g-2">
                                    <div class="col">
                                        <input :type="showPassword ? 'text' : 'password'" v-model="password"
                                            class="form-control" :class="{ 'is-invalid': validationErrors.password }"
                                            id="label-password">
                                        <div class="invalid-feedback" v-if="validationErrors.password">
                                            {{ validationErrors.password[0] }}
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <a @click.prevent="toggleShowPassword" title="Mostrar contraseña" href="#"
                                            class="btn btn-icon" aria-label="Button">
                                            <!-- Download SVG icon from http://tabler-icons.io/i/search -->
                                            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="24"
                                                height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-eye">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                                <path
                                                    d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                                            </svg>
                                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round"
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-eye-closed">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M21 9c-2.4 2.667 -5.4 4 -9 4c-3.6 0 -6.6 -1.333 -9 -4" />
                                                <path d="M3 15l2.5 -3.8" />
                                                <path d="M21 14.976l-2.492 -3.776" />
                                                <path d="M9 17l.5 -4" />
                                                <path d="M15 17l-.5 -4" />
                                            </svg>
                                        </a>
                                    </div>

                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="label-password-confirm" class="form-label">Confirmar Contraseña </label>
                                <div class="row g-2">
                                    <div class="col">
                                        <input :type="showPasswordConfirm ? 'text' : 'password'"
                                            v-model="password_confirmation" class="form-control"
                                            :class="{ 'is-invalid': validationErrors.password_confirmation }"
                                            id="label-password-confirm">
                                        <div class="invalid-feedback" v-if="validationErrors.password_confirmation">
                                            {{ validationErrors.password_confirmation[0] }}
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <a @click.prevent="toggleShowPasswordConfirm" title="Mostrar contraseña"
                                            href="#" class="btn btn-icon" aria-label="Button">
                                            <!-- Download SVG icon from http://tabler-icons.io/i/search -->
                                            <svg v-if="showPasswordConfirm" xmlns="http://www.w3.org/2000/svg"
                                                width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-eye">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                                <path
                                                    d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                                            </svg>
                                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round"
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-eye-closed">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M21 9c-2.4 2.667 -5.4 4 -9 4c-3.6 0 -6.6 -1.333 -9 -4" />
                                                <path d="M3 15l2.5 -3.8" />
                                                <path d="M21 14.976l-2.492 -3.776" />
                                                <path d="M9 17l.5 -4" />
                                                <path d="M15 17l-.5 -4" />
                                            </svg>
                                        </a>
                                    </div>

                                </div>
                            </div>
                            <div class="form-footer">
                                <button v-if="loading" type="submit" class="btn btn-primary w-100" disabled>
                                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Cargando...
                                </button>
                                <button v-else type="submit" class="btn btn-primary w-100">
                                    <!-- Download SVG icon from http://tabler-icons.io/i/mail -->
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="icon icon-tabler icons-tabler-outline icon-tabler-lock-open">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path
                                            d="M5 11m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                        <path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                        <path d="M8 11v-5a4 4 0 0 1 8 0" />
                                    </svg>
                                    Cambiar contraseña
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { axiosInstance } from '@/plugins/axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

// Instancias de router, route, auth store, and toast
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const $toast = useToast();

// Propiedades reactivas
const password = ref('');
const password_confirmation = ref('');
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const validationErrors = ref({});
const loading = ref(false);

// Alternar visibilidad de contraseña
const toggleShowPassword = () => {
    showPassword.value = !showPassword.value;
};

const toggleShowPasswordConfirm = () => {
    showPasswordConfirm.value = !showPasswordConfirm.value;
};

// Metodo Submit 
const submit = async () => {
    try {
        loading.value = true;
        validationErrors.value = {};
        const response = await axiosInstance.post('/api/auth/password/reset', {
            password: password.value,
            password_confirmation: password_confirmation.value,
            token: route.query.token,
            email: route.query.email,
        });

        $toast.info(response.data.message, {
            position: 'top-right',
            duration: 3000,
        });

        // Redirigiendo al login
        const { message } = await authStore.login(route.query.rut, password.value);
        $toast.success(message, {
            position: 'top-right',
            duration: 5000,
        });

        // Reestablecer campos
        password.value = '';
        password_confirmation.value = '';

        // Navegar a Home
        router.push({ name: 'Home' });
    } catch (error) {
        handleRequestError(error);
    } finally {
        loading.value = false;
    }
};

// Función para manejar errores de la API
const handleRequestError = (error) => {
    if (error.response) {
        const status = error.response.status;
        const message = error.response.data.message || 'Error del Sistema';

        switch (status) {
            case 401:
                // Error 401: No autorizado
                $toast.error('No autorizado. ' + message, { position: 'top-right' });
                break;
            case 403:
                // Error 403: Prohibido
                $toast.error('Prohibido. ' + message, { position: 'top-right' });
                break;
            case 404:
                // Error 404: No encontrado
                $toast.error( message, { position: 'top-right' });
                break;
            case 429:
                // Error 429: Demasiadas solicitudes
                $toast.error('Demasiadas solicitudes. ' + message, { position: 'top-right' });
                break;
            case 500:
                // Error 500: Error interno del servidor
                $toast.error('Error interno del servidor. ' + message, { position: 'top-right' });
                break;
            case 422:
                // Error 422: Error de validación
                validationErrors.value = error.response.data.errors;
                $toast.error('Error de validación. ', { position: 'top-right' });
                break;
            default:
                if (error.response.data && error.response.data.errors) {
                    $toast.error('Error del Sistema de Servidor. ' + error.response.data.errors, { position: 'top-right' });

                } else {
                    $toast.error(`Error del Sistema ${error}`, { position: 'top-right' });
                }
        }
    } else {
        $toast.error(`Error del Sistema ${error}`, { position: 'top-right' });
    }
};

</script>
