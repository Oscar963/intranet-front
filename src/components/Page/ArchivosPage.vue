<template>
    <div>
        <div class="modal modal-blur fade" id="modal-archivos" tabindex="-1" role="dialog" aria-hidden="true">
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
                                <div class="col-md-5">
                                    <!-- Campo de nombre -->
                                    <div class="mb-3">
                                        <label class="form-label required">Nombre</label>
                                        <div class="row g-2">
                                            <div class="col">
                                                <input v-model="nombre"
                                                    :class="{ 'is-invalid': validationErrors.nombre }" type="text"
                                                    class="form-control" placeholder="Ingrese el nombre del archivo" />
                                                <!-- Mostrar mensaje de error si existe -->
                                                <div v-if="validationErrors.nombre" class="invalid-feedback">
                                                    {{ validationErrors.nombre[0] }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-5">
                                    <!-- Campo de archivo -->
                                    <div class="mb-3">
                                        <label class="form-label required">Seleccionar Archivo</label>
                                        <input type="file" class="form-control"
                                            :class="{ 'is-invalid': validationErrors.archivo }"
                                            @change="handleFileChange" />
                                        <!-- Mostrar mensaje de error si existe -->
                                        <div v-if="validationErrors.archivo" class="invalid-feedback">
                                            {{ validationErrors.archivo[0] }}
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
                            <div class="row row-cards">
                                <div class="col-md-12">
                                    <!-- Campo de nombre -->
                                    <div class="mb-3">
                                        <div class="card">
                                            <div class="table-responsive">
                                                <table class="table table-vcenter card-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Nombre</th>
                                                            <th>Tamaño</th>
                                                            <th>Fecha</th>
                                                            <th class="w-1"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-if="loadingFiles">
                                                            <td colspan="4" class="text-secondary text-center">
                                                                Cargando datos...
                                                            </td>
                                                        </tr>
                                                        <tr v-else-if="!listadoArchivos.length">
                                                            <td colspan="4" class="text-secondary text-center">
                                                                No se encontraron registros
                                                            </td>
                                                        </tr>
                                                        <tr v-else v-for="(item, index) in listadoArchivos"
                                                            :key="index">
                                                            <td>
                                                                <div class="d-flex py-1 align-items-center">
                                                                    <span class="avatar me-2"
                                                                        :style="`background-image: url(${getFileIcon(item.tipo_archivo)})`"></span>
                                                                    <div class="flex-fill">
                                                                        <div class="font-weight-medium">{{ item.nombre
                                                                            }}</div>
                                                                        <div class="text-secondary"><a href="#"
                                                                                class="text-reset text-uppercase">{{
                                                                                    item.tipo_archivo
                                                                                }}</a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td class="text-secondary">
                                                                {{ (item.tamano / (1024 * 1024)).toFixed(2) }} MB
                                                            </td>
                                                            <td class="text-secondary">
                                                                {{ item.created_at }}
                                                            </td>
                                                            <td>
                                                                <a @click="eliminarFile(item)"
                                                                    class=" px-1 cursor-pointer"
                                                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                                                    title="Eliminar">
                                                                    Eliminar
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
import Swal from "sweetalert2";

// Definir eventos y estado
const emit = defineEmits(["listar-datos"]);
const $toast = useToast();

// Definir referencias reactivas
const idPage = ref("");
const nombre = ref("");
const selectedArchivo = ref(null);
const listadoArchivos = ref([]);
const modalArchivo = ref(null);
const loadingSubmit = ref(false);
const loadingFiles = ref(false);
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
    formData.append('nombre', nombre.value);

    // Agregar el archivo seleccionado al FormData
    if (selectedArchivo.value) {
        formData.append('archivo', selectedArchivo.value);
    } else {
        validationErrors.value.archivo = ['Debes seleccionar un archivo.'];
        loadingSubmit.value = false;
        return;
    }

    try {
        const response = await axiosInstance.post(`/api/pages/upload/${idPage.value}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        });

        // Limpiar campos y cerrar el modal
        nombre.value = "";
        selectedArchivo.value = null; // Limpiar archivo seleccionado
        fetchFiles();

        // Notificación de éxito
        $toast.success(response.data.message, { position: "top" });
        emit("listar-datos");
    } catch (error) {
        handleRequestError(error);
    } finally {
        loadingSubmit.value = false;
    }
};

// Método para listar archivos
const fetchFiles = async () => {
    loadingSubmit.value = true;
    loadingFiles.value = true;
    try {
        const response = await axiosInstance.get(`/api/pages/archivos/${idPage.value}`);
        listadoArchivos.value = response.data.data;
    } catch (error) {
        handleRequestError(error);
    } finally {
        loadingFiles.value = false;
        loadingSubmit.value = false;
    }
};

const eliminarFile = async (file) => {
    try {
        const result = await Swal.fire({
            title: "¿Estás seguro que desea eliminar este archivo?",
            text: "¡Esta acción no podrá ser revertida!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#004693",
            confirmButtonText: "Sí, eliminar",
            cancelButtonColor: "#d63939",
            cancelButtonText: "No, cancelar",
        });
        if (result.isConfirmed) {
            await Swal.fire({
                title: "Archivo eliminado!",
                icon: "success",
                confirmButtonColor: "#004693",
                confirmButtonText: "Cerrar",
            });
            await axiosInstance.delete("/api/files/" + file.id);
            fetchFiles();
        }
    } catch (error) {
        console.log(error);
    }
};

// Configurar modal de registro
const setModal = () => {
    modalArchivo.value = new Modal("#modal-archivos", {});
};

// Abrir modal de registro
const openModal = (page) => {
    nombre.value = "";
    idPage.value = "";
    selectedArchivo.value = null;
    clearErrors();
    modalArchivo.value.show();
    cargarData(page);
    fetchFiles();
};

// Cargar Data
const cargarData = (page) => {
    idPage.value = page.id;
};

// Cerrar modal
const closeModal = () => {
    modalArchivo.value.hide();
};

// Limpiar errores
const clearErrors = () => {
    validationErrors.value = {};
};

function getFileIcon(tipoArchivo) {
    switch (tipoArchivo) {
        case 'pdf':
            return '/img/files/pdf.png';
        case 'doc':
        case 'docx':
            return '/img/files/word.png';
        case 'xls':
        case 'xlsx':
            return '/img/files/excel.png';
        case 'ppt':
        case 'pptx':
            return '/img/files/powerpoint.png';
        case 'mp4':
            return '/img/files/video.png';
        default:
            return '/img/files/default.png'; // Imagen por defecto
    }
}

// Seleccion de archivos
const handleFileChange = (event) => {
    const file = event.target.files[0];
    selectedArchivo.value = file; // Guardar el archivo en la referencia reactiva

    // Limpiar errores previos
    validationErrors.value.archivo = null;

    if (!file) {
        validationErrors.value.archivo = ['Debes seleccionar un archivo.'];
    } else {
        // Validar las extensiones permitidas
        const allowedExtensions = /(\.pdf|\.doc|\.docx|\.xls|\.xlsx|\.ppt|\.pptx|\.mp4)$/i;
        if (!allowedExtensions.test(file.name)) {
            validationErrors.value.archivo = ['Tipo de archivo no permitido.'];
        }

        // Validar el tamaño del archivo (25 MB en bytes = 25 * 1024 * 1024)
        const maxSize = 300 * 1024 * 1024;
        if (file.size > maxSize) {
            validationErrors.value.archivo = ['El archivo no debe superar los 300 MB.'];
        }
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