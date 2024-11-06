<!-- DropzoneComponent.vue -->
<template>
    <div>
        <form ref="dropzoneElement" class="dropzone dz-clickable mb-3 form-control">
            <div class="dz-message">
                <span class="dropzone-msg-desc"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-upload">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                        <path d="M7 9l5 -5l5 5" />
                        <path d="M12 4l0 12" />
                    </svg> Arrastra y suelta tu imagen o haz clic aquí</span>
            </div>
        </form>
        <ul>
            <li>Formatos admitidos: jpg, png, jpge</li>
            <li>El tamaño de cada archivo no debe de superar los 2MB y se puede adjuntar hasta 1 archivo.</li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Dropzone from 'dropzone';
import 'dropzone/dist/dropzone.css';

// Referencia al formulario de Dropzone
const dropzoneElement = ref(null);
let myDropzone = null;

// Exponer el archivo al componente padre
const getFile = () => {
    if (myDropzone && myDropzone.getAcceptedFiles().length > 0) {
        return myDropzone.getAcceptedFiles()[0]; // Devolver el primer archivo
    }
    return null;
};

const removeAllFiles = () => {
    if (myDropzone) {
        myDropzone.removeAllFiles(); // Elimina todos los archivos de Dropzone
    }
};

onMounted(() => {
    myDropzone = new Dropzone(dropzoneElement.value, {
        url: '/upload', // Este URL es solo para configurar Dropzone, pero no se usará ya que no queremos auto procesar.
        maxFiles: 1,
        maxFilesize: 2, // en MB
        acceptedFiles: '.jpg,.png,.jpeg',
        autoProcessQueue: false, // No subir automáticamente
        uploadMultiple: false,
        dictDefaultMessage: "Arrastra y suelta tu imagen aquí o haz clic",
        dictFallbackMessage: "Tu navegador no soporta la subida de archivos mediante arrastrar y soltar.",
        dictFileTooBig: "El archivo es demasiado grande ({{filesize}}MiB). Máximo permitido: {{maxFilesize}}MiB.",
        dictInvalidFileType: "No puedes subir archivos de este tipo.",
        dictResponseError: "El servidor respondió con el código {{statusCode}}.",
        dictCancelUpload: "Cancelar subida",
        dictCancelUploadConfirmation: "¿Estás seguro de que quieres cancelar esta subida?",
        dictRemoveFile: "Eliminar archivo",
        dictMaxFilesExceeded: "No puedes subir más archivos.",
    });
});

// Exponer la función getFile
defineExpose({
    getFile,
    removeAllFiles
});
</script>
<style scoped>
.dropzone.dz-clickable {
    cursor: pointer;
}

.dropzone {
    border: 1px dashed #dce1e7;
    color: #6c7a91;
    padding: 1rem;
    min-height: 150px;
    border-radius: 5px;
    transition: border-color 0.3s ease; /* Transición para el color del borde */
}

.dropzone:hover {
    border: 1px dashed #006bd2;
}
</style>