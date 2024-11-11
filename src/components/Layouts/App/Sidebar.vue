<template>
  <aside class="navbar navbar-vertical navbar-expand-lg navbar-white mt-6 pt-4 d-none d-sm-none d-md-none d-lg-block">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#sidebar-menu"
        aria-controls="sidebar-menu" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="sidebar-menu">
        <ul class="navbar-nav pt-lg-3">
          <h6 class="ms-3 dropdown-header mb-1">Menú principal</h6>
          <router-link class="nav-item" to="/admin/home" class-active="active">
            <a class="nav-link" href="./">
              <span
                class="nav-link-icon d-md-none d-lg-inline-block"><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24"
                  stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                  <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                  <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                </svg>
              </span>
              <span class="nav-link-title"> Inicio </span>
            </a>
          </router-link>
          <router-link v-if="$can('vehiculo', 'list')" class="nav-item" :to="{ name: 'IngresoSalida' }"
            class-active="active">
            <a class="nav-link" href="#">
              <span
                class="nav-link-icon d-md-none d-lg-inline-block"><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-car">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                  <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                  <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
                </svg>
              </span>
              <span class="nav-link-title"> Registrar Entrada/Salida </span>
            </a>
          </router-link>
          <router-link v-if="$can('pago', 'list')" class="nav-item" :to="{ name: 'Pago' }" class-active="active">
            <a class="nav-link" href="#">
              <span
                class="nav-link-icon d-md-none d-lg-inline-block"><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-ticket">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M15 5l0 2" />
                  <path d="M15 11l0 2" />
                  <path d="M15 17l0 2" />
                  <path
                    d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2" />
                </svg>
              </span>
              <span class="nav-link-title"> Registrar Pago </span>
            </a>
          </router-link>
          <router-link v-if="$can('observacion', 'list')" class="nav-item" :to="{ name: 'Observacion' }"
            class-active="active">
            <a class="nav-link" href="#">
              <span
                class="nav-link-icon d-md-none d-lg-inline-block"><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard-text">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                  <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                  <path d="M9 12h6" />
                  <path d="M9 16h6" />
                </svg>
              </span>
              <span class="nav-link-title"> Registrar Observaciones </span>
            </a>
          </router-link>
          <h6 class="ms-3 dropdown-header mb-1 mt-3">Administración del Sistema</h6>
          <router-link v-if="$can('banner', 'list')" :class="['nav-item', { active: isBannerActive }]"
            :to="{ name: 'Banner' }">
            <a class="nav-link" href="#">
              <span
                class="nav-link-icon d-md-none d-lg-inline-block"><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
                  class="icon icon-tabler icons-tabler-filled icon-tabler-photo">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M8.813 11.612c.457 -.38 .918 -.38 1.386 .011l.108 .098l4.986 4.986l.094 .083a1 1 0 0 0 1.403 -1.403l-.083 -.094l-1.292 -1.293l.292 -.293l.106 -.095c.457 -.38 .918 -.38 1.386 .011l.108 .098l4.674 4.675a4 4 0 0 1 -3.775 3.599l-.206 .005h-12a4 4 0 0 1 -3.98 -3.603l6.687 -6.69l.106 -.095zm9.187 -9.612a4 4 0 0 1 3.995 3.8l.005 .2v9.585l-3.293 -3.292l-.15 -.137c-1.256 -1.095 -2.85 -1.097 -4.096 -.017l-.154 .14l-.307 .306l-2.293 -2.292l-.15 -.137c-1.256 -1.095 -2.85 -1.097 -4.096 -.017l-.154 .14l-5.307 5.306v-9.585a4 4 0 0 1 3.8 -3.995l.2 -.005h12zm-2.99 5l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" />
                </svg>
              </span>
              <span class="nav-link-title"> Banners </span>
            </a>
          </router-link>
          <router-link v-if="$can('page', 'list')" :class="['nav-item', { active: isPageActive }]"
            :to="{ name: 'Page' }">
            <a class="nav-link" href="#">
              <span
                class="nav-link-icon d-md-none d-lg-inline-block"><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
                  class="icon icon-tabler icons-tabler-filled icon-tabler-app-window">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M19 4a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-14a3 3 0 0 1 -3 -3v-10a3 3 0 0 1 3 -3zm-12.99 3l-.127 .007a1 1 0 0 0 .117 1.993l.127 -.007a1 1 0 0 0 -.117 -1.993zm3 0l-.127 .007a1 1 0 0 0 .117 1.993l.127 -.007a1 1 0 0 0 -.117 -1.993z" />
                </svg>
              </span>
              <span class="nav-link-title"> Page </span>
            </a>
          </router-link>
          <router-link v-if="$can('popup', 'list')" :class="['nav-item', { active: isPopupActive }]"
            :to="{ name: 'Popup' }">
            <a class="nav-link" href="#">
              <span
                class="nav-link-icon d-md-none d-lg-inline-block"><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
                  class="icon icon-tabler icons-tabler-filled icon-tabler-info-square">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M19 2a3 3 0 0 1 2.995 2.824l.005 .176v14a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005h14zm-7 9h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" />
                </svg>
              </span>
              <span class="nav-link-title"> Popups </span>
            </a>
          </router-link>
          <h6 class="ms-3 dropdown-header mb-1 mt-3">Administración de Usuarios</h6>
          <router-link v-if="$can('rol', 'list')" class="nav-item" to="/admin/roles" class-active="active">
            <a class="nav-link" href="#">
              <span
                class="nav-link-icon d-md-none d-lg-inline-block"><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-user-hexagon">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 13a3 3 0 1 0 0 -6a3 3 0 0 0 0 6z" />
                  <path d="M6.201 18.744a4 4 0 0 1 3.799 -2.744h4a4 4 0 0 1 3.798 2.741" />
                  <path
                    d="M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" />
                </svg>
              </span>
              <span class="nav-link-title"> Roles </span>
            </a>
          </router-link>
          <router-link v-if="$can('users', 'list')" class="nav-item" to="/admin/users" class-active="active">
            <a class="nav-link" href="#">
              <span
                class="nav-link-icon d-md-none d-lg-inline-block"><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-users">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                  <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                </svg>
              </span>
              <span class="nav-link-title"> Usuarios </span>
            </a>
          </router-link>
          <router-link v-if="$can('logs', 'list')" class="nav-item" to="/admin/logs" class-active="active">
            <a class="nav-link" href="#">
              <span
                class="nav-link-icon d-md-none d-lg-inline-block"><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-logs">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 12h.01" />
                  <path d="M4 6h.01" />
                  <path d="M4 18h.01" />
                  <path d="M8 18h2" />
                  <path d="M8 12h2" />
                  <path d="M8 6h2" />
                  <path d="M14 6h6" />
                  <path d="M14 12h6" />
                  <path d="M14 18h6" />
                </svg>
              </span>
              <span class="nav-link-title"> Logs</span>
            </a>
          </router-link>
        </ul>
      </div>
    </div>
  </aside>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

// Computed para el menú Page
const isPageActive = computed(() => {
  const pageRoutes = ['Page', 'PageStore', 'PageUpdate', 'PageList', 'PageFile'];
  return pageRoutes.includes(route.name);
});

// Computed para el menú Banner
const isBannerActive = computed(() => {
  const bannerRoutes = ['Banner', 'BannerStore', 'BannerUpdate', 'BannerList'];
  return bannerRoutes.includes(route.name);
});

const isPopupActive = computed(() => {
  const popupRoutes = ['Popup', 'PopupStore', 'PopupUpdate', 'PopupList'];
  return popupRoutes.includes(route.name);
});

</script>

<style scoped>
.navbar-vertical.navbar-expand-lg {
  z-index: 1010;
}

.nav-item {
  text-decoration: none;
}

.navbar-vertical.navbar-expand-lg .navbar-collapse .navbar-nav .nav-link {
  padding: 12px 20px;
}

.active .nav-link {
  background-color: rgba(0, 91, 191, 0.09);
  color: rgba(0, 91, 191);
}

.active .nav-link .nav-link-icon {
  color: rgba(0, 91, 191);
  font-weight: 100;
}
</style>
