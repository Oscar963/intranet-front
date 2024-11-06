<template>
    <div class="d-flex flex-column bg-white">
        <div class="row g-0 flex-fill">
            <div class="col-12 col-lg-6 col-xl-8 d-none d-lg-block">
                <img src="https://preview.tabler.io/static/photos/finances-us-dollars-and-bitcoins-currency-money-2.jpg"
                    height="300" class="bg-cover h-100 min-vh-100" alt="">
            </div>
            <div
                class="col-12 col-lg-6 col-xl-4 border-top-wide border-primary d-flex flex-column justify-content-center">
                <div class="container container-tight my-5 px-lg-5">
                    <h2 class="h2 text-center">
                        Iniciar Sesión
                    </h2>
                    <form @submit.prevent="login">
                        <div class="mb-3">
                            <label for="label-rut" class="form-label">Rut (12345678-K)</label>
                            <input v-model="rut" type="text" class="form-control"
                                :class="{ 'is-invalid': validationErrors.rut }" placeholder="12345678-K" id="label-rut">
                            <div class="invalid-feedback" v-if="validationErrors.rut">
                                {{ validationErrors.rut[0] }}
                            </div>
                        </div>
                        <div class="mb-2">
                            <label for="label-password" class="form-label">Contraseña
                                <span class="form-label-description">
                                    <router-link to="/forgot-password">Olvidé mi
                                        contraseña</router-link>
                                </span>
                            </label>
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

                        <div class="mb-2">
                            <label class="form-check">
                                <input v-model="remember" type="checkbox" class="form-check-input" />
                                <span class="form-check-label">Recordarme en este dispositivo</span>
                            </label>
                        </div>
                        <div class="form-footer">
                            <button v-if="loading" type="button" class="btn btn-primary w-100" disabled>
                                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                Cargando...
                            </button>
                            <button v-else type="submit" class="btn btn-primary w-100">
                                Iniciar Sesión
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Instancias de enrutador y almacén de autenticación.
const router = useRouter();
const authStore = useAuthStore();
const $toast = useToast();

// Propiedades reactivas
const rut = ref('13689472-2'); //13689472-2
const password = ref('password');
const remember = ref(false);
const validationErrors = ref({});
const loading = ref(false);
const showPassword = ref(false);

// Alternar visibilidad de contraseña
const toggleShowPassword = () => {
    showPassword.value = !showPassword.value;
};

// Método Login 
const login = async () => {
    try {
        loading.value = true;
        clearErrors();

        const { message } = await authStore.login(rut.value, password.value, remember.value);
        $toast.success(message, { position: 'top-right' });
        router.push({ name: 'Home' });
    } catch (err) {
        handleRequestError(err);
    } finally {
        loading.value = false;
    }
};

// Función para limpiar errores
const clearErrors = () => {
    validationErrors.value = {};
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
                $toast.error(message, { position: 'top-right' });
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
