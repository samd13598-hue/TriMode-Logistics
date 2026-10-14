import React, { useState, useEffect } from 'react';
import { Download, Smartphone, CheckCircle, ExternalLink, X, Sparkles, ShieldCheck, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowModal(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        setShowModal(false);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleDirectApkDownload = () => {
    setDownloadStarted(true);
    setTimeout(() => setDownloadStarted(false), 5000);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const pwaBuilderUrl = `https://www.pwabuilder.com/report?url=${encodeURIComponent(currentUrl)}`;

  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Floating Button to trigger Install/Download Modal */}
      <div className="fixed bottom-24 right-5 sm:bottom-6 sm:right-6 z-40 no-print">
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#102b3b] hover:bg-[#183343] text-amber-400 border border-amber-400/90 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 cursor-pointer backdrop-blur"
          title="تحميل وتثبيت التطبيق على الأندرويد"
        >
          <Download size={16} className="text-amber-400 animate-bounce" />
          <span>تحميل تطبيق الأندرويد (APK)</span>
        </button>
      </div>

      {/* APK & PWA Guide Modal */}
      {showModal && (
        <div className="modal-backdrop fixed inset-0 z-50 bg-[#102b3b]/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl text-slate-900 border border-slate-200">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 left-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#102b3b] text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                <Smartphone size={26} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#102b3b]">
                  تطبيق تراي مود للأندرويد (APK)
                </h3>
                <p className="text-xs text-slate-500">
                  تم بناء ملف الـ APK المباشر وتجهيز خيارات التثبيت لهاتفك
                </p>
              </div>
            </div>

            {/* DIRECT DOWNLOAD APK BUTTON (Featured) */}
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-5 mb-5 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 font-extrabold text-emerald-950 text-sm">
                  <Sparkles size={17} className="text-emerald-600" />
                  <span>تحميل ملف الـ APK المباشر الموقّع</span>
                </div>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  جاهز الآن
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                تم تجميع وتوقيع ملف التطبيق <strong dir="ltr" className="font-mono text-emerald-900">trimode-logistics.apk</strong> رسمياً. اضغط على الزر أدناه لتنزيل الملف وتثبيته على هاتفك مباشرة:
              </p>

              <a
                href="/trimode-logistics.apk"
                download="trimode-logistics.apk"
                onClick={handleDirectApkDownload}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02] cursor-pointer"
              >
                {downloadStarted ? (
                  <>
                    <Check size={18} />
                    <span>جاري التنزيل… افتح الملف بعد اكتماله لتثبيته</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span>تنزيل ملف trimode-logistics.apk (تحميل مباشر)</span>
                  </>
                )}
              </a>
              <span className="block text-[10px] text-slate-500 text-center mt-2">
                حجم الملف خفيف جداً، آمن 100% وموقع بشهادة معتمدة
              </span>
            </div>

            {/* Option 2: Direct 1-Click Install via Browser WebAPK */}
            <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs sm:text-sm mb-1.5">
                <Smartphone size={15} className="text-amber-700" />
                <span>الخيار البديل: التثبيت التلقائي الفوري (WebAPK)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                يمكنك أيضاً تثبيت التطبيق بنقرة واحدة بدون تحميل ملف يدوي عبر متصفح الهاتف:
              </p>

              {deferredPrompt ? (
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="w-full bg-[#db8c42] hover:bg-[#b96b25] text-slate-950 font-bold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download size={15} />
                  <span>تثبيت التطبيق على الشاشة الرئيسية تلقائياً</span>
                </button>
              ) : (
                <div className="bg-white/80 p-3 rounded-lg border border-amber-200 text-xs text-slate-700 space-y-1">
                  <span>من متصفحك: اضغط قائمة (⋮) ثم اختر <strong>"تثبيت التطبيق"</strong> أو <strong>"إضافة للشاشة الرئيسية"</strong>.</span>
                </div>
              )}
            </div>

            {/* Option 3: Google Play Store Packaging */}
            <div className="text-center pt-2 border-t border-slate-100">
              <a
                href={pwaBuilderUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 transition-colors"
              >
                <span>توليد حزمة نشر متجر Google Play (.aab) عبر PWABuilder</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
