<template>
    <div>
        <div class="page-header d-print-none">
            <div class="container-fluid">
                <div class="row g-2 align-items-center">
                    <div class="col"><!-- Page pre-title -->
                        <div class="page-pretitle">Módulo</div>
                        <h2 class="page-title">Registar Página</h2>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-body">
            <div class="container-fluid">
                <div class="row g-3 align-items-center pb-3">
                    <div class="col-md-auto ms-auto d-print-none mt-0">
                        <div class="btn-list">
                            <a @click.prevent="goBack()" class="btn">
                                <!-- Download SVG icon from http://tabler-icons.io/i/settings -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-back-up">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M9 14l-4 -4l4 -4" />
                                    <path d="M5 10h11a4 4 0 1 1 0 8h-1" />
                                </svg>
                                Volver
                            </a>
                            <button type="button" @click="submit" class="btn btn-primary" :disabled="loadingSubmit">
                                <span v-if="loadingSubmit" class="spinner-border spinner-border-sm me-2"
                                    role="status"></span>
                                <span v-if="loadingSubmit">Cargando..</span>
                                <span v-else>
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        class="icon icon-tabler icon-tabler-device-floppy" width="24" height="24"
                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                                        stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path
                                            d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
                                        <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                                        <path d="M14 4l0 4l-6 0l0 -4" />
                                    </svg>
                                    Guardar
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row row-cards">
                    <div class="col-md-12">
                        <div class="card">
                            <div v-if="loadingSubmit" class="progress progress-sm">
                                <div class="progress-bar progress-bar-indeterminate"></div>
                            </div>
                            <div class="card-header">
                                <h3 class="card-title">Datos de la página</h3>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-10">
                                        <div class="mb-3">
                                            <div class="form-label required">Titulo</div>
                                            <input v-model="title" :class="{ 'is-invalid': validationErrors.title }"
                                                type="text" class="form-control" />
                                            <!-- Mostrar mensaje de error si existe -->
                                            <div v-if="validationErrors.title" class="invalid-feedback">
                                                {{ validationErrors.title[0] }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="mb-3">
                                            <div class="form-label required">Estado</div>
                                            <div class="pt-2">
                                                <label class="form-check form-check-inline">
                                                    <input v-model="status" class="form-check-input" type="radio"
                                                        value="published"
                                                        :class="{ 'is-invalid': validationErrors.status }" />
                                                    <span class="form-check-label">Público</span>
                                                </label>
                                                <label class="form-check form-check-inline">
                                                    <input v-model="status" class="form-check-input" type="radio"
                                                        value="hidden"
                                                        :class="{ 'is-invalid': validationErrors.status }" />
                                                    <span class="form-check-label">Oculto</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="mb-3">
                                            <div class="form-label">Contenido de la página</div>
                                            <CKEditor v-model="content" />
                                            <!-- Mostrar mensaje de error si existe -->
                                            <input :class="{ 'is-invalid': validationErrors.content }" hidden />
                                            <div v-if="validationErrors.content" class="invalid-feedback">
                                                {{ validationErrors.content[0] }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-5">
                                        <div class="mb-3">
                                            <label class="form-label required">Imagen Menu</label>
                                            <DropzoneImg1 ref="dropzoneComponentMenu" />
                                            <!-- Mostrar mensaje de error si existe -->
                                            <input :class="{ 'is-invalid': validationErrors.image_menu }" hidden />
                                            <div v-if="validationErrors.image_menu" class="invalid-feedback">
                                                {{ validationErrors.image_menu[0] }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-7">
                                        <div class="mb-3">
                                            <label class="form-label required">Imagen Banner</label>
                                            <DropzoneImg2 ref="dropzoneComponentBanner" />
                                            <!-- Mostrar mensaje de error si existe -->
                                            <input :class="{ 'is-invalid': validationErrors.image_banner }" hidden />
                                            <div v-if="validationErrors.image_banner" class="invalid-feedback">
                                                {{ validationErrors.image_banner[0] }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { axiosInstance } from '@/plugins/axios';
import DropzoneImg1 from '@/components/Utils/DropzoneImg1.vue';
import DropzoneImg2 from '@/components/Utils/DropzoneImg2.vue';
import CKEditor from "@/components/Utils/CKEditor.vue";
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import { useRouter } from 'vue-router';

// Definir eventos y status
const $toast = useToast();
const router = useRouter();

// Definir referencias reactivas
const title = ref("");
const content = ref("");
const status = ref("");
const dropzoneComponentMenu = ref(null);
const dropzoneComponentBanner = ref(null);
const loadingSubmit = ref(false);
const validationErrors = ref({});

// Inicializar el modal
onMounted(() => {
    loadPage();
});

// Configurar modal de registro
const goBack = () => {
    router.go(-1);
};

// Limpiar formulario al cargar
const loadPage = () => {
    title.value = "";
    content.value = "";
    status.value = "";
    clearErrors();
    dropzoneComponentMenu.value.removeAllFiles();
    dropzoneComponentBanner.value.removeAllFiles();
};

// Manejo de envío del formulario
const submit = async () => {
    loadingSubmit.value = true;
    clearErrors();

    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('content', content.value);
    formData.append('status', status.value);

    // Obtener el archivo desde Dropzone
    const image_menu = dropzoneComponentMenu.value.getFile();
    if (image_menu) {
        formData.append('image_menu', image_menu);
    } else {
        console.error('No hay imagen seleccionada');
    }

    const image_banner = dropzoneComponentBanner.value.getFile();
    if (image_banner) {
        formData.append('image_banner', image_banner);
    } else {
        console.error('No hay imagen seleccionada');
    }

    try {
        const response = await axiosInstance.post("/api/pages", formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true, // Para usar con Laravel Sanctum
        });

        // Limpiar campos y cerrar el modal
        title.value = "";
        content.value = "";
        status.value = "";

        // Notificación de éxito
        $toast.success(response.data.message, { position: "top" });
        goBack();
    } catch (error) {
        handleRequestError(error);
    } finally {
        loadingSubmit.value = false;
    }
};

// Limpiar errores
const clearErrors = () => {
    validationErrors.value = {};
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
</script>