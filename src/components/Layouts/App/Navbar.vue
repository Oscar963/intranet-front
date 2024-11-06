<template>
  <header class="navbar-expand-md d-block d-lg-none d-xl-none d-print-none">
    <div class="collapse navbar-collapse" id="navbar-menu">
      <div class="navbar">
        <div class="container-fluid">
          <ul class="navbar-nav">
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
            <router-link v-if="$can('pago', 'list')" class="nav-item" :to="{ name: 'Pago' }"
              class-active="active">
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
                <span class="nav-link-title"> Registrar pago </span>
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
            <router-link v-if="$can('empresa', 'list')" class="nav-item" :to="{ name: 'Empresa' }"
              class-active="active">
              <a class="nav-link" href="#">
                <span
                  class="nav-link-icon d-md-none d-lg-inline-block"><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-building-estate">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 21h18" />
                    <path d="M19 21v-4" />
                    <path d="M19 17a2 2 0 0 0 2 -2v-2a2 2 0 1 0 -4 0v2a2 2 0 0 0 2 2z" />
                    <path d="M14 21v-14a3 3 0 0 0 -3 -3h-4a3 3 0 0 0 -3 3v14" />
                    <path d="M9 17v4" />
                    <path d="M8 13h2" />
                    <path d="M8 9h2" />
                  </svg>
                </span>
                <span class="nav-link-title"> Empresa </span>
              </a>
            </router-link>
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
    </div>
  </header>
</template>
<style scoped>
.nav-item {
  text-decoration: none;
}
</style>
