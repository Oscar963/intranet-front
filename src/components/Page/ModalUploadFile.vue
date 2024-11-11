<template>
    <div>
        <div class="modal modal-blur fade" id="modal-file" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-xl" role="document">
                <form>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Documentos de la Página</h5>
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
                                <div class="col-md-10">
                                    <!-- Campo de archivo -->
                                    <div class="mb-3">
                                        <label class="form-label required">Seleccionar Archivo</label>
                                        <input type="file" class="form-control"
                                            :class="{ 'is-invalid': validationErrors.file }"
                                            @change="handleFileChange" />
                                        <!-- Mostrar mensaje de error si existe -->
                                        <div v-if="validationErrors.file" class="invalid-feedback">
                                            {{ validationErrors.file[0] }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <!-- Campo de btn upload -->
                                    <div class="mb-3">
                                        <label class="form-label "> &nbsp;</label>
                                        <button type="button" @click="submit" class="btn btn-primary ms-auto"
                                            :disabled="loadingSubmit">
                                            <span v-if="loadingSubmit" class="spinner-border spinner-border-sm me-2"
                                                role="status"></span>
                                            <span v-if="loadingSubmit">Cargando..</span>
                                            <span v-else>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                    class="icon icon-tabler icons-tabler-outline icon-tabler-upload">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                                                    <path d="M7 9l5 -5l5 5" />
                                                    <path d="M12 4l0 12" />
                                                </svg>
                                                Subir Archivos
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <!-- Footer del modal con botones -->
                        <div class="modal-footer">
                            <a @click="closeModal()" href="#" class="btn btn-link link-secondary">Cancelar</a>
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
const slug = ref("");
const name = ref("");
const description = ref("");
const selectedFile = ref(null);
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
    clearErrors();

    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('description', description.value);
    formData.append('slug', slug.value);

    if (selectedFile.value) {
        formData.append('file', selectedFile.value);
    } else {
        validationErrors.value.file = ['Debes seleccionar un archivo.'];
        loadingSubmit.value = false;
        return;
    }
    try {
        const response = await axiosInstance.post(`/api/pages/file/upload/${slug}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        });
        name.value = "";
        description.value = "";
        selectedFile.value = null;

        $toast.success(response.data.message, { position: "top" });
        emit("listar-datos");
        closeModal();
    } catch (error) {
        handleRequestError(error);
    } finally {
        loadingSubmit.value = false;
    }
};

// Configurar modal de registro
const setModal = () => {
    modalFile.value = new Modal("#modal-file", {});
};

// Abrir modal de registro
const openModal = (data) => {
    clearErrors();
    slug.value = data;
    selectedFile.value = null;
    modalFile.value.show();
};

// Cerrar modal
const closeModal = () => {
    modalFile.value.hide();
};

// Limpiar errores
const clearErrors = () => {
    validationErrors.value = {};
};

// Seleccion de archivos
const handleFileChange = (event) => {
    const file = event.target.files[0];
    selectedFile.value = file;
    validationErrors.value.file = null;

    if (!file) {
        validationErrors.value.file = ['Debes seleccionar un archivo.'];
        return;
    }

    const allowedExtensions = /(\.pdf|\.doc|\.docx|\.xls|\.xlsx|\.ppt|\.pptx|\.mp4|\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!allowedExtensions.test(file.name)) {
        validationErrors.value.file = ['Tipo de archivo no permitido.'];
        return;
    }

    const maxSize = 300 * 1024 * 1024;
    if (file.size > maxSize) {
        validationErrors.value.file = ['El archivo no debe superar los 300 MB.'];
        return;
    }
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