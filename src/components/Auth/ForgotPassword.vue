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
                    <h2 class="h2 text-center mb-3">
                        ¿Te olvidaste la contraseña?
                    </h2>
                    <form @submit.prevent="submit">
                        <p class="text-muted">Ingresa la dirección de correo electrónico asociada a tu cuenta y te
                            enviaremos un enlace para restablecer tu contraseña.</p>
                        <div class="mb-3">
                            <label class="form-label">Correo electrónico </label>
                            <input v-model="email" type="email" class="form-control"
                                :class="{ 'is-invalid': validationErrors.email }"
                                placeholder="example@municipalidadarica.cl">
                            <div class="invalid-feedback" v-if="validationErrors.email">
                                {{ validationErrors.email[0] }}
                            </div>
                        </div>
                        <div class="form-footer">
                            <button v-if="loading" type="submit" class="btn btn-primary w-100" disabled>
                                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                Cargando...
                            </button>
                            <button v-else type="submit" class="btn btn-primary w-100">
                                <!-- Download SVG icon from http://tabler-icons.io/i/mail -->
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
                                    viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path
                                        d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
                                    <path d="M3 7l9 6l9 -6" />
                                </svg>
                                Enviar enlace para restablecer contraseña
                            </button>
                        </div>
                    </form>
                    <div class="text-center text-secondary mt-3">
                        <router-link to="/login" tabindex="-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M15 6l-6 6l6 6" />
                            </svg>
                            Volver atrás</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { axiosInstance } from '@/plugins/axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

// Instancia Toast 
const $toast = useToast();

// Propiedades reactivas
const email = ref('');
const validationErrors = ref({});
const loading = ref(false);

// Función para enviar el formulario
const submit = async () => {
    try {
        loading.value = true;
        clearErrors();

        const response = await axiosInstance.post('/api/auth/password/email', {
            email: email.value,
        });

        $toast.success(response.data.message, {
            position: 'top-right',
        });

        email.value = '';
    } catch (error) {
        handleRequestError(error);
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