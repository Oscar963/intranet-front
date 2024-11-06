<template>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item" v-for="(crumb, index) in breadcrumbs" :key="index">
                <router-link v-if="index !== breadcrumbs.length - 1" :to="crumb.path">{{ crumb.name }}</router-link>
                <span v-else>{{ crumb.name }}</span>
            </li>
        </ol>
    </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const breadcrumbs = computed(() => {
    const matchedRoutes = route.matched.filter((r) => r.name);
    return matchedRoutes.map((r) => ({
        path: r.path,
        name: r.name,
    }));
});
</script>