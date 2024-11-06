# Laravel-Vue-Web

## Instalación

### Backend (Laravel)
1. Clonar el repositorio:
   git clone https://github.com/Oscar963/app-backend.git
   cd app-backend

2. Instalar dependencias:
   composer install

3. Configurar .env:
   cp .env.example .env
   php artisan key:generate

4. Migrar la base de datos:
   php artisan migrate

5. Iniciar el servidor:
   php artisan serve

### Frontend (Vue.js con Vite y Pinia)
1. Clonar el repositorio:
   git clone https://github.com/Oscar963/app-front.git
   cd app-front

2. Instalar dependencias:
   npm install

3. Configurar .env:
   npm run dev