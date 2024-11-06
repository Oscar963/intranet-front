<template>
    <div>
        <div class="mb-3">
            <div class="input-group">
                <input v-model="fileName" type="text" class="form-control" placeholder="Nombre del archivo">
                <input type="file" class="form-control" @change="handleFileChange" />
                <button type="button" class="btn btn-success" @click="submitFile" :disabled="!file || !fileName">Subir
                    Archivo</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';

// Definición de props
const props = defineProps({
    idPage: {
        type: Number, // O String, según sea necesario
        required: true
    }
});

const file = ref(null); // Para almacenar el archivo seleccionado
const fileName = ref(''); // Para almacenar el nombre del archivo

const handleFileChange = (event) => {
    // Obtener el archivo seleccionado
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        file.value = selectedFile;
    }
};

const submitFile = () => {
    if (file.value && fileName.value) {
        const formData = new FormData();
        formData.append('file', file.value);
        formData.append('name', fileName.value);
        formData.append('idPage', props.idPage); // Añadir idPage al FormData

        // Aquí puedes hacer la solicitud HTTP para subir el archivo
        // Ejemplo usando Axios:
        // axios.post('/upload', formData)
        //   .then(response => {
        //     console.log('Archivo subido:', response.data);
        //   })
        //   .catch(error => {
        //     console.error('Error al subir el archivo:', error);
        //   });

        console.log('Archivo:', file.value);
        console.log('Nombre del archivo:', fileName.value);
        console.log('ID de la página:', props.idPage); // Imprimir idPage
    }
};
</script>
