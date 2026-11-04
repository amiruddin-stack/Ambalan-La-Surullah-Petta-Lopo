import React, { useMemo, useState } from 'react';
import { Users, ShieldCheck, Flag, Crown, ChevronRight, ArrowLeft } from 'lucide-react';
import { UserAccount } from '../../types';

type ExploreSection = 'menu' | 'mabigus' | 'anggota' | 'sangga' | 'dewan';
interface Props { allMembers: UserAccount[]; }
const SANGGA = ['Perintis', 'Penegas', 'Pendobrak', 'Pencoba', 'Pelaksana'];
const BOARD = [
  { jabatan: 'Pradana Putra', nama: 'Amiruddin S.', gudep: '10-035' },
  { jabatan: 'Pradana Putri', nama: 'Siti Nur Aisyah', gudep: '10-036' },
  { jabatan: 'Kerani (Sekretaris)', nama: 'Muh. Fikri Haikal', gudep: '10-035/036' },
  { jabatan: 'Hartaka (Bendahara)', nama: 'Nur Fadilah', gudep: '10-035/036' },
  { jabatan: 'Pemangku Adat', nama: 'Andi Baso Pratama', gudep: '10-035/036' }
];

export const JelajahiAmbalanView: React.FC<Props> = ({ allMembers }) => {
  const [section, setSection] = useState<ExploreSection>('menu');
  const [unit, setUnit] = useState<'Putra' | 'Putri'>('Putra');
  const [selectedSangga, setSelectedSangga] = useState('Perintis');
  const members = useMemo(() => allMembers.filter(m => m.satuan === unit), [allMembers, unit]);
  const sanggaMembers = useMemo(() => members.filter(m => m.sangga === selectedSangga), [members, selectedSangga]);
  const leaders = allMembers.filter(m => m.role === 'admin' || /mabigus|ketua gugus|pembina|pembantu pembina/i.test(m.jabatan || ''));
  const card = (title: string, subtitle: string, icon: React.ReactNode, target: ExploreSection) => (
    <button key={target} onClick={() => setSection(target)} className="w-full bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 text-left shadow-sm active:scale-[.99]">
      <span className="w-11 h-11 rounded-xl bg-red-50 text-[#e51c24] flex items-center justify-center shrink-0">{icon}</span>
      <span className="min-w-0 flex-1"><strong className="block text-sm font-extrabold text-slate-900">{title}</strong><span className="block text-xs text-slate-500 mt-0.5">{subtitle}</span></span>
      <ChevronRight className="w-4 h-4 text-slate-400" />
    </button>
  );
  const roleName = (role: string) => {
    const found = leaders.find(m => role === 'Pembina' ? /pembina/i.test(m.jabatan || '') : role === 'Ketua Gugus Depan' ? /ketua gugus/i.test(m.jabatan || '') : (m.jabatan || '').toLowerCase().includes(role.toLowerCase()));
    return found?.nama || 'Data belum diisi';
  };
  return <section className="space-y-3">
    <div className="flex items-center justify-between px-1">
      <div><span className="text-[10px] font-bold uppercase tracking-wider text-[#e51c24]">Kenali pangkalan</span><h3 className="text-base font-black text-slate-900">Jelajahi Ambalan</h3></div>
      {section !== 'menu' && <button onClick={() => setSection('menu')} className="flex items-center gap-1 text-xs font-bold text-slate-600"><ArrowLeft className="w-4 h-4"/> Kembali</button>}
    </div>
    {section === 'menu' && <div className="grid grid-cols-1 gap-2.5">
      {card('Mabigus', 'Majelis Pembimbing dan jajaran pembina', <ShieldCheck className="w-5 h-5"/>, 'mabigus')}
      {card('Anggota', 'Daftar anggota satuan Putra dan Putri', <Users className="w-5 h-5"/>, 'anggota')}
      {card('Sangga', 'Daftar sangga dan anggotanya', <Flag className="w-5 h-5"/>, 'sangga')}
      {card('Dewan Ambalan', 'Susunan pengurus Dewan Ambalan saat ini', <Crown className="w-5 h-5"/>, 'dewan')}
    </div>}
    {section === 'mabigus' && <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
      <h4 className="font-black text-sm">Majelis Pembimbing Gugus Depan</h4>
      {['Majelis Pembimbing Gugus Depan','Ketua Gugus Depan','Pembina','Pembantu Pembina Putra','Pembantu Pembina Putri'].map(role => <div key={role} className="py-2 border-b border-slate-100 last:border-0"><span className="block text-[10px] uppercase tracking-wide text-slate-400 font-bold">{role}</span><strong className="text-sm text-slate-800">{role === 'Majelis Pembimbing Gugus Depan' ? roleName('mabigus') : roleName(role)}</strong></div>)}
    </div>}
    {(section === 'anggota' || section === 'sangga') && <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
      <div className="grid grid-cols-2 gap-2">{(['Putra','Putri'] as const).map(v => <button key={v} onClick={() => setUnit(v)} className={`rounded-xl py-2.5 text-xs font-extrabold ${unit === v ? 'bg-[#e51c24] text-white' : 'bg-slate-100 text-slate-600'}`}>{v}</button>)}</div>
      {section === 'sangga' && <><div className="grid grid-cols-5 gap-1">{SANGGA.map(s => <button key={s} onClick={() => setSelectedSangga(s)} className={`rounded-lg px-1 py-2 text-[10px] font-bold ${selectedSangga === s ? 'bg-red-100 text-[#e51c24]' : 'bg-slate-50 text-slate-600'}`}>{s}</button>)}</div><h4 className="text-sm font-black">Sangga {selectedSangga} · {unit}</h4></>}
      {section === 'anggota' && <h4 className="text-sm font-black">Anggota {unit} · {members.length}</h4>}
      {(section === 'anggota' ? members : sanggaMembers).length === 0 ? <p className="text-xs text-slate-500 py-3">Belum ada data anggota untuk pilihan ini.</p> : (section === 'anggota' ? members : sanggaMembers).map((m,i) => <div key={m.uid || m.username || i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"><div><strong className="block text-sm text-slate-800">{m.nama}</strong><span className="text-xs text-slate-500">{m.jabatan}</span></div><span className="text-[10px] font-bold text-slate-500">{m.sangga}</span></div>)}
    </div>}
    {section === 'dewan' && <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3"><h4 className="font-black text-sm">Susunan Dewan Ambalan</h4>{BOARD.map(item => <div key={item.jabatan} className="py-2 border-b border-slate-100 last:border-0"><span className="block text-[10px] uppercase tracking-wide text-slate-400 font-bold">{item.jabatan}</span><strong className="text-sm text-slate-800">{item.nama}</strong><span className="block text-xs text-slate-500">Gudep {item.gudep}</span></div>)}</div>}
  </section>;
};
