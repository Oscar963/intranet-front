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
            <div class="row">
              <div class="col-12 col-md-12 d-flex flex-column">
                <div v-if="loadingSubmit" class="progress progress-sm">
                  <div class="progress-bar progress-bar-indeterminate"></div>
                </div>
                <form @submit.prevent="submit">
                  <div class="card-body">
                    <h2 class="mb-4">Mi Perfil</h2>
                    <div class="row g-3">
                      <div class="col-lg-6 col-md-6">
                        <div class="form-label">Rut</div>
                        <input v-model="user.rut" type="text" class="form-control" disabled />
                      </div>
                      <div class="col-lg-6 col-md-6">
                        <div class="form-label">Nombre</div>
                        <input v-model="user.nombre" class="form-control"
                          :class="{ 'is-invalid': validationErrors.nombre }" type="text"
                          placeholder="Ingrese tu nombre">
                        <div class="invalid-feedback" v-if="validationErrors.nombre">
                          {{ validationErrors.nombre[0] }}
                        </div>
                      </div>
                      <div class="col-lg-6 col-md-6">
                        <div class="form-label">Apellido Paterno</div>
                        <input v-model="user.apellido_paterno" class="form-control"
                          :class="{ 'is-invalid': validationErrors.apellido_paterno }" type="text"
                          placeholder="Ingrese tu apellido paterno">
                        <div class="invalid-feedback" v-if="validationErrors.apellido_paterno">
                          {{ validationErrors.apellido_paterno[0] }}
                        </div>
                      </div>
                      <div class="col-lg-6 col-md-6">
                        <div class="form-label">Apellido Materno</div>
                        <input v-model="user.apellido_materno" class="form-control"
                          :class="{ 'is-invalid': validationErrors.apellido_materno }" type="text"
                          placeholder="Ingrese tu apellido materno">
                        <div class="invalid-feedback" v-if="validationErrors.apellido_materno">
                          {{ validationErrors.apellido_materno[0] }}
                        </div>
                      </div>
                      <div class="col-lg-12 col-md-12">
                        <div class="form-label">Email</div>
                        <input v-model="user.email" class="form-control"
                          :class="{ 'is-invalid': validationErrors.email }" type="email"
                          placeholder="Ingrese tu apellido materno">
                        <div class="invalid-feedback" v-if="validationErrors.email">
                          {{ validationErrors.email[0] }}
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
import { useAuthStore } from '@/stores/auth';
import { axiosInstance } from '@/plugins/axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

// Instancias de toas y auth.
const authStore = useAuthStore();
const $toast = useToast();

// Propiedades reactivas
const loadingSubmit = ref(false);
const validationErrors = ref({});

const user = ref({
  rut: authStore.user.rut,
  nombre: authStore.user.nombre,
  apellido_paterno: authStore.user.apellido_paterno,
  apellido_materno: authStore.user.apellido_materno,
  email: authStore.user.email,
});

// Metodo Submit 
const submit = async () => {
  try {
    loadingSubmit.value = true;
    clearErrors();

    const response = await axiosInstance.put("/api/auth/actualizar-perfil", {
      nombre: user.value.nombre,
      apellido_paterno: user.value.apellido_paterno,
      apellido_materno: user.value.apellido_materno,
      email: user.value.email,
    });

    $toast.success(response.data.message, {
      position: "top-right",
    });
    const COOKIE_NAME_USER = import.meta.env.VITE_COOKIE_NAME_USER;
    sessionStorage.setItem(COOKIE_NAME_USER, JSON.stringify(response.data.data));
    authStore.user = response.data.data

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
