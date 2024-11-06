<template>
    <div class=" border-top-wide border-primary d-flex flex-column">
        <div class="page page-center">
            <div class="container-tight py-4">
                <div class="empty">
                    <div class="empty-img"><img src="/img/auth/error-404.svg" height="128" alt="">
                    </div>
                    <p class="empty-title">Lo sentimos pero no se encontró la página que buscas</p>
                    <div class="empty-action">
                        <router-link to="/admin/home" class="btn btn-primary">
                            <!-- Download SVG icon from http://tabler-icons.io/i/arrow-left -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
                                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M5 12l14 0" />
                                <path d="M5 12l6 6" />
                                <path d="M5 12l6 -6" />
                            </svg>
                            Volver al inicio
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
