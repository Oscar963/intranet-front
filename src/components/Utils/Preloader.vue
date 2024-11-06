<template>
    <div v-if="loading" class="d-flex flex-column preloader">
        <div class="page page-center">
            <div class="container container-slim">
                <div class="text-center">
                    <div class="mb-3">
                        <a href="#" class="navbar-brand navbar-brand-autodark"><img src="/img/logos/logo3.png"
                                alt="" /></a>
                    </div>
                    <div class="progress progress-sm">
                        <div class="progress-bar progress-bar-indeterminate"></div>
                    </div>
                    <div class="text-muted mb-3 py-2">Cargando...</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useLoadingStore } from '@/stores/loading';

const loadingStore = useLoadingStore();
const loading = computed(() => loadingStore.isLoading);
</script>

<style scoped>
.preloader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}
</style>