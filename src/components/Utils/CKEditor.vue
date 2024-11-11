<template>
    <div class="main-container">
        <div class="editor-container editor-container_classic-editor">
            <div class="editor-container__editor">
                <!-- CKEditor -->
                <ckeditor v-if="isLayoutReady" v-model="contenido" :editor="editor" :config="config"
                    @input="onInputChange" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import {
    ClassicEditor,
    AccessibilityHelp,
    Autoformat,
    AutoImage,
    Autosave,
    BlockQuote,
    Bold,
    CloudServices,
    Essentials,
    FindAndReplace,
    FullPage,
    GeneralHtmlSupport,
    Heading,
    HtmlComment,
    HtmlEmbed,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsert,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    MediaEmbed,
    PageBreak,
    Paragraph,
    PasteFromOffice,
    PictureEditing,
    SelectAll,
    ShowBlocks,
    SourceEditing,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    TodoList,
    Underline,
    Undo,
    SimpleUploadAdapter
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import coreTranslations from 'ckeditor5/translations/es.js';
import { Ckeditor } from '@ckeditor/ckeditor5-vue';

// Props
const props = defineProps({
    modelValue: String,
    required: true,
});

// Events
const emit = defineEmits(["update:modelValue"]);

// Reactive references
const contenido = ref(props.modelValue); // Content of the editor
const isLayoutReady = ref(false); // To track if the editor is ready
const config = ref({}); // CKEditor configuration
const editor = ClassicEditor; // CKEditor instance

// Watch for changes in modelValue and update the content
watch(() => props.modelValue, (newValue) => {
    if (newValue !== contenido.value) {
        contenido.value = newValue;
    }
});

// Emit the updated value to the parent component
const onInputChange = (editorInstance) => {
    const data = editorInstance; // Editor content
    emit('update:modelValue', data); // Emit the updated value to the parent
};

const getImageUrl = (imagePath) => {
    return `${import.meta.env.VITE_APP_API_BASE_URL}${imagePath}`;
};
// Mount the editor and configure it
onMounted(() => {
    config.value = {
        simpleUpload: {
            uploadUrl: 'http://127.0.0.1:8000/api/pages/files/ckeditor',
        },
        toolbar: {
            items: [
                'undo', 'redo', '|', 'sourceEditing', 'showBlocks', 'findAndReplace', '|', 'heading', '|',
                'bold', 'italic', 'underline', '|', 'pageBreak', 'link', 'insertImage', 'insertImageViaUrl',
                'mediaEmbed', 'insertTable', 'blockQuote', 'htmlEmbed', '|', 'bulletedList', 'numberedList',
                'todoList', 'outdent', 'indent'
            ],
            shouldNotGroupWhenFull: false
        },
        initialData: '',
        height: '300px', // Altura inicial
        plugins: [
            AccessibilityHelp, Autoformat, AutoImage, Autosave, BlockQuote, Bold, CloudServices, Essentials,
            FindAndReplace, FullPage, GeneralHtmlSupport, Heading, HtmlComment, HtmlEmbed, ImageBlock,
            ImageCaption, ImageInline, ImageInsert, ImageInsertViaUrl, ImageResize, ImageStyle, ImageTextAlternative,
            ImageToolbar, ImageUpload, Indent, IndentBlock, Italic, Link, LinkImage, List, ListProperties,
            MediaEmbed, PageBreak, Paragraph, PasteFromOffice, PictureEditing, SelectAll, ShowBlocks, SourceEditing,
            Table, TableCaption, TableCellProperties, TableColumnResize, TableProperties, TableToolbar, TextTransformation,
            TodoList, Underline, Undo, SimpleUploadAdapter
        ],
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
            ]
        },
        htmlSupport: {
            allow: [{ name: /^.*$/, styles: true, attributes: true, classes: true }]
        },
        image: {
            toolbar: [
                'toggleImageCaption', 'imageTextAlternative', '|', 'imageStyle:inline', 'imageStyle:wrapText',
                'imageStyle:breakText', '|', 'resizeImage'
            ]
        },
        link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: { download: 'file' }
                }
            }
        },
        list: {
            properties: {
                styles: true,
                startIndex: true,
                reversed: true
            }
        },
        menuBar: { isVisible: true },
        placeholder: '',
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
        },
        translations: [
            coreTranslations,
        ]
    };

    isLayoutReady.value = true; // Mark the editor as ready
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap');

.main-container {
    font-family: 'Lato';
    width: 100%;
    margin-left: auto;
    margin-right: auto;
}

.ck-content {
    font-family: 'Lato';
    line-height: 1.6;
    word-break: break-word;
}

.editor-container_classic-editor .editor-container__editor {
    width: 100%;
}

.ck-editor__editable {
    min-height: 300px !important;
}
</style>