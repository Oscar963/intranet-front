import { File } from '../interfaces/File'; // Asegúrate de que la ruta sea correcta

export interface Page {
  id: number;
  title: string;
  image: string;
  date: string;
  content: string;
  slug: string;
  status: string;
  files: File[]; 
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: {
    name: string;
    email: string;
    paternal_surname: string;
    maternal_surname: string;
  };
  updated_by: {
    name: string;
    email: string;
    paternal_surname: string;
    maternal_surname: string;
  };
  deleted_by: {
    name: string;
    email: string;
    paternal_surname: string;
    maternal_surname: string;
  } | null;
}
