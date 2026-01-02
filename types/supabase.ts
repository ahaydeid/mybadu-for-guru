export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      guru: {
        Row: { id: number; nama: string | null; nip: string | null; email: string | null };
        Insert: { nama: string; nip?: string | null; email?: string | null };
        Update: { nama?: string | null; nip?: string | null; email?: string | null };
      };
      siswa: {
        Row: { id: number; nama: string; nis: string | null; kelas_id: number | null };
        Insert: { nama: string; nis?: string | null; kelas_id?: number | null };
        Update: { nama?: string | null; nis?: string | null; kelas_id?: number | null };
      };
      // tambahkan tabel lain sesuai kebutuhan
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
