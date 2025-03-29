export interface File {
  id: number;
  name: string;
  description: string;
  url: string;
  type: string;
  size: number;
  created_at: string;
  updated_at: string;
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
}
