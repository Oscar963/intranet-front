<template>
    <div>
        <div class="popup-header d-print-none">
            <div class="container-fluid">
                <div class="row g-2 align-items-center">
                    <div class="col"><!-- Page pre-title -->
                        <div class="popup-pretitle">Módulo</div>
                        <h2 class="popup-title">Popups</h2>
                    </div>
                </div>
            </div>
        </div>
        <div class="popup-body">
            <div class="container-fluid">
                <div class="row row-deck row-cards">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Popups registrados</h3>
                                <div class="card-actions">
                                    <div class="btn-list">
                                        <router-link v-if="$can('popup', 'create')"
                                            class="btn btn-primary d-none d-sm-inline-block"
                                            :to="{ name: 'PopupStore' }">
                                            <!-- Download SVG icon from http://tabler-icons.io/i/plus -->
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
                                                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                                stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <path d="M12 5l0 14"></path>
                                                <path d="M5 12l14 0"></path>
                                            </svg>
                                            Registrar Popup
                                        </router-link>
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
                                            <th class="w-25"></th>
                                            <th>Nombre</th>
                                            <th>Estado</th>
                                            <th>Fecha Expiración</th>
                                            <th>Fecha Publicación</th>
                                            <th>Subido por</th>
                                            <th>Actualizado por</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody class="align-middle">
                                        <tr v-if="loading">
                                            <td colspan="8" class="text-secondary text-center">
                                                Cargando datos...
                                            </td>
                                        </tr>
                                        <tr v-else-if="!listadoPopups.length">
                                            <td colspan="8" class="text-secondary text-center">
                                                No se encontraron registros
                                            </td>
                                        </tr>
                                        <tr v-else v-for="(item, index) in listadoPopups" :key="index">
                                            <td>
                                                <img class="w-25 rounded" :src="item.image" alt="">
                                            </td>
                                            <td>
                                                <span class="text-secondary">{{ item.title }}</span>
                                            </td>
                                            <td>
                                                <span v-if="item.status === 'published'"
                                                    class="badge badge-outline text-lime">publicado</span>
                                                <span v-if="item.status === 'hidden'"
                                                    class="badge badge-outline text-indigo">oculto</span>
                                            </td>
                                            <td>
                                                <span class="text-secondary">{{ item.date_expiration }}</span>
                                            </td>
                                            <td>
                                                <span class="text-secondary">{{ item.date }}</span>
                                            </td>
                                            <td>
                                                <span class="text-secondary"><svg xmlns="http://www.w3.org/2000/svg"
                                                        width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        class="icon icon-tabler icons-tabler-outline icon-tabler-user">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                                    </svg>
                                                    {{ item.created_by.name }} {{
                                                        item.created_by.apellido_paterno }} {{
                                                        item.created_by.apellido_materno }}</span>
                                            </td>
                                            <td>
                                                <span v-if="item.updated_by != null" class="text-secondary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                        class="icon icon-tabler icons-tabler-outline icon-tabler-user">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                                    </svg>
                                                    {{ item.updated_by.name }} {{
                                                        item.updated_by.apellido_paterno }} {{
                                                        item.updated_by.apellido_materno }}</span>
                                                <span v-else class="text-secondary">-</span>
                                            </td>
                                            <td>
                                                <router-link v-if="$can('popup', 'edit')"
                                                    class="text-dark px-1 cursor-pointer" aria-label="Button"
                                                    data-bs-toggle="tooltip" data-bs-placement="top" title="Editar"
                                                    :to="{ name: 'PopupUpdate', params: { id: item.id } }">
                                                    <!-- Download SVG icon from http://tabler-icons.io/i/plus -->
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                        class="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path
                                                            d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                        <path
                                                            d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                        <path d="M16 5l3 3" />
                                                    </svg>
                                                </router-link>
                                                <a v-if="$can('popup', 'delete')" @click="deletePopups(item)"
                                                    class="text-dark px-1 cursor-pointer" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" title="Eliminar">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
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
import { ref, onMounted } from "vue";
import { axiosInstance } from '@/plugins/axios';
import Swal from "sweetalert2";

const listadoPopups = ref([]);
const loading = ref(false);

onMounted(() => {
    listarDatos();
});

const listarDatos = async () => {
    loading.value = true;
    try {
        const response = await axiosInstance.get("/api/popups");
        console.log(response);
        
        listadoPopups.value = response.data.data;
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};


const deletePopups = async (popup) => {
    try {
        const result = await Swal.fire({
            title: "¿Estás seguro que desea eliminar el popup?",
            text: "¡Esta acción no podrá ser revertida!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#004693",
            confirmButtonText: "Sí, eliminar",
            cancelButtonColor: "#d63939",
            cancelButtonText: "No, cancelar",
        });

        if (result.isConfirmed) {
            const loadingSwal = Swal.fire({
                title: 'Procesando...',
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                },
                text: 'Eliminando el popup, por favor espera...',
                allowOutsideClick: false,
            });

            // Llamar a la API para eliminar la popup
            await axiosInstance.delete("/api/popups/" + popup.id);

            // Cerrar el Swal de carga
            loadingSwal.close();

            // Mostrar mensaje de éxito
            await Swal.fire({
                title: "Popup eliminado!",
                icon: "success",
                confirmButtonColor: "#004693",
                confirmButtonText: "Cerrar",
            });

            await listarDatos();
        }
    } catch (error) {
        console.log(error);
        // Manejo de errores
        Swal.fire({
            title: "Error",
            text: "Ocurrió un error al eliminar la popup.",
            icon: "error",
            confirmButtonColor: "#004693",
            confirmButtonText: "Cerrar",
        });
    }
};
</script>