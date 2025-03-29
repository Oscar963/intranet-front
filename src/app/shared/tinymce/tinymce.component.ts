import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
} from '@angular/forms';
import {
  EditorComponent,
  TINYMCE_SCRIPT_SRC,
  EditorModule,
} from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-tinymce',
  imports: [EditorModule, FormsModule],
  templateUrl: './tinymce.component.html',
  styleUrls: ['./tinymce.component.css'],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TinymceComponent),
      multi: true,
    },
  ],
})
export class TinymceComponent implements ControlValueAccessor {
  @Input() initOptions: Partial<EditorComponent['init']> = {}; // Configuración personalizada
  @Output() contentChange = new EventEmitter<string>(); // Cambios en el contenido

  value: string = ''; // Valor del editor

  // Configuración predeterminada del editor
  defaultInit: EditorComponent['init'] = {
    license_key: 'gpl',
    plugins: 'lists link image table code media autolink fullscreen image',
    toolbar:
      'undo redo | formatselect | bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | link image media | removeformat',
    base_url: '/tinymce/',
    suffix: '.min',
    language: 'es_MX',
  };

  // Combinar configuración predeterminada con opciones personalizadas
  get initConfig(): EditorComponent['init'] {
    return { ...this.defaultInit, ...this.initOptions };
  }

  // Métodos de ControlValueAccessor
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implementar si es necesario
  }

  // Emitir cambios del contenido
  onEditorChange(content: string): void {
    this.value = content;
    this.onChange(content);
    this.contentChange.emit(content);
  }
}
