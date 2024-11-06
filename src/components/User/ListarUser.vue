<template>
  <div>
    <div class="page-header d-print-none">
      <div class="container-fluid">
        <div class="row g-2 align-items-center">
          <div class="col">
            <!-- Page pre-title -->
            <div class="page-pretitle">Módulo</div>
            <h2 class="page-title">Usuarios</h2>
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
                <h3 class="card-title">Listado Usuarios</h3>
                <div class="card-actions">
                  <div class="btn-list">
                    <RegistrarUser v-if="$can('users', 'create')" @listar-datos="fetchUsers()"></RegistrarUser>
                    <EditarUser v-if="$can('users', 'edit')" @listar-datos="fetchUsers()" ref="editarUserRef">
                    </EditarUser>
                    <RestablecerContrasena v-if="$can('users', 'edit')" @listar-datos="fetchUsers()"
                      ref="restablecerUserRef">
                    </RestablecerContrasena>
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
                      <th>Rut</th>
                      <th>Nombre</th>
                      <th>Apellido Paterno</th>
                      <th>Apellido Materno</th>
                      <th>Correo electrónico</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="loading">
                      <td colspan="8" class="text-secondary text-center">
                        Cargando datos...
                      </td>
                    </tr>
                    <tr v-else-if="!listadoUsers.length">
                      <td colspan="8" class="text-secondary text-center">
                        No se encontraron registros
                      </td>
                    </tr>
                    <tr v-else v-for="(item, index) in listadoUsers" :key="index">
                      <td>
                        <span class="text-secondary">{{ item.rut }}</span>
                      </td>
                      <td>
                        <span class="text-secondary">{{ item.nombre }}</span>
                      </td>
                      <td>
                        <span class="text-secondary">{{ item.apellido_paterno }}</span>
                      </td>
                      <td>
                        <span class="text-secondary">{{ item.apellido_materno }}</span>
                      </td>
                      <td>
                        <span class="text-secondary">{{ item.email }}</span>
                      </td>
                      <td v-if="item.roles.length">
                        <span v-for="(item, index) in item.roles" :key="index">
                          <span class="badge bg-blue text-white">{{ item.nombre }}</span>&nbsp;
                        </span>
                      </td>
                      <td v-else>
                        <span class="text-secondary">No tiene roles asignados.</span>
                      </td>
                      <td>
                        <span v-if="item.estado === 1" class="text-secondary">
                          <span class="status status-green">
                            <span class="status-dot status-dot-animated"></span>
                            Activo
                          </span>
                        </span>

                        <span v-if="item.estado === 0">
                          <span class="status status-secondary">
                            <span class="status-dot status-dot-animated"></span>
                            Suspendido
                          </span>
                        </span>
                      </td>
                      <td>
                        <a v-if="$can('users', 'edit')" @click="openRestablecerModal(item)"
                          class="text-dark px-1 cursor-pointer" aria-label="Button" data-bs-toggle="tooltip"
                          data-bs-placement="top" title="Restablecer Contraseña">
                          <!-- SVG icon from http://tabler-icons.io/i/git-merge -->
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="icon icon-tabler icons-tabler-outline icon-tabler-key">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path
                              d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0z" />
                            <path d="M15 9h.01" />
                          </svg>
                        </a>

                        <a v-if="$can('users', 'edit')" @click="openEditModal(item)"
                          class="text-dark px-1 cursor-pointer" aria-label="Button" data-bs-toggle="tooltip"
                          data-bs-placement="top" title="Editar">
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

                        <a v-if="$can('users', 'delete')" @click="eliminarUsuario(item)"
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
import RegistrarUser from "@/components/User/RegistrarUser.vue";
import EditarUser from "@/components/User/EditarUser.vue";
import RestablecerContrasena from "@/components/User/RestablecerContrasena.vue";
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { axiosInstance } from '@/plugins/axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

// Variables reactivas
const listadoUsers = ref([]);
const loading = ref(false);
const editarUserRef = ref(null);
const restablecerUserRef = ref(null);
const validationErrors = ref({});
const $toast = useToast();

// Ejecutar al montar el componente
onMounted(() => {
  fetchUsers();
});

// Función para obtener la lista de usuarios
const fetchUsers = async () => {
  try {
    loading.value = true;
    const response = await axiosInstance.get("/api/users");
    const { data } = response.data;
    listadoUsers.value = data;
  } catch (error) {
    handleError(error);
  } finally {
    loading.value = false;
  }
};

// Función para eliminar un usuario
const eliminarUsuario = async (user) => {
  try {
    const result = await Swal.fire({
      title: "¿Estás seguro que desea eliminar el usuario?",
      text: "¡Esta acción no podrá ser revertida!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#004693",
      confirmButtonText: "Sí, eliminar",
      cancelButtonColor: "#d63939",
      cancelButtonText: "No, cancelar",
    });
    if (result.isConfirmed) {
      await axiosInstance.delete(`/api/users/${user.id}`);
      await Swal.fire({
        title: "Usuario eliminado!",
        icon: "success",
        confirmButtonColor: "#004693",
        confirmButtonText: "Cerrar",
      });
      fetchUsers();
    }
  } catch (err) {
    handleRequestError(err);
  }
};

// Función para abrir el modal de edición
const openEditModal = (user) => {
  if (editarUserRef.value) {
    editarUserRef.value.openModal(user);
  }
};

// Función para abrir el modal de restablecer
const openRestablecerModal = (user) => {
  if (restablecerUserRef.value) {
    restablecerUserRef.value.openModal(user);
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