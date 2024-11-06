<template>
    <div>
        <div class="modal modal-blur fade" id="modal-restablecer" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-xl" role="document">
                <form @submit.prevent="submit()">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Restablecer Contraseña</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div v-if="loadingSubmit" class="progress progress-sm">
                            <div class="progress-bar progress-bar-indeterminate"></div>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Generar una contraseña automáticamente</label>
                                <div class="row g-2">
                                    <div class="col">
                                        <input v-model="password" type="text" class="form-control" disabled readonly>
                                    </div>
                                    <div class="col-auto">
                                        <button type="button" class="btn btn-icon" @click="generarContrasena()">
                                            <!-- Download SVG icon from http://tabler-icons.io/i/search -->
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round"
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-refresh">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                                                <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div class="col-auto">
                                        <button type="button" class="btn btn-icon" @click="clipboard()">
                                            <!-- Download SVG icon from http://tabler-icons.io/i/search -->
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round"
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path
                                                    d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                                                <path
                                                    d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <a @click="closeModal()" href="#" class="btn btn-link link-secondary">
                                Cancelar
                            </a>
                            <button type="submit" @click="submit()" class="btn btn-primary ms-auto"
                                :disabled="loadingSubmit">
                                <span v-if="loadingSubmit" class="spinner-border spinner-border-sm me-2"
                                    role="status"></span>
                                <span v-if="loadingSubmit">Cargando..</span>
                                <span v-else><svg xmlns="http://www.w3.org/2000/svg"
                                        class="icon icon-tabler icon-tabler-device-floppy" width="24" height="24"
                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                                        stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path
                                            d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
                                        <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                                        <path d="M14 4l0 4l-6 0l0 -4" />
                                    </svg>Guardar</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { axiosInstance } from '@/plugins/axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import { Modal } from 'bootstrap';

// Definir eventos emitidos
const emit = defineEmits(["listar-datos"]);

const id = ref("");
const password = ref("");
const $toast = useToast();

const modalRestablecer = ref(null);
const loadingSubmit = ref(false);
const validationErrors = ref({});

// Ejecutar al montar el componente
onMounted(() => {
    setModal();
});

// Función para enviar el formulario
const submit = async () => {
    try {
        loadingSubmit.value = true;
        clearErrors();

        const response = await axiosInstance.post("/api/auth/restablecer-contrasena", {
            id: id.value,
            password: password.value,
        });

        $toast.success(response.data.message, {
            position: "top-right",
        });
        closeModal();

        emit("listar-datos");
    } catch (error) {
        handleRequestError(error);
    } finally {
        loadingSubmit.value = false;
    }
};

// Función para configurar el modal
const setModal = async () => {
    modalRestablecer.value = new Modal("#modal-restablecer", {});
};

// Función para abrir el modal y cargar datos del usuario
const openModal = (user) => {
    id.value = "";
    password.value = "";
    generarContrasena();
    clearErrors();
    cargarData(user);
    modalRestablecer.value.show();
};

// Función para cargar datos del usuario
const cargarData = (user) => {
    id.value = user.id;
};

// Función para cerrar el modal
const closeModal = () => {
    modalRestablecer.value.hide();
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

function generarContrasena(longitud = 8, incluirMayusculas = true, incluirMinusculas = true, incluirNumeros = true, incluirEspeciales = true) {
    const tiposDeCaracteres = {
        mayusculas: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        minusculas: 'abcdefghijklmnopqrstuvwxyz',
        numeros: '0123456789',
        especiales: '!@#$%^&*()_+[]{}|;:,.<>?'
    };

    let caracteres = '';
    caracteres += incluirMayusculas ? tiposDeCaracteres.mayusculas : '';
    caracteres += incluirMinusculas ? tiposDeCaracteres.minusculas : '';
    caracteres += incluirNumeros ? tiposDeCaracteres.numeros : '';
    caracteres += incluirEspeciales ? tiposDeCaracteres.especiales : '';

    if (!caracteres) {
        throw new Error('Debe incluir al menos un tipo de caracter para generar la contraseña.');
    }

    password.value = Array.from({ length: longitud }, () => caracteres.charAt(Math.floor(Math.random() * caracteres.length))).join('');
}

function clipboard() {
    navigator.clipboard.writeText(password.value).then(() => {
        $toast.info('Contraseña copiada al portapapeles.', { position: 'top-right' });
    }).catch(() => {
        $toast.error('Error al copiar la contraseña.', { position: 'top-right' });

    });
}


// Exponer la función openModal
defineExpose({
    openModal,
});
</script>