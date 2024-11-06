<template>
  <div>
    <!-- MODAL-->
    <a @click="openModal()" href="#" class="btn btn-warning d-none d-sm-inline-block" data-bs-target="#modal-registar">
      <!-- Download SVG icon from http://tabler-icons.io/i/plus -->
      <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
        stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 5l0 14"></path>
        <path d="M5 12l14 0"></path>
      </svg>
      Registrar Rol
    </a>
    <div class="modal modal-blur fade" id="modal-registar" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-xl" role="document">
        <form @submit.prevent="submit()">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Registro un nuevo Rol</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div v-if="loadingSubmit" class="progress progress-sm">
              <div class="progress-bar progress-bar-indeterminate"></div>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <div class="row g-2">
                  <div class="col">
                    <input v-model="nombre" class="form-control" type="text"
                      :class="{ 'is-invalid': validationErrors.nombre }" id="label-nombre"
                      placeholder="Ingrese el nombre del nuevo rol">
                    <div class="invalid-feedback" v-if="validationErrors.nombre">
                      {{ validationErrors.nombre[0] }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="hr-text my-3">Permisos</div>
                <div class="col-12">
                  <div class="card">
                    <div class="table-responsive">
                      <table class="table">
                        <thead>
                          <tr>
                            <th class="w-50">Módulo</th>
                            <th>Listar</th>
                            <th>Guardar</th>
                            <th>Editar</th>
                            <th>Eliminar</th>
                            <th>Exportar</th>
                            <th>Importar</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Roles</td>
                            <td v-for="(item, index) in permisosRol" :key="index">
                              <label class="form-check form-switch">
                                <input v-model="permisos" class="form-check-input" type="checkbox" checked=""
                                  :value="item.id" />
                              </label>
                            </td>
                          </tr>
                          <tr>
                            <td>Vehículo</td>
                            <td v-for="(item, index) in permisosVehiculo" :key="index">
                              <label class="form-check form-switch">
                                <input v-model="permisos" class="form-check-input" type="checkbox" checked=""
                                  :value="item.id" />
                              </label>
                            </td>
                          </tr>
                          <tr>
                            <td>Observación</td>
                            <td v-for="(item, index) in permisosObservacion" :key="index">
                              <label class="form-check form-switch">
                                <input v-model="permisos" class="form-check-input" type="checkbox" checked=""
                                  :value="item.id" />
                              </label>
                            </td>
                          </tr>
                          <tr>
                            <td>Empresa</td>
                            <td v-for="(item, index) in permisosEmpresa" :key="index">
                              <label class="form-check form-switch">
                                <input v-model="permisos" class="form-check-input" type="checkbox" checked=""
                                  :value="item.id" />
                              </label>
                            </td>
                          </tr>
                          <tr>
                            <td>Pago</td>
                            <td v-for="(item, index) in permisosPago" :key="index">
                              <label class="form-check form-switch">
                                <input v-model="permisos" class="form-check-input" type="checkbox" checked=""
                                  :value="item.id" />
                              </label>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <a @click="closeModal()" href="#" class="btn btn-link link-secondary">
                Cancelar
              </a>
              <button type="button" @click="submit()" class="btn btn-primary ms-auto" :disabled="loadingSubmit">
                <span v-if="loadingSubmit" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <span v-if="loadingSubmit">Cargando..</span>
                <span v-else><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-device-floppy"
                    width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
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
import { ref, onMounted } from "vue";
import { axiosInstance } from '@/plugins/axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import { Modal } from 'bootstrap';

// Definir eventos emitidos
const emit = defineEmits(["listar-datos"]);
const $toast = useToast();

// Variables reactivas
const nombre = ref("");
const permisos = ref([]);
const modalRegistrar = ref(null);
const loadingSubmit = ref(false);
const validationErrors = ref({});

const permisosRol = ref([]);
const permisosVehiculo = ref([]);
const permisosObservacion = ref([]);
const permisosEmpresa = ref([]);
const permisosPago = ref([]);

// Ejecutar al montar el componente
onMounted(() => {
  setModal();
});

// Función para enviar el formulario
const submit = async () => {
  try {
    loadingSubmit.value = true;
    clearErrors();

    const response = await axiosInstance.post("/api/roles", {
      nombre: nombre.value,
      permisos: permisos.value, // Enviar solo los IDs de los permisos seleccionados
    });
    permisos.value = [];
    nombre.value = "";
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

// Función para obtener permisos
const getPermisos = async () => {
  try {
    const response = await axiosInstance.get("/api/permissions");
    const permisos = response.data.data;

    permisosRol.value = permisos.filter((item) => item.guard_name === "rol");
    permisosVehiculo.value = permisos.filter((item) => item.guard_name === "vehiculo");
    permisosObservacion.value = permisos.filter((item) => item.guard_name === "observacion");
    permisosEmpresa.value = permisos.filter((item) => item.guard_name === "empresa");
    permisosPago.value = permisos.filter((item) => item.guard_name === "Pago");

  } catch (error) {
    handleRequestError(error);
  }
};

// Función para configurar el modal
const setModal = async () => {
  modalRegistrar.value = new Modal("#modal-registar", {});
};

// Función para abrir el modal
const openModal = () => {
  getPermisos();
  nombre.value = "";
  permisos.value = [];
  clearErrors();
  modalRegistrar.value.show();
};

// Función para cerrar el modal
const closeModal = () => {
  modalRegistrar.value.hide();
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

</script>
