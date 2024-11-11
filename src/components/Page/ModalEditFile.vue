<template>
    <div>
        <div class="modal modal-blur fade" id="modal-edit-file" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-xl" role="document">
                <form>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Editar Documento</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div v-if="loadingSubmit" class="progress progress-sm">
                            <div class="progress-bar progress-bar-indeterminate"></div>
                        </div>
                        <div class="modal-body">
                            <div class="row row-cards">
                                <div class="col-md-6">
                                    <!-- Campo de nombre -->
                                    <div class="mb-3">
                                        <label class="form-label required">Nombre</label>
                                        <div class="row g-2">
                                            <div class="col">
                                                <input v-model="name" :class="{ 'is-invalid': validationErrors.name }"
                                                    type="text" class="form-control"
                                                    placeholder="Ingrese el nombre del archivo" />
                                                <!-- Mostrar mensaje de error si existe -->
                                                <div v-if="validationErrors.name" class="invalid-feedback">
                                                    {{ validationErrors.name[0] }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <!-- Campo de nombre -->
                                    <div class="mb-3">
                                        <label class="form-label">Descripción</label>
                                        <div class="row g-2">
                                            <div class="col">
                                                <input v-model="description"
                                                    :class="{ 'is-invalid': validationErrors.description }" type="text"
                                                    class="form-control"
                                                    placeholder="Ingrese una descripción del archivo" />
                                                <!-- Mostrar mensaje de error si existe -->
                                                <div v-if="validationErrors.description" class="invalid-feedback">
                                                    {{ validationErrors.description[0] }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <!-- Footer del modal con botones -->
                        <div class="modal-footer">
                            <a @click="closeModal()" href="#" class="btn btn-link link-secondary">Cancelar</a>
                            <button type="button" @click="submit" class="btn btn-primary ms-auto"
                                :disabled="loadingSubmit">
                                <span v-if="loadingSubmit" class="spinner-border spinner-border-sm me-2"
                                    role="status"></span>
                                <span v-if="loadingSubmit">Cargando..</span>
                                <span v-else>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path
                                            d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
                                        <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                                        <path d="M14 4l0 4l-6 0l0 -4" />
                                    </svg>
                                    Guardar Cambios
                                </span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { axiosInstance } from '@/plugins/axios';
import { Modal } from 'bootstrap';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import { useRoute } from 'vue-router';

// Definir eventos y estado
const emit = defineEmits(["listar-datos"]);
const $toast = useToast();
const route = useRoute();

// Definir referencias reactivas
const id = ref("");
const name = ref("");
const description = ref("");
const modalFile = ref(null);
const loadingSubmit = ref(false);
const validationErrors = ref({});

// Inicializar el modal
onMounted(() => {
    setModal();
});

// Manejo de envío del formulario
const submit = async () => {
    loadingSubmit.value = true;
    try {
        clearErrors();

        const response = await axiosInstance.put("/api/files/" + id.value, {
            id: id.value,
            name: name.value,
            description: description.value, // Enviar solo los IDs de los permisos seleccionados
        });

        closeModal();
        id.value = "";
        name.value = "";
        description.value = "";

        emit("listar-datos");
        $toast.success(response.data.message, { position: "top" });
        closeModal();
    } catch (error) {
        handleRequestError(error);
    } finally {
        loadingSubmit.value = false;
    }
};


// Configurar modal de registro
const setModal = () => {
    modalFile.value = new Modal("#modal-edit-file", {});
};

// Abrir modal de registro
const openModal = (file) => {
    id.value = "";
    name.value = "";
    description.value = "";
    clearErrors();
    modalFile.value.show();
    cargarData(file);
};

// Cerrar modal
const closeModal = () => {
    modalFile.value.hide();
};

// Limpiar errores
const clearErrors = () => {
    validationErrors.value = {};
};

// Cargar Data
const cargarData = (file) => {
    id.value = file.id;
    name.value = file.name;
    description.value = file.description;
};

// Manejar errores de la API
const handleRequestError = (error) => {
    if (error.response) {
        const status = error.response.status;
        const message = error.response.data.message || 'Error del Sistema';

        switch (status) {
            case 401:
                $toast.error('No autorizado. ' + message, { position: 'top-right' });
                break;
            case 403:
                $toast.error('Prohibido. ' + message, { position: 'top-right' });
                break;
            case 404:
                $toast.error(message, { position: 'top-right' });
                break;
            case 429:
                $toast.error('Demasiadas solicitudes. ' + message, { position: 'top-right' });
                break;
            case 500:
                $toast.error('Error interno del servidor. ' + message, { position: 'top-right' });
                break;
            case 422:
                // Error de validación, se llenan los errores de validación
                validationErrors.value = error.response.data.errors;
                $toast.error('Error de validación.', { position: 'top-right' });
                break;
            default:
                $toast.error(`Error del Sistema ${message}`, { position: 'top-right' });
        }
    } else {
        $toast.error(`Error del Sistema ${error}`, { position: 'top-right' });
    }
};

defineExpose({
    openModal,
});
</script>