export type NavigationTab = 
  | 'home' 
  | 'sku' 
  | 'sandi' 
  | 'lontara' 
  | 'pionering' 
  | 'agenda' 
  | 'presensi' 
  | 'profil' 
  | 'logbook'
  | 'dasadarma';

export type SkuLevel = 'bantara' | 'laksana';

export interface SkuItem {
  id: number;
  code: string;
  level: SkuLevel;
  category: 'Spiritual / Agama' | 'Patriotisme & Kebangsaan' | 'Sosial & Kepribadian' | 'Keterampilan & Teknologi' | 'Jasmani & Lingkungan';
  title: string;
  description: string;
  guide: string;
  completed: boolean;
  completedDate?: string;
  verifiedBy?: string;
  notes?: string;
}

export interface SkkItem {
  id: string;
  name: string;
  category: 'Agama & Mental' | 'Patriotisme & Seni' | 'Keterampilan' | 'Ketangkasan & Kesehatan' | 'Sosial & Kemanusiaan';
  level: 'Purwa' | 'Madya' | 'Utama';
  icon: string;
  description: string;
  completed: boolean;
}

export interface AgendaEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'Latihan Rutin' | 'Perkemahan' | 'Ujian SKU' | 'Bakti Masyarakat' | 'Rapat Dewan';
  description: string;
  uniform: 'Seragam Pramuka Lengkap' | 'Kaos Lapangan Ambalan' | 'Bebas Rapi';
  completed?: boolean;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  sangga: 'Perintis' | 'Penegas' | 'Pendobrak' | 'Pencoba' | 'Pelaksana';
  gudep: '10-035' | '10-036';
  memberName: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
  notes?: string;
}

export interface LogbookEntry {
  id: string;
  date: string;
  title: string;
  category: string;
  content: string;
  author: string;
  sangga: string;
  rating?: number;
}

export interface UserProfile {
  name: string;
  gender: 'putra' | 'putri';
  gudep: '10-035' | '10-036';
  sangga: 'Perintis' | 'Penegas' | 'Pendobrak' | 'Pencoba' | 'Pelaksana';
  level: 'Tamu Ambalan' | 'Calon Bantara' | 'Penegak Bantara' | 'Penegak Laksana' | 'Penegak Garuda';
  jabatan: string;
  ktaNumber: string;
  joinYear: string;
}
