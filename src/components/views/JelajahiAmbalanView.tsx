import React, { useMemo, useState } from 'react';
import { Users, ShieldCheck, Flag, Crown, ChevronRight, ArrowLeft } from 'lucide-react';
import { UserAccount } from '../../types';

type ExploreSection = 'menu' | 'mabigus' | 'anggota' | 'sangga' | 'dewan';
interface Props { allMembers: UserAccount[]; }
const SANGGA = ['Perintis', 'Penegas', 'Pendobrak', 'Pencoba', 'Pelaksana'];
const MABIGUS_ROLES = [
  { label: 'Majelis Pembimbing Gugus Depan', match: /majelis pembimbing|mabigus/i },
  { label: 'Ketua Gugus Depan', match: /ketua gugus depan|ketua gudep/i },
  { label: 'Pembina', match: /^pembina( gugus depan)?$/i },
  { label: 'Pembantu Pembina Putra', match: /pembantu pembina.*putra/i },
  { label: 'Pembantu Pembina Putri', match: /pembantu pembina.*putri/i }
];

export const JelajahiAmbalanView: React.FC<Props> = ({ allMembers }) => {
  const [section, setSection] = useState<ExploreSection>('menu');
  const [unit, setUnit] = useState<'Putra' | 'Putri'>('Putra');
  const members = useMemo(() => allMembers.filter(m => m.satuan === unit), [allMembers, unit]);
  const boardMembers = useMemo(
    () => allMembers.filter(m => /pradana|kerani|hartaka|bendahara|pemangku adat|dewan ambalan/i.test(m.jabatan || '')),
    [allMembers]
  );
  const card = (title: string, subtitle: string, icon: React.ReactNode, target: ExploreSection) => (
    <button key={target} onClick={() => setSection(target)} className="w-full bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 text-left shadow-sm active:scale-[.99]">
      <span className="w-11 h-11 rounded-xl bg-red-50 text-[#e51c24] flex items-center justify-center shrink-0">{icon}</span>
      <span className="min-w-0 flex-1"><strong className="block text-sm font-extrabold text-slate-900">{title}</strong><span className="block text-xs text-slate-500 mt-0.5">{subtitle}</span></span>
      <ChevronRight className="w-4 h-4 text-slate-400" />
    </button>
  );
  const unitSwitch = <div className="grid grid-cols-2 gap-2">{(['Putra','Putri'] as const).map(v => <button key={v} onClick={() => setUnit(v)} className={`rounded-xl py-2.5 text-xs font-extrabold ${unit === v ? 'bg-[#e51c24] text-white' : 'bg-slate-100 text-slate-600'}`}>{v}</button>)}</div>;
  const memberRow = (m: UserAccount, i: number) => <div key={m.uid || m.username || i} className="flex items-center justify-between gap-2 py-2.5 border-b border-slate-100 last:border-0"><div className="min-w-0"><strong className="block text-sm text-slate-800">{m.nama}</strong><span className="text-xs text-slate-500">{m.jabatan || m.tingkat}</span></div><span className="text-[10px] font-bold text-slate-500 shrink-0">Gudep {m.gudep}</span></div>;
  return <section className="space-y-3">
    <div className="flex items-center justify-between px-1">
      <div><span className="text-[10px] font-bold uppercase tracking-wider text-[#e51c24]">Kenali pangkalan</span><h3 className="text-base font-black text-slate-900">Jelajahi Ambalan</h3></div>
      {section !== 'menu' && <button onClick={() => setSection('menu')} className="flex items-center gap-1 text-xs font-bold text-slate-600"><ArrowLeft className="w-4 h-4"/> Kembali</button>}
    </div>
    {section === 'menu' && <div className="grid grid-cols-1 gap-2.5">
      {card('Mabigus', 'Majelis pembimbing, ketua gudep, dan pembina', <ShieldCheck className="w-5 h-5"/>, 'mabigus')}
      {card('Anggota', 'Daftar seluruh anggota Putra dan Putri', <Users className="w-5 h-5"/>, 'anggota')}
      {card('Sangga', 'Daftar sangga berdasarkan satuan', <Flag className="w-5 h-5"/>, 'sangga')}
      {card('Dewan Ambalan', 'Susunan Dewan Ambalan saat ini', <Crown className="w-5 h-5"/>, 'dewan')}
    </div>}
    {section === 'mabigus' && <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
      <h4 className="font-black text-sm">Majelis Pembimbing Gugus Depan</h4>
      {MABIGUS_ROLES.map(role => {
        const found = allMembers.filter(m => role.match.test(m.jabatan || ''));
        return <div key={role.label} className="py-2 border-b border-slate-100 last:border-0"><span className="block text-[10px] uppercase tracking-wide text-slate-400 font-bold">{role.label}</span>{found.length ? found.map((m,i) => <strong key={m.uid || i} className="block text-sm text-slate-800 mt-1">{m.nama}</strong>) : <span className="block text-sm text-slate-400 mt-1">Data belum diisi</span>}</div>;
      })}
    </div>}
    {section === 'anggota' && <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
      {unitSwitch}
      <h4 className="text-sm font-black">Anggota {unit} · {members.length}</h4>
      {members.length ? members.map(memberRow) : <p className="text-xs text-slate-500 py-3">Belum ada data anggota {unit}.</p>}
    </div>}
    {section === 'sangga' && <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
      {unitSwitch}
      <h4 className="text-sm font-black">Sangga {unit}</h4>
      {SANGGA.map(name => {
        const sanggaMembers = members.filter(m => m.sangga === name);
        return <div key={name} className="rounded-xl border border-slate-100 p-3"><div className="flex items-center justify-between"><strong className="text-sm text-slate-800">Sangga {name}</strong><span className="text-[10px] text-slate-400">{sanggaMembers.length} anggota</span></div>{sanggaMembers.length ? sanggaMembers.map(memberRow) : <p className="text-xs text-slate-400 mt-2">Belum ada anggota terdaftar.</p>}</div>;
      })}
    </div>}
    {section === 'dewan' && <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3"><h4 className="font-black text-sm">Susunan Dewan Ambalan Saat Ini</h4>{boardMembers.length ? boardMembers.map(memberRow) : <p className="text-xs text-slate-500 py-3">Data Dewan Ambalan belum diisi.</p>}</div>}
  </section>;
};
