<template>
  <div>
    <div class="page-header d-print-none">
      <div class="container-fluid">
        <div class="row g-2 align-items-center">
          <div class="col"><!-- Page pre-title -->
            <div class="page-pretitle">Módulo</div>
            <h2 class="page-title">Banners</h2>
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
                <h3 class="card-title">Banners registrados</h3>
                <div class="card-actions">
                  <div class="btn-list">
                    <RegistrarBanner v-if="$can('banner', 'create')" @listar-datos="listarDatos()"></RegistrarBanner>
                    <EditarBanner v-if="$can('banner', 'edit')" @listar-datos="listarDatos()" ref="editarBannerRef">
                    </EditarBanner>
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
                      <th class="w-25">Imagen</th>
                      <th>Título</th>
                      <th>Estado</th>
                      <th>Fecha Registro</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody class="align-middle">
                    <tr v-if="loading">
                      <td colspan="5" class="text-secondary text-center">
                        Cargando datos...
                      </td>
                    </tr>
                    <tr v-else-if="!listadoBanners.length">
                      <td colspan="5" class="text-secondary text-center">
                        No se encontraron registros
                      </td>
                    </tr>
                    <tr v-else v-for="(item, index) in listadoBanners" :key="index">
                      <td>
                        <img class="w-25" :src="getImageUrl(item.imagen)" alt="">
                      </td>
                      <td>
                        <span class="text-secondary">{{ item.titulo }}</span>
                      </td>
                      <td>
                        <span class="text-secondary">{{ item.estado }}</span>
                      </td>
                      <td>
                        <span class="text-secondary">{{ item.fecha }}</span>
                      </td>
                      <td>
                        <a v-if="$can('page', 'edit')" @click="openEditModal(item)" class="text-dark px-1 cursor-pointer"
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

                        <a v-if="$can('page', 'delete')" @click="eliminarBanner(item)"
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
import RegistrarBanner from "@/components/Banner/RegistrarBanner.vue";
import EditarBanner from "@/components/Banner/EditarBanner.vue";
import { ref, onMounted } from "vue";
import { axiosInstance } from '@/plugins/axios';
import Swal from "sweetalert2";

const listadoBanners = ref([]);
const loading = ref(false);
const editarBannerRef = ref(null);

onMounted(() => {
  listarDatos();
});

const listarDatos = async () => {
  try {
    loading.value = true;
    const response = await axiosInstance.get("/api/banners");
    listadoBanners.value = response.data;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
const openEditModal = (banner) => {
  if (editarBannerRef.value) {
    editarBannerRef.value.openModal(banner);
  }
};

const getImageUrl = (imagePath) => {
  return `${import.meta.env.VITE_APP_API_BASE_URL}${imagePath}`;
};

const eliminarBanner = async (banner) => {
  try {
    const result = await Swal.fire({
      title: "¿Estás seguro que desea eliminar el banner?",
      text: "¡Esta acción no podrá ser revertida!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#004693",
      confirmButtonText: "Sí, eliminar",
      cancelButtonColor: "#d63939",
      cancelButtonText: "No, cancelar",
    });
    if (result.isConfirmed) {
      await Swal.fire({
        title: "Banner eliminado!",
        icon: "success",
        confirmButtonColor: "#004693",
        confirmButtonText: "Cerrar",
      });
      await axiosInstance.delete("/api/banners/" + banner.id);
      listarDatos();
    }
  } catch (error) {
    console.log(error);
  }
};
</script>
