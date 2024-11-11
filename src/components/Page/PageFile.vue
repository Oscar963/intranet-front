<template>
    <div>
        <div class="page-header d-print-none">
            <div class="container-fluid">
                <div class="row g-2 align-items-center">
                    <div class="col"><!-- Page pre-title -->
                        <div class="page-pretitle">Módulo</div>
                        <h2 class="page-title">Subir documentos</h2>
                        <ModalUploadFile v-if="$can('page', 'file')" @listar-datos="loadData()" ref="uploadFileRef">
                        </ModalUploadFile>
                        <ModalEditFile v-if="$can('page', 'file')" @listar-datos="loadData()" ref="editFileRef">
                        </ModalEditFile>
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
                            <a v-if="$can('page', 'file')" @click="openModalUploadFile(slug)" class="btn btn-primary">
                                <!-- Download SVG icon from http://tabler-icons.io/i/settings -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="icon icon-tabler icons-tabler-outline icon-tabler-upload">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                                    <path d="M7 9l5 -5l5 5" />
                                    <path d="M12 4l0 12" />
                                </svg>
                                Subir Archivo
                            </a>
                        </div>
                    </div>
                </div>
                <div class="row row-cards">
                    <div class="col-md-12">
                        <div class="card">
                            <div v-if="loading" class="progress progress-sm">
                                <div class="progress-bar progress-bar-indeterminate"></div>
                            </div>
                            <div class="card-header">
                                <h3 class="card-title">Listado de documentos</h3>
                            </div>
                            <div class="table-responsive">
                                <table class="table card-table table-vcenter text-nowrap table-hover ">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Descripción</th>
                                            <th>Tipo</th>
                                            <th>Tamaño</th>
                                            <th>Fecha</th>
                                            <th>Subido por</th>
                                            <th>Actualizado por</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody class="align-middle">
                                        <tr v-if="loading">
                                            <td colspan="8" class="text-secondary text-center">
                                                Cargando datos...
                                            </td>
                                        </tr>
                                        <tr v-else-if="!listadoFiles.length">
                                            <td colspan="8" class="text-secondary text-center">
                                                No se encontraron registros
                                            </td>
                                        </tr>
                                        <tr v-else v-for="(item, index) in listadoFiles" :key="index">
                                            <td>
                                                <span class="flag flag-xs flag-country-us me-2"> {{ item.name }}</span>
                                            </td>
                                            <td>
                                                <span class="text-secondary">{{ item.description }}</span>
                                            </td>
                                            <td>
                                                <span class="text-secondary">{{ item.type }}</span>
                                            </td>
                                            <td>
                                                <span class="text-secondary">{{ item.size }} MB</span>
                                            </td>
                                            <td>
                                                <span class="text-secondary">{{ item.created_at }}</span>
                                            </td>
                                            <td>
                                                <span class="text-secondary"><svg xmlns="http://www.w3.org/2000/svg"
                                                        width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        class="icon icon-tabler icons-tabler-outline icon-tabler-user">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                                    </svg>
                                                    {{ item.created_by.name }} {{
                                                        item.created_by.apellido_paterno }} {{
                                                        item.created_by.apellido_materno }}</span>
                                            </td>
                                            <td>
                                                <span v-if="item.updated_by != null" class="text-secondary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                        class="icon icon-tabler icons-tabler-outline icon-tabler-user">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                                    </svg>
                                                    {{ item.updated_by.name }} {{
                                                        item.updated_by.apellido_paterno }} {{
                                                        item.updated_by.apellido_materno }}</span>
                                                <span v-else class="text-secondary">-</span>
                                            </td>
                                            <td>
                                                <a v-if="$can('page', 'file')" @click="openModalEditFile(item)"
                                                    class="text-dark px-1 cursor-pointer" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" title="Editar">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                        class="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path
                                                            d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                        <path
                                                            d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                        <path d="M16 5l3 3" />
                                                    </svg>
                                                </a>
                                                <a v-if="$can('page', 'file')" :href="item.url" target="_blank" download
                                                    class="text-dark px-1 cursor-pointer" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" title="Descargar">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                        class="icon icon-tabler icons-tabler-outline icon-tabler-download">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                                                        <path d="M7 11l5 5l5 -5" />
                                                        <path d="M12 4l0 12" />
                                                    </svg>
                                                </a>
                                                <a v-if="$can('page', 'file')" @click="deletePages(item)"
                                                    class="text-dark px-1 cursor-pointer" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" title="Eliminar">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                        class="icon icon-tabler icons-tabler-outline icon-tabler-trash">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M4 7l16 0" />
                                                        <path d="M10 11l0 6" />
                                                        <path d="M14 11l0 6" />
                                                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                                    </svg>
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
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
import ModalUploadFile from '@/components/Page/ModalUploadFile.vue';
import ModalEditFile from '@/components/Page/ModalEditFile.vue';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import { useRoute, useRouter } from 'vue-router';
import Swal from "sweetalert2";

// Definir eventos y status
const $toast = useToast();
const router = useRouter();
const route = useRoute();

// Definir referencias reactivas
const listadoFiles = ref([]);
const loading = ref(false);

const slug = route.params.slug;
const validationErrors = ref({});
const uploadFileRef = ref(null);
const editFileRef = ref(null);

onMounted(() => {
    loadData();
    loadPage();
});

// Volver atras
const goBack = () => {
    router.go(-1);
};

// Limpiar formulario al cargar
const loadPage = () => {
    clearErrors();
};

const openModalUploadFile = (slug) => {
    if (uploadFileRef.value) {
        uploadFileRef.value.openModal(slug);
    }
};

const openModalEditFile = (file) => {
    if (editFileRef.value) {
        editFileRef.value.openModal(file);
    }
};
// Cargar Data
const loadData = async () => {
    loading.value = true;
    try {
        const response = await axiosInstance.get(`/api/pages/files/${slug}`);
        listadoFiles.value = response.data.data;
    } catch (error) {
        handleRequestError(error);
    } finally {
        loading.value = false;
    }
};
// Limpiar errores
const clearErrors = () => {
    validationErrors.value = {};
};

const deletePages = async (page) => {
    try {
        const result = await Swal.fire({
            title: "¿Estás seguro que desea eliminar el archivo?",
            text: "¡Esta acción no podrá ser revertida!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#004693",
            confirmButtonText: "Sí, eliminar",
            cancelButtonColor: "#d63939",
            cancelButtonText: "No, cancelar",
        });

        if (result.isConfirmed) {
            const loadingSwal = Swal.fire({
                title: 'Procesando...',
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                },
                text: 'Eliminando el archivo, por favor espera...',
                allowOutsideClick: false,
            });

            // Llamar a la API para eliminar la página
            await axiosInstance.delete("/api/files/" + page.id);
            loadingSwal.close();

            // Mostrar mensaje de éxito
            await Swal.fire({
                title: "Archivo eliminado!",
                icon: "success",
                confirmButtonColor: "#004693",
                confirmButtonText: "Cerrar",
            });

            await loadData();
        }
    } catch (error) {
        // Manejo de errores
        Swal.fire({
            title: "Error",
            text: "Ocurrió un error al eliminar la página.",
            icon: "error",
            confirmButtonColor: "#004693",
            confirmButtonText: "Cerrar",
        });
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
</script>