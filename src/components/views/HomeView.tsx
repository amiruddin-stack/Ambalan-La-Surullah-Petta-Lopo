import React, { useState } from 'react';
import { 
  CheckSquare, 
  Radio, 
  Compass, 
  Languages, 
  Calendar, 
  FileText, 
  Award, 
  ChevronRight, 
  Flame, 
  Sparkles, 
  Volume2, 
  ShieldAlert, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { NavigationTab, UserProfile, SkuItem } from '../../types';
import { LOGO_IMAGE_PATH, INITIAL_EVENTS, SEJARAH_TOKOH } from '../../data/scoutData';

interface HomeViewProps {
  onSelectTab: (tab: NavigationTab) => void;
  profile: UserProfile;
  skuItems: SkuItem[];
  onOpenQuickMorse: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTab,
  profile,
  skuItems,
  onOpenQuickMorse
}) => {
  const [darmaIndex, setDarmaIndex] = useState(0);

  const dasaDarmaList = [
    { no: 1, text: 'Taqwa kepada Tuhan Yang Maha Esa.' },
    { no: 2, text: 'Cinta alam dan kasih sayang sesama manusia.' },
    { no: 3, text: 'Patriot yang sopan dan kesatria.' },
    { no: 4, text: 'Patuh dan suka bermusyawarah.' },
    { no: 5, text: 'Rela menolong dan tabah.' },
    { no: 6, text: 'Rajin, terampil, dan gembira.' },
    { no: 7, text: 'Hemat, cermat, dan bersahaja.' },
    { no: 8, text: 'Disiplin, berani, dan setia.' },
    { no: 9, text: 'Bertanggung jawab dan dapat dipercaya.' },
    { no: 10, text: 'Suci dalam pikiran, perkataan, dan perbuatan.' }
  ];

  const completedSkuCount = skuItems.filter(item => item.completed).length;
  const skuPercentage = Math.round((completedSkuCount / skuItems.length) * 100);

  const quickActions = [
    {
      title: 'Uji SKU Penegak',
      desc: `${completedSkuCount}/${skuItems.length} Selesai`,
      icon: CheckSquare,
      color: 'bg-red-50 text-[#e51c24] border-amber-300',
      action: () => onSelectTab('sku')
    },
    {
      title: 'Sandi Morse Audio',
      desc: 'Peluit & Senter',
      icon: Radio,
      color: 'bg-amber-50 text-amber-800 border-amber-300',
      action: () => onSelectTab('sandi')
    },
    {
      title: 'Aksara Lontara',
      desc: 'Kamus Bugis',
      icon: Languages,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      action: () => onSelectTab('lontara')
    },
    {
      title: 'Tali Temali & Pionering',
      desc: 'Simpul & Ikatan',
      icon: Compass,
      color: 'bg-blue-50 text-blue-800 border-blue-300',
      action: () => onSelectTab('pionering')
    },
    {
      title: 'Presensi Sangga',
      desc: 'Absensi Latihan',
      icon: UserCheck,
      color: 'bg-purple-50 text-purple-800 border-purple-300',
      action: () => onSelectTab('presensi')
    },
    {
      title: 'Catatan Logbook',
      desc: 'Jurnal Harian',
      icon: FileText,
      color: 'bg-orange-50 text-orange-800 border-orange-300',
      action: () => onSelectTab('logbook')
    }
  ];

  return (
    <div className="space-y-4 pb-20">
      
      {/* Hero Welcome Card: White Dominant with Logo Red & Yellow Border */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border-2 border-amber-400 relative overflow-hidden">
        {/* Top accent badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#e51c24] text-white shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
            Ambalan Siaga & Berbakti
          </span>
          <span className="text-xs font-extrabold font-mono text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300">
            Gudep {profile.gudep}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Emblem preview with glowing yellow border */}
          <div 
            onClick={() => onSelectTab('profil')}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-1.5 ring-2 ring-amber-400 shadow-md shrink-0 cursor-pointer hover:scale-105 transition-transform"
            title="Klik untuk melihat filosofi lambang"
          >
            <img 
              src={LOGO_IMAGE_PATH} 
              alt="Lambang Ambalan La Surullah Petta Lopo" 
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Ambalan La Surullah <br />
              <span className="text-[#e51c24]">Petta Lopo</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
              Selamat datang, <strong className="text-slate-900">{profile.name}</strong> ({profile.jabatan}). 
              Pangkalan Gugus Depan 10-035 (Putra) & 10-036 (Putri) Gerakan Pramuka Penegak.
            </p>

            {/* Quick Slogan Badge */}
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-amber-900 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Semboyan Ambalan: <em>"Siri' na Pacce - Pantang Mundur Sebelum Tuntas"</em></span>
            </div>
          </div>
        </div>

        {/* SKU Progress Card Inside Hero */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-auto flex-1">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#e51c24]" />
                Progres SKU ({profile.level})
              </span>
              <span className="font-mono font-bold text-[#e51c24] bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                {skuPercentage}% ({completedSkuCount}/{skuItems.length} Butir)
              </span>
            </div>
            {/* Progress Bar with Yellow Border and Red fill */}
            <div className="w-full h-3 rounded-full bg-slate-100 p-0.5 ring-1 ring-amber-400 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-[#e51c24] to-[#e51c24] transition-all duration-500"
                style={{ width: `${Math.max(skuPercentage, 5)}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => onSelectTab('sku')}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#e51c24] hover:bg-[#c9141b] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform border border-amber-400"
          >
            <span>Uji Sekarang</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Action Grid (Android Material Grid) */}
      <div>
        <div className="flex items-center justify-between px-1 mb-2.5">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#e51c24]" />
            Menu Utama Ambalan
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Sentuh untuk buka</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={action.action}
                className="bg-white p-3.5 rounded-2xl border-2 border-slate-100 hover:border-amber-400 hover:shadow-md transition-all text-left group active:scale-98 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${action.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#e51c24] transition-colors leading-snug">
                    {action.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                    {action.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dasa Darma Focus Card */}
      <div className="bg-white rounded-2xl p-4 border-2 border-amber-400/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-100 text-[#e51c24] flex items-center justify-center">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Refleksi Dasa Darma ke-{dasaDarmaList[darmaIndex].no}</h4>
              <p className="text-[10px] text-slate-500">Pedoman Moral Pramuka Penegak</p>
            </div>
          </div>
          <button
            onClick={() => setDarmaIndex((prev) => (prev + 1) % dasaDarmaList.length)}
            className="text-[11px] font-bold text-[#e51c24] hover:text-[#b31218] px-2 py-1 rounded-lg bg-red-50 border border-amber-300 hover:bg-red-100 transition-colors"
          >
            Berikutnya ➔
          </button>
        </div>

        <div className="p-3 rounded-xl bg-gradient-to-r from-red-50/50 via-white to-amber-50/50 border border-amber-200">
          <p className="text-xs sm:text-sm font-semibold text-slate-800 italic">
            "{dasaDarmaList[darmaIndex].no}. {dasaDarmaList[darmaIndex].text}"
          </p>
        </div>
      </div>

      {/* Jadwal Kegiatan Terdekat */}
      <div className="bg-white rounded-2xl p-4 border-2 border-slate-100 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#e51c24]" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Agenda Ambalan Terdekat
            </h3>
          </div>
          <button
            onClick={() => onSelectTab('agenda')}
            className="text-xs font-bold text-[#e51c24] hover:underline flex items-center gap-0.5"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {INITIAL_EVENTS.slice(0, 2).map((ev) => (
            <div
              key={ev.id}
              className="p-3 rounded-xl border-l-4 border-l-[#e51c24] border-t border-r border-b border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900">{ev.title}</h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                  {ev.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 flex items-center gap-2">
                <span className="font-semibold text-[#e51c24]">📅 {ev.date}</span>
                <span>•</span>
                <span>⏰ {ev.time}</span>
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">📍 {ev.location}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filosofi Pusaka Ambalan Teaser */}
      <div className="bg-gradient-to-r from-red-600 to-[#e51c24] text-white rounded-2xl p-4 border-2 border-amber-400 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white p-1 ring-2 ring-amber-300 shrink-0">
            <img src={LOGO_IMAGE_PATH} alt="Ambalan Emblem" className="w-full h-full object-contain" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono">
              Kearifan Lokal
            </span>
            <h4 className="text-xs sm:text-sm font-extrabold mt-1">
              Makna Badik, Sayap 10 Helai & Aksara Lontara
            </h4>
            <p className="text-[11px] text-white/90 line-clamp-2 mt-0.5">
              Pelajari kiasan dasar lambang Ambalan La Surullah Petta Lopo dan sejarah keteladanan Siri' na Pacce.
            </p>
          </div>
        </div>
        <button
          onClick={() => onSelectTab('profil')}
          className="mt-3 w-full py-2 rounded-xl bg-white hover:bg-amber-50 text-[#e51c24] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <span>Buka Filosofi Lambang & Tokoh</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
