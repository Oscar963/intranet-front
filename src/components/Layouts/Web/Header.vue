<template>
    <!-- Desktop -->
    <header
        class="navbar navbar-expand-md d-print-none sticky-top bg-primary shadow-none d-none d-md-block d-lg-block d-xl-block">
        <div class="container-xl">
            <div class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
                <router-link to="/">
                    <img src="/img/logos/logo.png" alt="logo-muniarica" class="mx-auto d-block img-logo-desktop" />
                </router-link>
            </div>
            <button class="navbar-toggler text-white" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse mt-2 mb-3 rounded" id="navbarSupportedContent">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link text-white" target="_blank" href="http://127.0.0.1:8080/vistas/56">
                            <span
                                class="nav-link-icon text-white"><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="icon">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M5 12l-2 0l9 -9l9 9l-2 0"></path>
                                    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path>
                                    <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path>
                                </svg>
                            </span>
                            <span class="nav-link-title">
                                Contáctanos
                            </span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-white" target="_blank" href="https://intranet.imaarica.cl/anexos">
                            <span
                                class="nav-link-icon text-white"><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="icon">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M5 12l-2 0l9 -9l9 9l-2 0"></path>
                                    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path>
                                    <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path>
                                </svg>
                            </span>
                            <span class="nav-link-title">
                                Anexos Municipales
                            </span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-white" target="_blank" href="https://intranet.imaarica.cl/anexos">
                            <span
                                class="nav-link-icon text-white"><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="icon">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M5 12l-2 0l9 -9l9 9l-2 0"></path>
                                    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path>
                                    <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path>
                                </svg>
                            </span>
                            <span class="nav-link-title">
                                Celulares Municipales
                            </span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="btn btn-warning" target="_blank"
                            href="https://intranetarica.smc.cl/login.aspx?ReturnUrl=%2f">
                            <span
                                class="nav-link-icon d-md-none d-lg-inline-block text-white "><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="icon">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M5 12l-2 0l9 -9l9 9l-2 0"></path>
                                    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path>
                                    <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path>
                                </svg>
                            </span>
                            <span class="nav-link-title ">
                                Sistema de RRHH
                            </span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </header>

    <!-- Movile -->
    <header
        class="navbar navbar-expand-md d-print-none sticky-top bg-primary shadow-none d-block d-md-none d-lg-none d-xl-none">
        <div class="container-fluid">
            <div class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
                <router-link to="/">
                    <img src="/img/logos/logo.png" alt="logo-muniarica" class="mx-auto d-block img-logo-movile" />
                </router-link>
            </div>
            <button class="navbar-toggler text-white" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse mt-2 mb-3 rounded" id="navbarSupportedContent">
                <ul class="navbar-nav w-100">
                    <li class="nav-item">
                        <a class="nav-link text-white" target="_blank" href="http://127.0.0.1:8080/vistas/56">
                            <span
                                class="nav-link-icon text-white"><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="icon">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M5 12l-2 0l9 -9l9 9l-2 0"></path>
                                    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path>
                                    <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path>
                                </svg>
                            </span>
                            <span class="nav-link-title">
                                Contáctanos
                            </span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-white" target="_blank" href="https://intranet.imaarica.cl/anexos">
                            <span
                                class="nav-link-icon text-white"><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="icon">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M5 12l-2 0l9 -9l9 9l-2 0"></path>
                                    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path>
                                    <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path>
                                </svg>
                            </span>
                            <span class="nav-link-title">
                                Anexos Municipales
                            </span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-white" target="_blank" href="https://intranet.imaarica.cl/anexos">
                            <span
                                class="nav-link-icon text-white"><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="icon">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M5 12l-2 0l9 -9l9 9l-2 0"></path>
                                    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path>
                                    <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path>
                                </svg>
                            </span>
                            <span class="nav-link-title">
                                Celulares Municipales
                            </span>
                        </a>
                    </li>
                    <li class="nav-item pt-3">
                        <a class="btn btn-warning" target="_blank"
                            href="https://intranetarica.smc.cl/login.aspx?ReturnUrl=%2f">
                            <span
                                class="nav-link-icon d-md-none d-lg-inline-block text-white "><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="icon">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M5 12l-2 0l9 -9l9 9l-2 0"></path>
                                    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path>
                                    <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path>
                                </svg>
                            </span>
                            <span class="nav-link-title ">
                                Sistema de RRHH
                            </span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </header>

</template>
<style scoped>
.img-logo-desktop {
    max-width: 255px;
    height: auto;
}

.img-logo-movile {
    max-width: 276px;
    height: auto;
}
</style>