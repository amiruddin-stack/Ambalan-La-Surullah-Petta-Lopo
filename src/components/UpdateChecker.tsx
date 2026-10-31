import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Download, X, RefreshCw, Smartphone } from 'lucide-react';

const CURRENT_VERSION = '1.0.0';
const RELEASES_API = 'https://api.github.com/repos/amiruddin-stack/Ambalan-La-Surullah-Petta-Lopo/releases/latest';

type ReleaseInfo = {
  tag_name?: string;
  name?: string;
  body?: string;
  html_url?: string;
  assets?: Array<{ name: string; browser_download_url: string }>;
};

function compareVersions(a: string, b: string) {
  const left = a.replace(/^v/i, '').split('.').map(Number);
  const right = b.replace(/^v/i, '').split('.').map(Number);
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const x = left[i] || 0;
    const y = right[i] || 0;
    if (x !== y) return x - y;
  }
  return 0;
}

export function UpdateChecker() {
  const [release, setRelease] = useState<ReleaseInfo | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkForUpdate() {
      try {
        const response = await fetch(RELEASES_API, {
          headers: { Accept: 'application/vnd.github+json' },
          cache: 'no-store',
        });
        if (!response.ok) return;
        const latest: ReleaseInfo = await response.json();
        const latestVersion = (latest.tag_name || '').replace(/^v/i, '');
        if (!latestVersion || compareVersions(latestVersion, CURRENT_VERSION) <= 0) return;

        const apk = latest.assets?.find((asset) => asset.name.toLowerCase().endsWith('.apk'));
        if (!apk || !active) return;

        setRelease({ ...latest, assets: [apk] });
        setVisible(true);

        if (Capacitor.isNativePlatform()) {
          const lastNotified = localStorage.getItem('pettalopo_last_update_notification');
          if (lastNotified !== latestVersion) {
            const permission = await LocalNotifications.checkPermissions();
            const granted = permission.display === 'granted'
              ? permission
              : await LocalNotifications.requestPermissions();

            if (granted.display === 'granted') {
              await LocalNotifications.schedule({
                notifications: [{
                  id: 7301,
                  title: 'Pembaruan Pettalopo Mobile tersedia',
                  body: `Versi terbaru ${latestVersion} sudah tersedia. Ketuk untuk melihat pembaruan.`,
                  schedule: { at: new Date(Date.now() + 1000) },
                  extra: { url: apk.browser_download_url },
                }],
              });
              localStorage.setItem('pettalopo_last_update_notification', latestVersion);
            }
          }
        }
      } catch (error) {
        console.warn('Pemeriksaan pembaruan Pettalopo tidak berhasil:', error);
      }
    }

    checkForUpdate();
    return () => { active = false; };
  }, []);

  if (!visible || !release) return null;

  const apkUrl = release.assets?.[0]?.browser_download_url;
  const version = (release.tag_name || '').replace(/^v/i, '');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-5 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-2xl">
        <div className="relative bg-gradient-to-br from-emerald-700 to-green-600 px-6 pb-7 pt-6 text-white">
          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label="Tutup pemberitahuan"
            className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"
          >
            <X size={18} />
          </button>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
            <Smartphone size={29} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">Pettalopo Mobile</p>
          <h2 className="mt-1 text-2xl font-bold">Pembaruan tersedia</h2>
          <p className="mt-2 text-sm leading-relaxed text-emerald-50">Versi terbaru aplikasi sudah siap digunakan.</p>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
            <span className="text-slate-500">Versi terbaru</span>
            <span className="font-bold text-emerald-700">v{version}</span>
          </div>
          {release.body && (
            <div className="max-h-28 overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {release.body}
            </div>
          )}
          <button
            type="button"
            disabled={!apkUrl}
            onClick={() => apkUrl && window.open(apkUrl, '_blank')}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800 disabled:opacity-50"
          >
            <Download size={18} />
            Unduh Pembaruan
          </button>
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
          >
            <RefreshCw size={15} />
            Nanti saja
          </button>
          <p className="text-center text-[11px] leading-relaxed text-slate-400">
            Setelah unduhan selesai, buka file APK dan ikuti petunjuk pemasangan Android.
          </p>
        </div>
      </div>
    </div>
  );
}
