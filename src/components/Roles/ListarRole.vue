<template>
  <div>
    <div class="page-header d-print-none">
      <div class="container-fluid">
        <div class="row g-2 align-items-center">
          <div class="col"><!-- Page pre-title -->
            <div class="page-pretitle">Módulo</div>
            <h2 class="page-title">Roles</h2>
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
                <h3 class="card-title">Roles del Sistema</h3>
                <div class="card-actions">
                  <div class="btn-list">
                    <RegistrarRole v-if="$can('rol', 'create')" @listar-datos="fetchRoles()"></RegistrarRole>
                    <EditarRole v-if="$can('rol', 'edit')" @listar-datos="fetchRoles()" ref="editarRoleRef">
                    </EditarRole>
                  </div>
                </div>
              </div>
              <div v-if="loading" class="progress progress-sm">
                <div class="progress-bar progress-bar-indeterminate"></div>
              </div>

              <div class="table-responsive">
                <table class="table card-table text-nowrap table-hover">
                  <thead>
                    <tr>
                      <th class="w-100">Nombre</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-if="loading">
                      <td colspan="1" class="text-secondary text-center">
                        Cargando datos...
                      </td>
                    </tr>
                    <tr v-else-if="!listadoRoles.length">
                      <td colspan="1" class="text-secondary text-center">
                        No se encontraron registros
                      </td>
                    </tr>
                    <tr v-else v-for="(item, index) in listadoRoles" :key="index">
                      <td>
                        <span class="text-secondary">{{ item.nombre }}</span>
                      </td>
                      <td>
                        <a v-if="$can('rol', 'edit')" @click="openEditModal(item)" class="text-dark px-1 cursor-pointer"
                          aria-label="Button" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar">
                          <!-- SVG icon from http://tabler-icons.io/i/git-merge -->
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                            <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                            <path d="M16 5l3 3" />
                          </svg>
                        </a>

                        <a v-if="$can('rol', 'delete')" @click="eliminarRol(item.id)"
                          class="text-dark px-1 cursor-pointer" data-bs-toggle="tooltip" data-bs-placement="top"
                          title="Eliminar">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
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
import RegistrarRole from "@/components/Roles/RegistrarRole.vue";
import EditarRole from "@/components/Roles/EditarRole.vue";
import { axiosInstance } from '@/plugins/axios';
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

// Instancia Toast 
const $toast = useToast();

// Propiedades reactivas
const listadoRoles = ref([]);
const loading = ref(false);
const editarRoleRef = ref(null);
const validationErrors = ref({});

// Ejecutar al montar el componente
onMounted(() => {
  fetchRoles();
});

// Función para abrir el modal de edición
const openEditModal = (rol) => {
  if (editarRoleRef.value) {
    editarRoleRef.value.openModal(rol);
  }
};

// Función para obtener la lista de roles
const fetchRoles = async () => {
  try {
    loading.value = true;
    const response = await axiosInstance.get("/api/roles");
    listadoRoles.value = response.data.data;
  } catch (error) {
    handleError(error);
  } finally {
    loading.value = false;
  }
};

// Función para eliminar un rol
const eliminarRol = async (id) => {
  try {
    const result = await Swal.fire({
      title: "¿Estás seguro que desea eliminar el rol?",
      text: "¡Esta acción no podrá ser revertida!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#004693",
      confirmButtonText: "Sí, eliminar",
      cancelButtonColor: "#d63939",
      cancelButtonText: "No, cancelar",
    });
    if (result.isConfirmed) {
      await axiosInstance.delete(`/api/roles/${id}`);
      await Swal.fire({
        title: "Rol eliminado!",
        icon: "success",
        confirmButtonColor: "#004693",
        confirmButtonText: "Cerrar",
      });
      fetchRoles();
    }
  } catch (error) {
    handleRequestError(error);
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