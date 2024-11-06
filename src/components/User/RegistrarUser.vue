<template>
  <div>
    <!-- MODAL-->
    <a @click="openModal()" href="#" class="btn btn-warning d-none d-sm-inline-block" data-bs-target="#modal-registar">
      <!-- Download SVG icon from http://tabler-icons.io/i/plus -->
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-user-plus">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
        <path d="M16 19h6" />
        <path d="M19 16v6" />
        <path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
      </svg>
      Registrar Usuario
    </a>
    <div class="modal modal-blur fade" id="modal-registar" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-xl" role="document">
        <form @submit.prevent="submit()">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Registro Usuario</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div v-if="loadingSubmit" class="progress progress-sm">
              <div class="progress-bar progress-bar-indeterminate"></div>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Rut (12345678-9) </label>
                <div class="row g-2">
                  <div class="col">
                    <input v-model.trim="rut" class="form-control" :class="{ 'is-invalid': validationErrors.rut }"
                      type="text" placeholder="Ingrese el rut del usuario" @keyup="formatRutInput">
                    <div class="invalid-feedback" v-if="validationErrors.rut">
                      {{ validationErrors.rut[0] }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="mb-3 row">
                <div class="col-lg-6">
                  <label class="form-label">Nombre</label>
                  <div class="row g-2">
                    <div class="col">
                      <input v-model="nombre" class="form-control" :class="{ 'is-invalid': validationErrors.nombre }"
                        type="text" placeholder="Ingrese el nombre del nuevo usuario">
                      <div class="invalid-feedback" v-if="validationErrors.nombre">
                        {{ validationErrors.nombre[0] }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <label class="form-label">Correo electrónico</label>
                  <div class="row g-2">
                    <div class="col">
                      <input v-model="email" class="form-control" type="email"
                        :class="{ 'is-invalid': validationErrors.email }"
                        placeholder="Ingrese el email del nuevo usuario">
                      <div class="invalid-feedback" v-if="validationErrors.email">
                        {{ validationErrors.email[0] }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mb-3 row">
                <div class="col-lg-6">
                  <label class="form-label">Apellido Paterno</label>
                  <div class="row g-2">
                    <div class="col">
                      <input v-model="apellido_paterno" class="form-control"
                        :class="{ 'is-invalid': validationErrors.apellido_paterno }" type="text"
                        placeholder="Ingrese el Apellido Paterno">
                      <div class="invalid-feedback" v-if="validationErrors.apellido_paterno">
                        {{ validationErrors.apellido_paterno[0] }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <label class="form-label">Apellido Materno</label>
                  <div class="row g-2">
                    <div class="col">
                      <input v-model="apellido_materno" class="form-control"
                        :class="{ 'is-invalid': validationErrors.apellido_materno }" type="text"
                        placeholder="Ingrese el Apellido Materno">
                      <div class="invalid-feedback" v-if="validationErrors.apellido_materno">
                        {{ validationErrors.apellido_materno[0] }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mb-3 row">
                <div class="col-lg-6">
                  <label class="form-label">Contraseña</label>
                  <div class="row g-2">
                    <div class="col">
                      <input v-model="contrasena_nueva" :type="showPassword ? 'text' : 'password'" class="form-control"
                        :class="{ 'is-invalid': validationErrors.contrasena_nueva }" id="label-contrasena_nueva"
                        autocomplete="off">
                      <div class="invalid-feedback" v-if="validationErrors.contrasena_nueva">
                        {{ validationErrors.contrasena_nueva[0] }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <label class="form-label">Confirmar Contraseña</label>
                  <div class="row g-2">
                    <div class="col">
                      <input v-model="contrasena_confirmar" :type="showPassword ? 'text' : 'password'"
                        class="form-control" :class="{ 'is-invalid': validationErrors.contrasena_confirmar }"
                        id="label-contrasena_confirmar" autocomplete="off">
                      <div class="invalid-feedback" v-if="validationErrors.contrasena_confirmar">
                        {{ validationErrors.contrasena_confirmar[0] }}
                      </div>
                    </div>
                    <div class="col-auto">
                      <a href="#" @click="togglePasswordVisibility" class="btn btn-icon" title="Mostrar contraseña"
                        data-bs-toggle="tooltip">
                        <!-- Icono de ojo -->
                        <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-eye">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                          <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-eye-closed">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M21 9c-2.4 2.667 -5.4 4 -9 4c-3.6 0 -6.6 -1.333 -9 -4" />
                          <path d="M3 15l2.5 -3.8" />
                          <path d="M21 14.976l-2.492 -3.776" />
                          <path d="M9 17l.5 -4" />
                          <path d="M15 17l-.5 -4" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Estado</label>
                <div class="btn-group w-100" role="group">
                  <input v-model="estado" type="radio" class="btn-check" name="btn-radio-register"
                    id="btn-radio-register-1" autocomplete="off" :value="1" />
                  <label for="btn-radio-register-1" type="button" class="btn">Activo</label>
                  <input v-model="estado" type="radio" class="btn-check" name="btn-radio-register"
                    id="btn-radio-register-2" autocomplete="off" :value="0" />
                  <label for="btn-radio-register-2" type="button" class="btn">Suspender</label>
                </div>
              </div>
              <div class="mb-3">
                <div class="form-label">Rol</div>
                <div>
                  <label v-for="(item, index) in roles" :key="index" class="form-check">
                    <input v-model="selectedRoles" class="form-check-input" type="checkbox" :value="item.id" />
                    <span class="form-check-label">{{ item.nombre }}</span>
                  </label>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <a @click="closeModal()" href="#" class="btn btn-link link-secondary">
                Cancelar
              </a>
              <button type="submit" @click="submit()" class="btn btn-primary ms-auto" :disabled="loadingSubmit">
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
import { ref, onMounted, watch } from "vue";
import { axiosInstance } from '@/plugins/axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import { Modal } from 'bootstrap';

// Definir eventos emitidos
const emit = defineEmits(["listar-datos"]);

const rut = ref("");
const nombre = ref("");
const email = ref("");
const apellido_paterno = ref("");
const apellido_materno = ref("");
const contrasena_nueva = ref("");
const contrasena_confirmar = ref("");

const showPassword = ref(false);
const estado = ref(1);
const roles = ref([]);
const selectedRoles = ref([]);
const $toast = useToast();

const modalRegistrar = ref(null);
const loadingSubmit = ref(false);
const validationErrors = ref({});

// Función para alternar visibilidad de la contraseña
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Ejecutar al montar el componente
onMounted(() => {
  setModal();
});

// Función para enviar el formulario
const submit = async () => {
  try {
    loadingSubmit.value = true;
    clearErrors();

    const response = await axiosInstance.post("/api/users", {
      rut: rut.value,
      nombre: nombre.value,
      email: email.value,
      apellido_paterno: apellido_paterno.value,
      apellido_materno: apellido_materno.value,
      contrasena_nueva: contrasena_nueva.value,
      contrasena_confirmar: contrasena_confirmar.value,
      estado: estado.value,
      roles: selectedRoles.value,
    });

    closeModal();

    $toast.success(response.data.message, {
      position: "top-right",
    });

    emit("listar-datos");
  } catch (error) {
    handleRequestError(error);
  } finally {
    loadingSubmit.value = false;
  }
};

// Función para obtener roles
const getRoles = async () => {
  try {
    const response = await axiosInstance.get("/api/roles");
    roles.value = response.data.data;
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
  getRoles();
  rut.value = "";
  nombre.value = "";
  email.value = "";
  apellido_paterno.value = "";
  apellido_materno.value = "";
  estado.value = 1;
  contrasena_nueva.value = "";
  contrasena_confirmar.value = "";
  selectedRoles.value = [];

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



// Observa cambios en la variable rut y aplica formato
watch(rut, (newValue) => {
  rut.value = formatRut(newValue);
});

// Función para formatear el RUT
const formatRut = (rut) => {
  rut = rut.replace(/[^\dKk]/g, "");

  // Limitar la longitud del RUT a 9 dígitos
  rut = rut.slice(0, 9);

  if (rut.length > 1) {
    const rutDigits = rut.slice(0, -1);
    const rutVerifier = rut.slice(-1).toUpperCase();

    return rutDigits + "-" + rutVerifier;
  } else if (rut.length === 1) {
    // Aplicar el formato específico xX si hay solo un dígito ingresado
    const rutVerifier = rut.slice(-1).toUpperCase();
    return rutVerifier;
  } else {
    return rut;
  }
};
</script>
