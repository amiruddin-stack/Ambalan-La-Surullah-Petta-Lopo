import React, { useState, useEffect, useRef } from 'react';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { AndroidTopAppBar } from './components/AndroidTopAppBar';
import { AndroidNavigationDrawer } from './components/AndroidNavigationDrawer';
import { AndroidBottomNav } from './components/AndroidBottomNav';
import { AndroidFAB } from './components/AndroidFAB';
import { NotificationsModal } from './components/NotificationsModal';

// Views
import { HomeView } from './components/views/HomeView';
import { SkuTrackerView } from './components/views/SkuTrackerView';
import { SandiMorseView } from './components/views/SandiMorseView';
import { LontaraView } from './components/views/LontaraView';
import { PioneringView } from './components/views/PioneringView';
import { AgendaPresensiView } from './components/views/AgendaPresensiView';
import { ProfilAmbalanView } from './components/views/ProfilAmbalanView';
import { LogbookView } from './components/views/LogbookView';
import { DasaDarmaView } from './components/views/DasaDarmaView';

import { NavigationTab, UserProfile, SkuItem } from './types';
import { DEFAULT_USER_PROFILE, INITIAL_SKU_ITEMS } from './data/scoutData';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isDeviceFrame, setIsDeviceFrame] = useState(true);

  // User Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ambalan_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEFAULT_USER_PROFILE;
  });

  // SKU Items State with LocalStorage
  const [skuItems, setSkuItems] = useState<SkuItem[]>(() => {
    const saved = localStorage.getItem('ambalan_sku_items');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_SKU_ITEMS;
  });

  // Save changes
  useEffect(() => {
    localStorage.setItem('ambalan_user_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('ambalan_sku_items', JSON.stringify(skuItems));
  }, [skuItems]);

  // Audio Context Ref for SOS Morse Whistle
  const audioCtxRef = useRef<AudioContext | null>(null);

  const triggerSosSignal = async () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // SOS Morse pattern: ... --- ...
      const pattern = [
        { type: 'dot', dur: 100 },
        { type: 'dot', dur: 100 },
        { type: 'dot', dur: 100 },
        { type: 'dash', dur: 300 },
        { type: 'dash', dur: 300 },
        { type: 'dash', dur: 300 },
        { type: 'dot', dur: 100 },
        { type: 'dot', dur: 100 },
        { type: 'dot', dur: 100 }
      ];

      for (const p of pattern) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + p.dur / 1000);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        await new Promise(r => setTimeout(r, p.dur));
        try { osc.stop(); osc.disconnect(); } catch {}
        await new Promise(r => setTimeout(r, 100));
      }
    } catch {
      // Audio fallback
    }
  };

  const handleToggleGudep = () => {
    setProfile(prev => ({
      ...prev,
      gudep: prev.gudep === '10-035' ? '10-036' : '10-035',
      gender: prev.gudep === '10-035' ? 'putri' : 'putra',
      jabatan: prev.gudep === '10-035' ? 'Pradana Putri' : 'Pradana Putra'
    }));
  };

  // Title calculation for Top App Bar
  const getTabTitle = () => {
    switch (activeTab) {
      case 'home': return 'Ambalan La Surullah';
      case 'sku': return 'Buku Kontrol SKU';
      case 'sandi': return 'Sandi Morse & Senter';
      case 'lontara': return 'Aksara Lontara Bugis';
      case 'pionering': return 'Tali Temali Pionering';
      case 'agenda': return 'Agenda Kegiatan';
      case 'presensi': return 'Presensi Sangga';
      case 'profil': return 'Filosofi Lambang & Tokoh';
      case 'logbook': return 'Catatan Logbook';
      case 'dasadarma': return 'Tri Satya & Dasa Darma';
      default: return 'Ambalan La Surullah';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 flex flex-col items-center justify-center font-sans antialiased sm:py-4 sm:px-2">
      
      {/* Device Frame Wrapper (Android Frame or Full Web Responsive) */}
      <div className={`w-full transition-all duration-300 ${
        isDeviceFrame 
          ? 'max-w-[440px] sm:h-[900px] sm:max-h-[96vh] sm:rounded-[42px] sm:ring-8 sm:ring-slate-800 sm:shadow-2xl sm:border-4 sm:border-slate-700/60 overflow-hidden flex flex-col bg-white relative' 
          : 'max-w-4xl min-h-screen sm:min-h-0 sm:rounded-3xl bg-white shadow-xl flex flex-col relative overflow-hidden'
      }`}>
        
        {/* Android Status Bar */}
        <AndroidStatusBar />

        {/* Android Top App Bar */}
        <AndroidTopAppBar
          title={getTabTitle()}
          subtitle={`Gudep ${profile.gudep} (${profile.gender === 'putra' ? 'Putra' : 'Putri'})`}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onOpenNotifications={() => setIsNotifOpen(true)}
          isDeviceFrame={isDeviceFrame}
          onToggleDeviceFrame={() => setIsDeviceFrame(!isDeviceFrame)}
        />

        {/* Main View Scroll Area (Dominant White Background with subtle contrast) */}
        <main className="flex-1 overflow-y-auto bg-slate-50/70 p-3.5 sm:p-4 scroll-smooth">
          {activeTab === 'home' && (
            <HomeView
              onSelectTab={setActiveTab}
              profile={profile}
              skuItems={skuItems}
              onOpenQuickMorse={() => setActiveTab('sandi')}
            />
          )}

          {activeTab === 'sku' && (
            <SkuTrackerView
              skuItems={skuItems}
              onUpdateSku={setSkuItems}
              profile={profile}
            />
          )}

          {activeTab === 'sandi' && <SandiMorseView />}

          {activeTab === 'lontara' && <LontaraView />}

          {activeTab === 'pionering' && <PioneringView />}

          {activeTab === 'agenda' && <AgendaPresensiView profile={profile} />}

          {activeTab === 'presensi' && <AgendaPresensiView profile={profile} />}

          {activeTab === 'profil' && <ProfilAmbalanView profile={profile} />}

          {activeTab === 'logbook' && <LogbookView profile={profile} />}

          {activeTab === 'dasadarma' && <DasaDarmaView />}
        </main>

        {/* Android Bottom Navigation */}
        <AndroidBottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* Floating Action Button (FAB) */}
        <AndroidFAB
          onSelectTab={setActiveTab}
          onTriggerSos={triggerSosSignal}
        />

        {/* Android Navigation Drawer (Sidebar) */}
        <AndroidNavigationDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          profile={profile}
          onToggleGudep={handleToggleGudep}
        />

        {/* Notifications Modal */}
        <NotificationsModal
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
        />

        {/* Android Home Bar Indicator at bottom for realistic native look */}
        <div className="w-full py-1 bg-white flex justify-center items-center select-none pointer-events-none">
          <div className="w-28 h-1 bg-slate-300 rounded-full" />
        </div>

      </div>

      {/* Desktop helper caption */}
      <div className="mt-2 text-center text-slate-400 text-[11px] hidden sm:block">
        <span>Aplikasi Berbasis Android • <strong>Ambalan La Surullah Petta Lopo</strong> • Gugus Depan 10-035 & 10-036</span>
      </div>

    </div>
  );
}
