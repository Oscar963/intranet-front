<template>
  <div class="pt-2">
    <div class="d-flex justify-content-between align-items-center">
      <div class="col-form-label mx-3">
        Filas por página:
        <div for="perPageSelect" class="mx-2 d-inline-block">
          <select class="form-select form-select-sm" @change="changeItemsPerPage($event)">
            <option v-for="option in itemsPerPageOptions" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>
      </div>
      <ul class="pagination mx-3">
        <li :class="['page-item', { disabled: currentPage === 1 }]">
          <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)" tabindex="-1"
            :aria-disabled="currentPage === 1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M15 6l-6 6l6 6" />
            </svg>
          </a>
        </li>
        <li v-for="page in totalPages" :key="page" :class="['page-item', { active: currentPage === page }]">
          <a class="page-link mx-1" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
        </li>
        <li :class="['page-item', { disabled: currentPage === totalPages }]">
          <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 6l6 6l-6 6" />
            </svg>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';

// Definición de propiedades
const props = defineProps({
  totalPages: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    required: true
  }
});

// Opciones de elementos por página
const itemsPerPageOptions = [10, 20, 30, 40, 50];

// Definición de eventos emitidos
const emit = defineEmits(['page-changed', 'items-per-page-changed']);

// Cambio de elementos por página
const changeItemsPerPage = (event) => {
  const newItemsPerPage = parseInt(event.target.value, 10);
  emit('items-per-page-changed', newItemsPerPage);
};

// Ir a una página específica
const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-changed', page);
  }
};

// Propiedades computadas
const currentPage = computed(() => props.currentPage);
const totalPages = computed(() => props.totalPages);
</script>
