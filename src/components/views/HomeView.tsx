import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  Brain, 
  Calendar, 
  ChevronRight, 
  X, 
  Clock, 
  UserCheck, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { UserAccount, ActiveMenu, ProgramKerjaItem } from '../../types';
import { DEFAULT_PROGRAM_KERJA_ITEMS } from '../../data/defaultProgramKerja';
import { LOGO_IMAGE_PATH } from '../../data/scoutData';

interface HomeViewProps {
  onNavigateMenu?: (menu: ActiveMenu) => void;
  user?: UserAccount;
  programKerjaList?: ProgramKerjaItem[];
}

interface KalenderBulanItem {
  id: number;
  bulan: string;
  singkatan: string;
  bgHex: string;
  iconSymbol: string;
  kegiatanUtama: string;
  deskripsi: string;
}

// 12 Bulan sesuai lingkaran SDGs (Januari s.d. Desember)
const BULAN_LINGKARAN_SDG: KalenderBulanItem[] = [
  {
    id: 1,
    bulan: 'Januari',
    singkatan: 'JAN',
    bgHex: '#C5192D', // Merah Tua
    iconSymbol: '🚩',
    kegiatanUtama: 'Pelantikan Penggalang & Penegak',
    deskripsi: 'Upacara kenaikan tingkat Penegak Bantara, pindah golongan, dan penerimaan tamu ambalan baru.'
  },
  {
    id: 2,
    bulan: 'Februari',
    singkatan: 'FEB',
    bgHex: '#EA580C', // Oranye
    iconSymbol: '🌱',
    kegiatanUtama: 'Bakti Sosial Peduli Lingkungan',
    deskripsi: 'Aksi penghijauan pangkalan, penanaman pohon, dan bakti pembersihan lingkungan hidup.'
  },
  {
    id: 3,
    bulan: 'Maret',
    singkatan: 'MAR',
    bgHex: '#D97706', // Kuning Emas
    iconSymbol: '🪢',
    kegiatanUtama: 'Pelatihan Tali Temali dan Simpul',
    deskripsi: 'Pendalaman simpul mati, pangkal, jangkar, kembar, dan ikatan pionering tiang bendera.'
  },
  {
    id: 4,
    bulan: 'April',
    singkatan: 'APR',
    bgHex: '#65A30D', // Hijau Muda
    iconSymbol: '🎒',
    kegiatanUtama: 'Menjelajah Alam dan Hiking',
    deskripsi: 'Lintas alam pedesaan/hutan, penjelajahan rute jejak kompas, dan survival dasar penegak.'
  },
  {
    id: 5,
    bulan: 'Mei',
    singkatan: 'MEI',
    bgHex: '#15803D', // Hijau Tua
    iconSymbol: '🧗',
    kegiatanUtama: 'Lomba Ketangkasan & Pionering',
    deskripsi: 'Kompetisi pembuatan jembatan darurat, menara pandang cepat, dan ketangkasan fisik sangga.'
  },
  {
    id: 6,
    bulan: 'Juni',
    singkatan: 'JUN',
    bgHex: '#0891B2', // Cyan / Biru Muda
    iconSymbol: '🏕️',
    kegiatanUtama: 'Perkemahan dan Api Unggun',
    deskripsi: 'Perkemahan akbar penutupan tahun ajaran, upacara malam api unggun, dan malam apresiasi budaya.'
  },
  {
    id: 7,
    bulan: 'Juli',
    singkatan: 'JUL',
    bgHex: '#0F766E', // Teal / Hijau Laut
    iconSymbol: '🩹',
    kegiatanUtama: 'Simulasi Pertolongan Pertama (PMR)',
    deskripsi: 'Pelatihan P3K darurat, pembalutan mitela luka, pembuatan tandu darurat, dan evakuasi korban.'
  },
  {
    id: 8,
    bulan: 'Agustus',
    singkatan: 'AGU',
    bgHex: '#1D4ED8', // Biru
    iconSymbol: '🔥',
    kegiatanUtama: 'Pesta Pramuka & Syukur HUT',
    deskripsi: 'Peringatan Hari Pramuka ke-65, karnaval ambalan, dan renungan suci Trisatya & Dasa Darma.'
  },
  {
    id: 9,
    bulan: 'September',
    singkatan: 'SEP',
    bgHex: '#1E293B', // Navy Gelap
    iconSymbol: '🧭',
    kegiatanUtama: 'Orientering & Baca Peta Kompas',
    deskripsi: 'Navigasi darat, membaca peta topografi kontur, penentuan posisi resection, dan orientering.'
  },
  {
    id: 10,
    bulan: 'Oktober',
    singkatan: 'OKT',
    bgHex: '#6B21A8', // Ungu
    iconSymbol: '🎭',
    kegiatanUtama: 'Pengembangan Bakat Seni Budaya',
    deskripsi: 'Pentas seni ambalan, teater kearifan lokal Siri\' na Pacce, musik bambu, dan pameran sangga.'
  },
  {
    id: 11,
    bulan: 'November',
    singkatan: 'NOV',
    bgHex: '#9D174D', // Magenta / Plum
    iconSymbol: '🎖️',
    kegiatanUtama: 'Kegiatan Baris Berbaris (PBB)',
    deskripsi: 'Latihan baris berbaris tongkat resmi, variasi formasi lapangan, dan penanaman disiplin diri.'
  },
  {
    id: 12,
    bulan: 'Desember',
    singkatan: 'DES',
    bgHex: '#BE185D', // Rose Pink
    iconSymbol: '📜',
    kegiatanUtama: 'Evaluasi Tahunan & Lencana',
    deskripsi: 'Musyawarah ambalan tahunan, penganugerahan bintang tahunan, dan penghargaan lencana teladan.'
  }
];

// Helper kalkulasi geometri SVG Donut Arc (12 Sektor Lingkaran SDGs)
function polarToCartesian(cx: number, cy: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians)
  };
}

function describeArcSegment(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
) {
  const startOuter = polarToCartesian(cx, cy, outerRadius, startAngle);
  const endOuter = polarToCartesian(cx, cy, outerRadius, endAngle);
  const startInner = polarToCartesian(cx, cy, innerRadius, startAngle);
  const endInner = polarToCartesian(cx, cy, innerRadius, endAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}`,
    'Z'
  ].join(' ');
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateMenu,
  user,
  programKerjaList = DEFAULT_PROGRAM_KERJA_ITEMS
}) => {
  const activeName = user?.nama || 'Kakak Penegak';
  const activeGudep = user?.gudep || '10-035';
  const activeJabatan = user?.jabatan || user?.tingkat || 'Penegak Bantara';

  // Current calendar month (0 = Januari, 9 = Oktober)
  const currentMonthIdx = new Date().getMonth();
  const [selectedIdx, setSelectedIdx] = useState<number>(currentMonthIdx);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const activeItem = BULAN_LINGKARAN_SDG[selectedIdx] || BULAN_LINGKARAN_SDG[0];

  // Related proker from database for active month
  const relatedProker = programKerjaList.filter(
    p => p.bulan?.toLowerCase() === activeItem.bulan.toLowerCase()
  );

  // SVG Dimension constants
  const size = 320;
  const center = size / 2; // 160
  const outerR = 142;
  const innerR = 86;
  const gapDegree = 3; // White gap between 12 SDG segments
  const sliceDegree = 360 / 12; // 30 degrees per month

  return (
    <div className="space-y-4 pb-24 font-sans">
      
      {/* 1. BANNER BERANDA WARNA MERAH: UCAPAN SELAMAT DATANG (NAMA PENGGUNA) */}
      <div className="bg-[#e51c24] text-white rounded-3xl p-5 shadow-md relative overflow-hidden border border-red-700">
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="space-y-1 min-w-0">
            <span className="inline-block text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono tracking-wider border border-white/30 backdrop-blur-xs">
              Pangkalan Gudep {activeGudep}
            </span>
            <h2 className="text-base sm:text-lg font-black text-white leading-tight truncate">
              Selamat datang, {activeName}
            </h2>
            <p className="text-xs text-red-100 font-medium truncate">
              {activeJabatan} • Ambalan La Surullah Petta Lopo
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white text-[#e51c24] flex items-center justify-center font-black text-xl shadow-md border border-white/40 shrink-0">
            ⚜️
          </div>
        </div>
      </div>

      {/* 2. AGENDA BULANAN — satu banner untuk setiap bulan */}
      <section className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#e51c24]">Kalender Ambalan</span>
            <h3 className="text-base font-black text-slate-900">Agenda Bulan Ini</h3>
          </div>
          <span className="text-[10px] font-semibold text-slate-400">{selectedIdx + 1} / 12</span>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl touch-pan-y"
          onTouchStart={(event) => {
            (event.currentTarget as HTMLDivElement).dataset.touchStartX = String(event.touches[0].clientX);
          }}
          onTouchEnd={(event) => {
            const startX = Number((event.currentTarget as HTMLDivElement).dataset.touchStartX || 0);
            const delta = event.changedTouches[0].clientX - startX;
            if (Math.abs(delta) > 45) {
              setSelectedIdx(current => (current + (delta < 0 ? 1 : 11)) % 12);
            }
          }}
        >
          <div
            className="min-h-[190px] p-5 text-white relative flex flex-col justify-between"
            style={{ background: `linear-gradient(135deg, ${activeItem.bgHex}, #7f1d1d)` }}
          >
            <div className="absolute -right-8 -top-10 w-44 h-44 rounded-full border-[22px] border-white/10" />
            <div className="absolute -right-1 bottom-2 text-7xl opacity-15 select-none">{activeItem.iconSymbol}</div>
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.18em]">{activeItem.bulan} {new Date().getFullYear()}</span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/20 border border-white/30">AGENDA {String(activeItem.id).padStart(2, '0')}</span>
            </div>
            <div className="relative z-10 max-w-[85%]">
              <h4 className="text-xl font-black leading-tight">{activeItem.kegiatanUtama}</h4>
              <p className="text-xs text-white/85 mt-2 leading-relaxed">{activeItem.deskripsi}</p>
            </div>
            <div className="relative z-10 flex items-center justify-between mt-4">
              <span className="text-[10px] font-semibold text-white/80">{relatedProker.length} program kerja tercatat</span>
              <button onClick={() => setIsDetailModalOpen(true)} className="text-xs font-bold bg-white text-[#b91c1c] rounded-full px-3 py-2 shadow-sm">Lihat rincian <ArrowRight className="inline w-3.5 h-3.5 ml-1" /></button>
            </div>
          </div>
          <button
            onClick={() => setSelectedIdx(current => (current + 11) % 12)}
            aria-label="Agenda bulan sebelumnya"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-slate-800 shadow flex items-center justify-center"
          ><ChevronRight className="w-4 h-4 rotate-180" /></button>
          <button
            onClick={() => setSelectedIdx(current => (current + 1) % 12)}
            aria-label="Agenda bulan berikutnya"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-slate-800 shadow flex items-center justify-center"
          ><ChevronRight className="w-4 h-4" /></button>
        </div>

        <div className="flex items-center justify-center gap-1.5">
          {BULAN_LINGKARAN_SDG.map((month, index) => (
            <button
              key={month.id}
              onClick={() => setSelectedIdx(index)}
              aria-label={`Tampilkan agenda ${month.bulan}`}
              title={month.bulan}
              className={`h-1.5 rounded-full transition-all ${selectedIdx === index ? 'w-6 bg-[#e51c24]' : 'w-1.5 bg-slate-300'}`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between gap-2">
          <button onClick={() => setSelectedIdx(current => (current + 11) % 12)} className="text-xs font-bold text-slate-600 px-2 py-1">‹ Bulan sebelumnya</button>
          <span className="text-[10px] font-semibold text-slate-400">Geser banner untuk 12 bulan</span>
          <button onClick={() => setSelectedIdx(current => (current + 1) % 12)} className="text-xs font-bold text-slate-600 px-2 py-1">Berikutnya ›</button>
        </div>
      </section>

      {/* 3. MENU CEPAT: PENCAPAIAN SKU, PENCAPAIAN SKK, QUIZ PRAMUKA */}
      <div className="space-y-2">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono px-1">
          Menu Cepat
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Pencapaian SKU */}
          <button
            onClick={() => onNavigateMenu?.('sku_skk')}
            className="bg-white rounded-2xl p-3.5 border border-slate-200 hover:border-red-300 shadow-xs flex items-center justify-between text-left group transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#e51c24] flex items-center justify-center font-black shrink-0 border border-red-100">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <strong className="block text-xs font-black text-slate-900 group-hover:text-[#e51c24] transition-colors truncate">
                  Pencapaian SKU
                </strong>
                <span className="block text-[10px] text-slate-500 truncate">
                  Syarat Bantara & Laksana
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#e51c24] transition-colors shrink-0" />
          </button>

          {/* Pencapaian SKK */}
          <button
            onClick={() => onNavigateMenu?.('sku_skk')}
            className="bg-white rounded-2xl p-3.5 border border-slate-200 hover:border-red-300 shadow-xs flex items-center justify-between text-left group transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black shrink-0 border border-amber-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <strong className="block text-xs font-black text-slate-900 group-hover:text-[#e51c24] transition-colors truncate">
                  Pencapaian SKK
                </strong>
                <span className="block text-[10px] text-slate-500 truncate">
                  Tanda Kecakapan Khusus
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#e51c24] transition-colors shrink-0" />
          </button>

          {/* Quiz Pramuka */}
          <button
            onClick={() => onNavigateMenu?.('quiz')}
            className="bg-white rounded-2xl p-3.5 border border-slate-200 hover:border-red-300 shadow-xs flex items-center justify-between text-left group transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-black shrink-0 border border-purple-200">
                <Brain className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <strong className="block text-xs font-black text-slate-900 group-hover:text-[#e51c24] transition-colors truncate">
                  Quiz Pramuka
                </strong>
                <span className="block text-[10px] text-slate-500 truncate">
                  Uji Wawasan Penegak
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#e51c24] transition-colors shrink-0" />
          </button>
        </div>
      </div>

      {/* 4. MODAL POPUP DETAIL AGENDA BULAN */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-150 overflow-hidden">
            
            {/* Header Modal */}
            <div 
              style={{ backgroundColor: activeItem.bgHex }}
              className="p-4 -m-5 mb-4 text-white flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl border border-white/40">
                  {activeItem.iconSymbol}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase opacity-90 block">
                    Bulan {activeItem.bulan} ({activeItem.id}/12)
                  </span>
                  <h3 className="text-xs sm:text-sm font-black leading-tight">
                    {activeItem.kegiatanUtama}
                  </h3>
                </div>
              </div>

              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Isi Rincian */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase font-mono block mb-1">
                  Materi & Agenda Utama:
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {activeItem.deskripsi}
                </p>
              </div>

              {/* Rincian Tambahan Proker Terjadwal */}
              {relatedProker.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">
                    Agenda Terdaftar ({relatedProker.length} Program):
                  </span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {relatedProker.map((p) => (
                      <div
                        key={p.id}
                        className="p-2.5 rounded-xl bg-red-50/50 border border-red-100 flex items-start justify-between gap-2"
                      >
                        <div>
                          <strong className="text-slate-900 block font-bold text-xs">{p.nama}</strong>
                          <span className="text-[10px] text-slate-500 font-mono">Waktu: {p.waktuPelaksanaan}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-white text-[9px] font-bold text-slate-700 border border-slate-200 shrink-0">
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Tutup
              </button>

              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  onNavigateMenu?.('dashboard');
                }}
                className="px-4 py-2 rounded-xl bg-[#e51c24] text-white text-xs font-bold hover:bg-[#c9141b] transition-colors"
              >
                Buka Kegiatan & Latihan
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
