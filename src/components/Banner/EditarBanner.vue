<template>
  <div>
    <div class="modal modal-blur fade" id="modal-editar" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-xl" role="document">
        <form>
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Modificar Banner</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div v-if="loadingSubmit" class="progress progress-sm">
              <div class="progress-bar progress-bar-indeterminate"></div>
            </div>
            <div class="modal-body">

              <!-- Campo de título -->
              <div class="mb-3">
                <label class="form-label required">Titulo</label>
                <div class="row g-2">
                  <div class="col">
                    <input v-model="titulo" :class="{ 'is-invalid': validationErrors.titulo }" type="text"
                      class="form-control" placeholder="Ingrese el título" />
                    <!-- Mostrar mensaje de error si existe -->
                    <div v-if="validationErrors.titulo" class="invalid-feedback">
                      {{ validationErrors.titulo[0] }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Campo de URL -->
              <div class="mb-3">
                <label class="form-label required">URL</label>
                <div class="row g-2">
                  <div class="col">
                    <input v-model="url" :class="{ 'is-invalid': validationErrors.url }" type="text"
                      class="form-control" placeholder="Ingrese el título" />
                    <!-- Mostrar mensaje de error si existe -->
                    <div v-if="validationErrors.url" class="invalid-feedback">
                      {{ validationErrors.url[0] }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Campo de imagen -->
              <div class="mb-3">
                <label class="form-label required">Imagen</label>
                <DropzoneImg v-if="isModalOpen" ref="dropzoneComponent" />
                <!-- Mostrar mensaje de error si existe -->
                <input :class="{ 'is-invalid': validationErrors.imagen }" hidden />
                <div v-if="validationErrors.imagen" class="invalid-feedback">
                  {{ validationErrors.imagen[0] }}
                </div>
              </div>

              <!-- Campo de estado (radio buttons) -->
              <div class="mb-3">
                <div class="form-label required">Publico/Oculto</div>
                <div>
                  <label class="form-check form-check-inline">
                    <input v-model="estado" class="form-check-input" type="radio" value="publicado"
                      :class="{ 'is-invalid': validationErrors.estado }" />
                    <span class="form-check-label">Publicar</span>
                  </label>
                  <label class="form-check form-check-inline">
                    <input v-model="estado" class="form-check-input" type="radio" value="oculto"
                      :class="{ 'is-invalid': validationErrors.estado }" />
                    <span class="form-check-label">Ocultar</span>
                  </label>
                </div>
                <!-- Mostrar mensaje de error si existe -->
                <div v-if="validationErrors.estado" class="invalid-feedback">
                  {{ validationErrors.estado[0] }}
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <a @click="closeModal()" href="#" class="btn btn-link link-secondary">
                Cancelar
              </a>
              <button type="button" @click="submit" class="btn btn-primary ms-auto" :disabled="loadingSubmit">
                <span v-if="loadingSubmit" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <span v-if="loadingSubmit">Cargando..</span>
                <span v-else><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-device-floppy"
                    width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
                    <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                    <path d="M14 4l0 4l-6 0l0 -4" />
                  </svg>Actualizar</span>
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
import DropzoneImg from '@/components/Utils/DropzoneImg.vue';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

// Definir eventos y estado
const emit = defineEmits(["listar-datos"]);
const $toast = useToast();

// Definir referencias reactivas
const id = ref("");
const titulo = ref("");
const url = ref("");
const estado = ref("");
const dropzoneComponent = ref(null);
const modalEditar = ref(null);
const loadingSubmit = ref(false);
const validationErrors = ref({});
const isModalOpen = ref(false);

// Inicializar el modal
onMounted(() => {
  setModal();
});

// Manejo de envío del formulario
const submit = async () => {
  loadingSubmit.value = true;
  clearErrors();

  const formData = new FormData();
  formData.append('_method', 'PUT');
  formData.append('titulo', titulo.value);
  formData.append('url', url.value);
  formData.append('estado', estado.value);

  // Obtener el archivo desde Dropzone
  const file = dropzoneComponent.value.getFile();
  if (file) {
    formData.append('imagen', file);
  } else {
    console.error('No hay imagen seleccionada');
  }

  try {
    const response = await axiosInstance.post(`/api/banners/${id.value}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });

    // Limpiar campos y cerrar el modal
    id.value = "";
    titulo.value = "";
    url.value = "";
    estado.value = "";
    closeModal();

    // Notificación de éxito
    $toast.success(response.data.message, { position: "top" });
    emit("listar-datos");
  } catch (error) {
    handleRequestError(error);
  } finally {
    loadingSubmit.value = false;
  }
};

// Configurar modal de registro
const setModal = () => {
  modalEditar.value = new Modal("#modal-editar", {});
};

// Abrir modal de registro
const openModal = (page) => {
  titulo.value = "";
  url.value = "";
  estado.value = "";
  clearErrors();
  modalEditar.value.show();
  cargarData(page);
  isModalOpen.value = true;
};

// Cargar Data
const cargarData = (page) => {
  id.value = page.id;
  titulo.value = page.titulo;
  url.value = page.url;
  estado.value = page.estado;
};

// Cerrar modal
const closeModal = () => {
  modalEditar.value.hide();
  isModalOpen.value = false;
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

defineExpose({
  openModal,
});
</script>
