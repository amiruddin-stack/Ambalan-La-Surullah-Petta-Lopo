import React from 'react';
import { ClipboardList, MessageCircle, BookOpen, Users } from 'lucide-react';
import { ActiveMenu } from '../../types';

interface Props { onNavigate: (menu: ActiveMenu) => void; }
export const DewanAmbalanWorkspaceView: React.FC<Props> = ({ onNavigate }) => (
  <div className="space-y-4 pb-24">
    <div className="rounded-3xl bg-[#e51c24] text-white p-5 shadow-sm"><span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Area pengurus</span><h2 className="text-xl font-black mt-1">Ruang Kerja Dewan Ambalan</h2><p className="text-xs text-white/85 mt-2">Ruang koordinasi dan akses kerja pengurus Ambalan La Surullah Petta Lopo.</p></div>
    <div className="grid grid-cols-2 gap-3">
      {[{label:'Program Kerja',desc:'Kelola agenda dan kegiatan',icon:<ClipboardList/>,menu:'program_kerja' as ActiveMenu},{label:'Obrolan Ambalan',desc:'Koordinasi pengurus',icon:<MessageCircle/>,menu:'chat' as ActiveMenu},{label:'Ruang Belajar',desc:'Materi dan kuis',icon:<BookOpen/>,menu:'ruang_belajar' as ActiveMenu},{label:'Database Anggota',desc:'Data anggota pangkalan',icon:<Users/>,menu:'database' as ActiveMenu}].map(item => <button key={item.menu} onClick={() => onNavigate(item.menu)} className="bg-white border border-slate-200 rounded-2xl p-4 text-left shadow-sm"><span className="w-10 h-10 rounded-xl bg-red-50 text-[#e51c24] flex items-center justify-center">{item.icon}</span><strong className="block text-sm mt-3 text-slate-900">{item.label}</strong><span className="block text-[11px] text-slate-500 mt-1">{item.desc}</span></button>)}
    </div>
  </div>
);
