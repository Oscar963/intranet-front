<template>
    <div class="container-xl">
        <div id="carousel-banners" class="carousel slide" data-bs-ride="carousel">
            <!-- Indicadores del carrusel -->
            <div class="carousel-indicators">
                <button v-for="(banner, index) in listadoBanners" :key="index" :class="{ active: index === 0 }"
                    :data-bs-target="'#carousel-banners'" :data-bs-slide-to="index"
                    :aria-label="'Slide ' + (index + 1)"></button>
            </div>

            <!-- Elementos del carrusel -->
            <div class="carousel-inner">
                <div v-for="(banner, index) in listadoBanners" :key="index"
                    :class="['carousel-item', { active: index === 0 }]">
                    <a :href="banner.url ? banner.url : '#'">
                        <img class="d-block w-100" :src="getImageUrl(banner.imagen)" :alt="banner.titulo" />
                    </a>
                </div>
            </div>

            <!-- Controles del carrusel -->
            <a class="carousel-control-prev" href="#carousel-banners" role="button" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carousel-banners" role="button" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </a>
        </div>
        <div class="container-xl">
            <div class="row mt-4">
                <div class="col-6 col-md-3">
                    <a href="http://127.0.0.1:8080/vistas/37">
                        <img class="w-100 rounded-3" src="/img/app/encasillamiento.png" alt="Escalafon">
                    </a>
                </div>
                <div class="col-6 col-md-3 ">
                    <a href="http://127.0.0.1:8080/vistas/38">
                        <img class="w-100 rounded-3" src="/img/app/recursos.png" alt="RRHH">
                    </a>
                </div>
                <div class="col-6 col-md-3 ">
                    <a href="http://127.0.0.1:8080/vistas/52">
                        <img class="w-100 rounded-3" src="/img/app/reglamentos.png" alt="Regla">
                    </a>
                </div>
                <div class="col-6 col-md-3 ">
                    <a href="http://127.0.0.1:8080/vistas/53">
                        <img class="w-100 rounded-3" src="/img/app/solicitudes.png" alt="Soli">
                    </a>
                </div>
            </div>
            <div class="row mt-4">
                <div class="hr-text h2 text-primary fw-bold">Secciones</div>
                <div class="col-6 col-md-2 py-2">
                    <a href="http://127.0.0.1:8080/vistas/39" class="btn btn-primary rounded-3 d-flex">
                        <div class="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="icon icon-tabler icons-tabler-outline icon-tabler-user-cog">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                <path d="M6 21v-2a4 4 0 0 1 4 -4h2.5" />
                                <path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                                <path d="M19.001 15.5v1.5" />
                                <path d="M19.001 21v1.5" />
                                <path d="M22.032 17.25l-1.299 .75" />
                                <path d="M17.27 20l-1.3 .75" />
                                <path d="M15.97 17.25l1.3 .75" />
                                <path d="M20.733 20l1.3 .75" />
                            </svg>
                            <div class="fs-2 pt-3 text-wrap">Administración</div>
                        </div>
                    </a>
                </div>
                <div class="col-6 col-md-2 py-2">
                    <a href="http://127.0.0.1:8080/vistas/40" class="btn btn-primary rounded-3 d-flex">
                        <div class="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="icon icon-tabler icons-tabler-outline icon-tabler-checklist">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M9.615 20h-2.615a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8"></path>
                                <path d="M14 19l2 2l4 -4"></path>
                                <path d="M9 8h4"></path>
                                <path d="M9 12h2"></path>
                            </svg>
                            <div class="fs-2 pt-3 text-wrap">SecPlan</div>
                        </div>
                    </a>
                </div>
                <div class="col-6 col-md-2 py-2">
                    <a href="http://127.0.0.1:8080/vistas/55" class="btn btn-primary rounded-3 d-flex">
                        <div class="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="icon icon-tabler icons-tabler-outline icon-tabler-seeding">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M12 10a6 6 0 0 0 -6 -6h-3v2a6 6 0 0 0 6 6h3"></path>
                                <path d="M12 14a6 6 0 0 1 6 -6h3v1a6 6 0 0 1 -6 6h-3"></path>
                                <path d="M12 20l0 -10"></path>
                            </svg>
                            <div class="fs-2 pt-3 text-wrap">DIDECO</div>
                        </div>
                    </a>
                </div>
                <div class="col-6 col-md-2 py-2">
                    <a href="http://127.0.0.1:8080/vistas/36" class="btn btn-primary rounded-3 d-flex">
                        <div class="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="icon icon-tabler icons-tabler-outline icon-tabler-info-square-rounded">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M12 9h.01"></path>
                                <path d="M11 12h1v4h1"></path>
                                <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
                            </svg>
                            <div class="fs-2 pt-3 text-wrap">OIRS</div>
                        </div>
                    </a>
                </div>
                <div class="col-6 col-md-2 py-2">
                    <a href="http://127.0.0.1:8080/vistas/41" class="btn btn-primary rounded-3 d-flex">
                        <div class="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="icon icon-tabler icons-tabler-outline icon-tabler-businessplan">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M16 6m-5 0a5 3 0 1 0 10 0a5 3 0 1 0 -10 0"></path>
                                <path d="M11 6v4c0 1.657 2.239 3 5 3s5 -1.343 5 -3v-4"></path>
                                <path d="M11 10v4c0 1.657 2.239 3 5 3s5 -1.343 5 -3v-4"></path>
                                <path d="M11 14v4c0 1.657 2.239 3 5 3s5 -1.343 5 -3v-4"></path>
                                <path d="M7 9h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5"></path>
                                <path d="M5 15v1m0 -8v1"></path>
                            </svg>
                            <div class="fs-2 pt-3 text-wrap">Contabilidad y <br>Presupuesto</div>
                        </div>
                    </a>
                </div>
                <div class="col-6 col-md-2 py-2">
                    <a href="http://127.0.0.1:8080/vistas/42" class="btn btn-primary rounded-3 d-flex">
                        <div class="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-coin">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                                <path
                                    d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1">
                                </path>
                                <path d="M12 7v10"></path>
                            </svg>
                            <div class="fs-2 pt-3 text-wrap">Remuneraciones</div>
                        </div>
                    </a>
                </div>
                <div class="col-6 col-md-2 py-2">
                    <a href="http://127.0.0.1:8080/vistas/43" class="btn btn-primary rounded-3 d-flex">
                        <div class="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="icon icon-tabler icons-tabler-outline icon-tabler-brand-shopee">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path
                                    d="M4 7l.867 12.143a2 2 0 0 0 2 1.857h10.276a2 2 0 0 0 2 -1.857l.867 -12.143h-16z">
                                </path>
                                <path d="M8.5 7c0 -1.653 1.5 -4 3.5 -4s3.5 2.347 3.5 4"></path>
                                <path
                                    d="M9.5 17c.413 .462 1 1 2.5 1s2.5 -.897 2.5 -2s-1 -1.5 -2.5 -2s-2 -1.47 -2 -2c0 -1.104 1 -2 2 -2s1.5 0 2.5 1">
                                </path>
                            </svg>
                            <div class="fs-2 pt-3 text-wrap">Compras Públicas</div>
                        </div>
                    </a>
                </div>
                <div class="col-6 col-md-2 py-2">
                    <a href="http://127.0.0.1:8080/vistas/44" class="btn btn-primary rounded-3 d-flex">
                        <div class="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-gavel">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path
                                    d="M13 10l7.383 7.418c.823 .82 .823 2.148 0 2.967a2.11 2.11 0 0 1 -2.976 0l-7.407 -7.385">
                                </path>
                                <path d="M6 9l4 4"></path>
                                <path d="M13 10l-4 -4"></path>
                                <path d="M3 21h7"></path>
                                <path
                                    d="M6.793 15.793l-3.586 -3.586a1 1 0 0 1 0 -1.414l2.293 -2.293l.5 .5l3 -3l-.5 -.5l2.293 -2.293a1 1 0 0 1 1.414 0l3.586 3.586a1 1 0 0 1 0 1.414l-2.293 2.293l-.5 -.5l-3 3l.5 .5l-2.293 2.293a1 1 0 0 1 -1.414 0z">
                                </path>
                            </svg>
                            <div class="fs-2 pt-3 text-wrap">Asesoría Jurídica</div>
                        </div>
                    </a>
                </div>
                <div class="col-6 col-md-2 py-2">
                    <a href="http://127.0.0.1:8080/vistas/45" class="btn btn-primary rounded-3 d-flex">
                        <div class="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="icon icon-tabler icons-tabler-outline icon-tabler-shield-check">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path
                                    d="M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06">
                                </path>
                                <path d="M15 19l2 2l4 -4"></path>
                            </svg>
                            <div class="fs-2 pt-3 text-wrap">Fiscalía Administrativa</div>
                        </div>
                    </a>
                </div>
                <div class="col-6 col-md-2 py-2">
                    <a href="http://127.0.0.1:8080/vistas/54" class="btn btn-primary rounded-3 d-flex">
                        <div class="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="icon icon-tabler icons-tabler-outline icon-tabler-friends">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M7 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                <path d="M5 22v-5l-1 -1v-4a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4l-1 1v5"></path>
                                <path d="M17 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                <path d="M15 22v-4h-2l2 -6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1l2 6h-2v4"></path>
                            </svg>
                            <div class="fs-2 pt-3 text-wrap">Bienestar</div>
                        </div>
                    </a>
                </div>
                <div class="col-6 col-md-2 py-2">
                    <a href="http://127.0.0.1:8080/vistas/46" class="btn btn-primary rounded-3 d-flex">
                        <div class="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="icon icon-tabler icons-tabler-outline icon-tabler-devices-pc">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M3 5h6v14h-6z"></path>
                                <path d="M12 9h10v7h-10z"></path>
                                <path d="M14 19h6"></path>
                                <path d="M17 16v3"></path>
                                <path d="M6 13v.01"></path>
                                <path d="M6 16v.01"></path>
                            </svg>
                            <div class="fs-2 pt-3 text-wrap">Dirección Innovación y
                                <br>Desarollo Institucional
                            </div>
                        </div>
                    </a>
                </div>
                <div class="col-6 col-md-2 py-2">
                    <a href="http://127.0.0.1:8080/vistas/47" class="btn btn-primary rounded-3 d-flex">
                        <div class="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="icon icon-tabler icons-tabler-outline icon-tabler-database">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M12 6m-8 0a8 3 0 1 0 16 0a8 3 0 1 0 -16 0"></path>
                                <path d="M4 6v6a8 3 0 0 0 16 0v-6"></path>
                                <path d="M4 12v6a8 3 0 0 0 16 0v-6"></path>
                            </svg>
                            <div class="fs-2 pt-3 text-wrap">Protección Datos <br>Personales</div>
                        </div>
                    </a>
                </div>
                <div class="col-6 col-md-2 py-2">
                    <a href="http://127.0.0.1:8080/vistas/35" class="btn btn-primary rounded-3 d-flex">
                        <div class="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="icon icon-tabler icons-tabler-outline icon-tabler-building-estate">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M3 21h18"></path>
                                <path d="M19 21v-4"></path>
                                <path d="M19 17a2 2 0 0 0 2 -2v-2a2 2 0 1 0 -4 0v2a2 2 0 0 0 2 2z"></path>
                                <path d="M14 21v-14a3 3 0 0 0 -3 -3h-4a3 3 0 0 0 -3 3v14"></path>
                                <path d="M9 17v4"></path>
                                <path d="M8 13h2"></path>
                                <path d="M8 9h2"></path>
                            </svg>
                            <div class="fs-2 pt-3 text-wrap">Oficina de Bienes <br>Inventario</div>
                        </div>
                    </a>
                </div>
            </div>
            <div class="hr-text h2 text-primary fw-bold">Enlaces Relevantes</div>
            <div class="row mt-4 text-center">
                <div class="col-4">
                    <a href="http://127.0.0.1:8080/vistas/48">
                        <img class="img-fluid img-footer" src="/img/app/DIP.png" alt="DIP">
                    </a>
                </div>
                <div class="col-4">
                    <a href="http://127.0.0.1:8080/vistas/48">
                        <img class="img-fluid img-footer" src="/img/app/transformacion.png" alt="DIP">
                    </a>
                </div>
                <div class="col-4">
                    <a href="http://127.0.0.1:8080/vistas/48">
                        <img class="img-fluid img-footer" src="/img/app/ley.png" alt="DIP">
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { axiosInstance } from '@/plugins/axios';

const listadoBanners = ref([]);
onMounted(() => {
    listarDatos();
});

const listarDatos = async () => {
    try {
        const response = await axiosInstance.get("/api/listar-banners");
        listadoBanners.value = response.data;
    } catch (error) {
        console.log(error);
    }
};

const getImageUrl = (imagePath) => {
    return `${import.meta.env.VITE_APP_API_BASE_URL}${imagePath}`;
};
</script>


<style scoped>
.btn {
    min-height: 200px;
}
</style>