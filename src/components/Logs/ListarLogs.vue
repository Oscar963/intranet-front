<template>
  <div>
    <div class="page-header d-print-none">
      <div class="container-fluid">
        <div class="row g-2 align-items-center">
          <div class="col"><!-- Page pre-title -->
            <div class="page-pretitle">Módulo</div>
            <h2 class="page-title">Logs</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="page-body">
      <div class="container-fluid">
        <div class="row row-deck row-cards">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Listado Logs del Sistema</h3>
              </div>
              <div v-if="loading" class="progress progress-sm">
                <div class="progress-bar progress-bar-indeterminate"></div>
              </div>

              <div class="table-responsive">
                <table class="table card-table text-nowrap table-hover">
                  <thead>
                    <tr>
                      <th>Fecha/Hora</th>
                      <th>Usuario</th>
                      <th>Acción</th>
                      <th>Detalle</th>
                      <th>IP</th>
                      <th>Localización</th>
                      <th>Navegador</th>
                      <th>Sistema Operativo</th>
                      <th>Referencia</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-if="loading">
                      <td colspan="9" class="text-secondary text-center">
                        Cargando datos...
                      </td>
                    </tr>
                    <tr v-else-if="!listadoLogs.length">
                      <td colspan="9" class="text-secondary text-center">
                        No se encontraron registros
                      </td>
                    </tr>
                    <tr v-else v-for="(item, index) in listadoLogs" :key="index">
                      <td>
                        <span class="text-secondary">{{ formatDate(item.created_at) }} {{ formatHours(item.created_at)
                          }}</span>
                      </td>
                      <td>
                        <span class="text-secondary">{{ item.user.nombre }} {{ item.user.apellido_paterno
                          }}</span>
                      </td>
                      <td>
                        <span class="text-secondary">{{ item.action }}</span>
                      </td>
                      <td>
                        <span class="text-secondary">{{ item.details }}</span>
                      </td>
                      <td>
                        <span class="text-secondary">{{ item.ip_address }}</span>
                      </td>
                      <td>
                        <span class="text-secondary">{{ item.geolocation }}</span>
                      </td>
                      <td>
                        <span class="text-secondary">{{ item.browser }}</span>
                      </td>
                      <td>
                        <span class="text-secondary">{{ item.os }}</span>
                      </td>
                      <td>
                        <span class="text-secondary">{{ item.referer }}</span>
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
import { axiosInstance } from '@/plugins/axios';
import { ref, onMounted } from "vue";
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import moment from "moment";

// Instancia Toast 
const $toast = useToast();

// Propiedades reactivas
const listadoLogs = ref([]);
const loading = ref(false);
const validationErrors = ref({});

// Ejecutar al montar el componente
onMounted(() => {
  fetchLogs();
});

// Formato de Hora
const formatHours = (date) => moment(date).format("HH:mm:ss");
const formatDate = (date) => moment(date).format("DD-MM-YYYY");

// Función para obtener la lista de logs
const fetchLogs = async () => {
  try {
    loading.value = true;
    const response = await axiosInstance.get("/api/logs");
    listadoLogs.value = response.data.data;
  } catch (error) {
    handleRequestError(error);
  } finally {
    loading.value = false;
  }
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

</script>