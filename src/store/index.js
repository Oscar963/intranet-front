import { defineStore } from 'pinia';
import axios from '../axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    async login(credentials) {
      const { data } = await axios.post('/login', credentials);
      this.user = data.user;
    },
    async logout() {
      await axios.post('/logout');
      this.user = null;
    },
  },
  getters: {
    isAuthenticated: state => !!state.user,
  },
});
