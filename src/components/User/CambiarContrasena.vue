<template>
  <div>
    <div class="page-wrapper">
      <!-- Page header -->
      <div class="page-header d-print-none">
        <div class="container-fluid">
          <div class="row g-2 align-items-center">
            <div class="col">
              <!-- Page pre-title -->
              <div class="page-pretitle">Módulo</div>
              <h2 class="page-title"> Configuración y perfil</h2>
            </div>
          </div>
        </div>
      </div>
      <!-- Page body -->
      <div class="page-body">
        <div class="container-fluid">
          <div class="card">
            <div class="row g-0">
              <div class="col-12 col-md-12 d-flex flex-column">
                <div v-if="loadingSubmit" class="progress progress-sm">
                  <div class="progress-bar progress-bar-indeterminate"></div>
                </div>
                <form @submit.prevent="submit()">
                  <div class="card-body">
                    <h2 class="mb-4">Cambiar contraseña</h2>
                    <div class="row g-3">
                      <div class="col-lg-12 col-md-12">
                        <div class="form-label">Contraseña Actual</div>
                        <div class="row g-2">
                          <div class="col">
                            <input :type="showPassword ? 'text' : 'password'" v-model="contrasena_actual"
                              class="form-control" :class="{ 'is-invalid': validationErrors.contrasena_actual }"
                              id="label-password">
                            <div class="invalid-feedback" v-if="validationErrors.contrasena_actual">
                              {{ validationErrors.contrasena_actual[0] }}
                            </div>
                          </div>
                          <div class="col-auto">
                            <a @click.prevent="toggleShowPassword" title="Mostrar contraseña" href="#"
                              class="btn btn-icon" aria-label="Button">
                              <!-- Download SVG icon from http://tabler-icons.io/i/search -->
                              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"
                                class="icon icon-tabler icons-tabler-outline icon-tabler-eye">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                <path
                                  d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                              </svg>
                              <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="icon icon-tabler icons-tabler-outline icon-tabler-eye-closed">
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
                      <div class="col-lg-6">
                        <label class="form-label">Contraseña</label>
                        <div class="row g-2">
                          <div class="col">
                            <input v-model="contrasena_nueva" :type="showPasswordConfirm ? 'text' : 'password'"
                              class="form-control" :class="{ 'is-invalid': validationErrors.contrasena_nueva }"
                              id="label-contrasena_nueva" autocomplete="off">
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
                            <input v-model="contrasena_confirmar" :type="showPasswordConfirm ? 'text' : 'password'"
                              class="form-control" :class="{ 'is-invalid': validationErrors.contrasena_confirmar }"
                              id="label-contrasena_confirmar" autocomplete="off">
                            <div class="invalid-feedback" v-if="validationErrors.contrasena_confirmar">
                              {{ validationErrors.contrasena_confirmar[0] }}
                            </div>
                          </div>
                          <div class="col-auto">
                            <a href="#" @click="toggleShowPasswordConfirm" class="btn btn-icon"
                              title="Mostrar contraseña" data-bs-toggle="tooltip">
                              <!-- Icono de ojo -->
                              <svg v-if="showPasswordConfirm" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"
                                class="icon icon-tabler icons-tabler-outline icon-tabler-eye">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                <path
                                  d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                              </svg>
                              <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="icon icon-tabler icons-tabler-outline icon-tabler-eye-closed">
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
                  </div>
                  <div class="card-footer bg-transparent mt-auto">
                    <div class="btn-list justify-content-end">
                      <button type="submit" class="btn btn-primary ms-auto" :disabled="loadingSubmit">
                        <span v-if="loadingSubmit" class="spinner-border spinner-border-sm me-2" role="status"></span>
                        <span v-if="loadingSubmit">Cargando..</span>
                        <span v-else><svg xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-device-floppy" width="24" height="24"
                            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
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
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { axiosInstance } from '@/plugins/axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

const loadingSubmit = ref(false);
const $toast = useToast();

const validationErrors = ref({});

const contrasena_actual = ref("");
const contrasena_nueva = ref("");
const contrasena_confirmar = ref("");

const showPassword = ref(false);
const showPasswordConfirm = ref(false);


const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleShowPasswordConfirm = () => {
  showPasswordConfirm.value = !showPasswordConfirm.value;
};


const submit = async () => {
  try {
    loadingSubmit.value = true;
    clearErrors();

    const response = await axiosInstance.post("/api/auth/cambiar-contrasena", {
      contrasena_actual: contrasena_actual.value,
      contrasena_nueva: contrasena_nueva.value,
      contrasena_confirmar: contrasena_confirmar.value,
    });

    $toast.success(response.data.message, {
      position: "top-right",
    });

  } catch (error) {
    handleRequestError(error);
  } finally {
    loadingSubmit.value = false;
  }
};
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
<style scoped></style>
