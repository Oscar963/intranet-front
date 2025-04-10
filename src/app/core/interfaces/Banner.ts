export interface Banner {
  id: number;
  title: string;
  image: string;
  date: string;
  date_expiration: string;
  status: string;
  link: string | null;
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
