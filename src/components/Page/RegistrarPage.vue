<template>
  <div>
    <!-- MODAL-->
    <a @click="openModal()" href="#" class="btn btn-primary d-none d-sm-inline-block" data-bs-target="#modal-registrar">
      <!-- Download SVG icon from http://tabler-icons.io/i/plus -->
      <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
        stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 5l0 14"></path>
        <path d="M5 12l14 0"></path>
      </svg>
      Registrar Página
    </a>
    <div class="modal modal-blur fade" id="modal-registrar" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-xl" role="document">
        <form>
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Registrar una nueva Página</h5>
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
                    <input v-model="title" :class="{ 'is-invalid': validationErrors.title }" type="text"
                      class="form-control" placeholder="Ingrese el título" />
                    <!-- Mostrar mensaje de error si existe -->
                    <div v-if="validationErrors.title" class="invalid-feedback">
                      {{ validationErrors.title[0] }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Campo de content -->
              <div class="mb-3">
                <label class="form-label required">Contenido</label>
                <div class="row g-2">
                  <div class="col">
                    <CKEditor v-model="content" />
                    <!-- Mostrar mensaje de error si existe -->
                    <input :class="{ 'is-invalid': validationErrors.content }" hidden />
                    <div v-if="validationErrors.content" class="invalid-feedback">
                      {{ validationErrors.content[0] }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Campo de image -->
              <div class="mb-3">
                <label class="form-label required">Imagen</label>
                <DropzoneImg ref="dropzoneComponent" />
                <!-- Mostrar mensaje de error si existe -->
                <input :class="{ 'is-invalid': validationErrors.image }" hidden />
                <div v-if="validationErrors.image" class="invalid-feedback">
                  {{ validationErrors.image[0] }}
                </div>
              </div>

              <!-- Campo de status (radio buttons) -->
              <div class="mb-3">
                <div class="form-label required">Publico/Oculto</div>
                <div>
                  <label class="form-check form-check-inline">
                    <input v-model="status" class="form-check-input" type="radio" value="published"
                      :class="{ 'is-invalid': validationErrors.status }" />
                    <span class="form-check-label">Publicar</span>
                  </label>
                  <label class="form-check form-check-inline">
                    <input v-model="status" class="form-check-input" type="radio" value="hidden"
                      :class="{ 'is-invalid': validationErrors.status }" />
                    <span class="form-check-label">Ocultar</span>
                  </label>
                </div>
                <!-- Mostrar mensaje de error si existe -->
                <div v-if="validationErrors.status" class="invalid-feedback">
                  {{ validationErrors.status[0] }}
                </div>
              </div>
            </div>

            <!-- Footer del modal con botones -->
            <div class="modal-footer">
              <a @click="closeModal()" href="#" class="btn btn-link link-secondary">Cancelar</a>
              <button type="button" @click="submit" class="btn btn-primary ms-auto" :disabled="loadingSubmit">
                <span v-if="loadingSubmit" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <span v-if="loadingSubmit">Cargando..</span>
                <span v-else>
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-device-floppy" width="24"
                    height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
                    <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                    <path d="M14 4l0 4l-6 0l0 -4" />
                  </svg>
                  Guardar
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
import DropzoneImg from '@/components/Utils/DropzoneImg.vue';
import CKEditor from "@/components/Utils/CKEditor.vue";
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

// Definir eventos y status
const emit = defineEmits(["listar-datos"]);
const $toast = useToast();

// Definir referencias reactivas
const title = ref("");
const content = ref("");
const status = ref("");
const dropzoneComponent = ref(null);
const modalRegistrar = ref(null);
const loadingSubmit = ref(false);
const validationErrors = ref({});

// Inicializar el modal
onMounted(() => {
  setModal();
});

// Configurar modal de registro
const setModal = () => {
  modalRegistrar.value = new Modal("#modal-registrar", {});
};

// Abrir modal de registro
const openModal = () => {
  title.value = "";
  content.value = "";
  status.value = "";
  clearErrors();
  modalRegistrar.value.show();
  dropzoneComponent.value.removeAllFiles();
};

// Cerrar modal
const closeModal = () => {
  modalRegistrar.value.hide();
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
  const file = dropzoneComponent.value.getFile();
  if (file) {
    formData.append('image', file);
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