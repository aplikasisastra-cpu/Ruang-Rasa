import React, { useState } from 'react';
import { 
  X, 
  Mic, 
  Video, 
  Image as ImageIcon, 
  Volume2, 
  Check, 
  Sliders, 
  Sparkles,
  Camera
} from 'lucide-react';
import { VIRTUAL_BACKGROUNDS, VirtualBackground } from '../data/virtualBackgrounds';
import { playSound } from '../utils/audioEffects';

interface SettingsModalProps {
  initialTab?: 'audio' | 'video' | 'background';
  currentBgId: string;
  onSelectBackground: (bg: VirtualBackground) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  initialTab = 'video',
  currentBgId,
  onSelectBackground,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'audio' | 'video' | 'background'>(initialTab);
  const [isNoiseSuppressionOn, setIsNoiseSuppressionOn] = useState(true);
  const [isHdEnabled, setIsHdEnabled] = useState(true);
  const [isMirrorEnabled, setIsMirrorEnabled] = useState(true);
  const [isLowLightBoost, setIsLowLightBoost] = useState(true);

  const selectedBg = VIRTUAL_BACKGROUNDS.find((b) => b.id === currentBgId) || VIRTUAL_BACKGROUNDS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[520px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-52 bg-slate-950/80 border-b md:border-b-0 md:border-r border-slate-800 p-3 flex md:flex-col gap-1 shrink-0">
          <div className="hidden md:block px-3 py-2 font-bold text-white text-sm">
            Pengaturan
          </div>

          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer w-full text-left ${
              activeTab === 'video'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video & Kamera</span>
          </button>

          <button
            onClick={() => setActiveTab('background')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer w-full text-left ${
              activeTab === 'background'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Latar Belakang Virtual</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer w-full text-left ${
              activeTab === 'audio'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Audio & Suara</span>
          </button>
        </div>

        {/* Content Panel */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-900">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <h4 className="font-bold text-white text-sm">
              {activeTab === 'video' && 'Pengaturan Kamera Video'}
              {activeTab === 'background' && 'Latar Belakang Virtual (Background Zoom)'}
              {activeTab === 'audio' && 'Pengaturan Mikrofon & Speaker'}
            </h4>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin">
            {/* TAB: VIRTUAL BACKGROUND */}
            {activeTab === 'background' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  Pilih latar belakang virtual untuk mengaburkan atau mengganti pemandangan ruangan asli Anda selama konferensi video.
                </p>

                {/* Preview Box */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-700/80 flex items-center justify-center shadow-inner">
                  {selectedBg.type === 'image' && selectedBg.url ? (
                    <img
                      src={selectedBg.url}
                      alt={selectedBg.name}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : selectedBg.type === 'blur' ? (
                    <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-xl" />
                  ) : null}

                  <div className="relative z-10 flex flex-col items-center gap-2 p-3 bg-slate-950/70 rounded-xl backdrop-blur-md border border-slate-700/60">
                    <Camera className="w-8 h-8 text-blue-400" />
                    <span className="text-xs font-semibold text-white">
                      Latar Terpilih: {selectedBg.name}
                    </span>
                  </div>
                </div>

                {/* Background Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {VIRTUAL_BACKGROUNDS.map((bg) => {
                    const isSelected = bg.id === currentBgId;
                    return (
                      <button
                        key={bg.id}
                        onClick={() => onSelectBackground(bg)}
                        className={`group relative rounded-xl overflow-hidden border p-2 text-left cursor-pointer transition-all aspect-video flex flex-col justify-end ${
                          isSelected
                            ? 'border-blue-500 ring-2 ring-blue-500/40 bg-slate-800'
                            : 'border-slate-800 hover:border-slate-700 bg-slate-850'
                        }`}
                      >
                        {bg.type === 'image' && bg.url ? (
                          <img
                            src={bg.url}
                            alt={bg.name}
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : bg.type === 'blur' ? (
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-slate-900 backdrop-blur-sm" />
                        ) : (
                          <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-500 text-xs">
                            None
                          </div>
                        )}

                        <div className="relative z-10 bg-slate-950/80 px-2 py-1 rounded text-[11px] font-medium text-slate-200 backdrop-blur-md flex items-center justify-between">
                          <span className="truncate">{bg.name}</span>
                          {isSelected && <Check className="w-3 h-3 text-blue-400 shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: VIDEO */}
            {activeTab === 'video' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer">
                    <div>
                      <span className="text-xs font-semibold text-white block">Video Kualitas Ultra HD (1080p)</span>
                      <span className="text-[11px] text-slate-400">Streaming video jernih berdefinisi tinggi hingga 60fps</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isHdEnabled}
                      onChange={(e) => setIsHdEnabled(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded bg-slate-700 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer">
                    <div>
                      <span className="text-xs font-semibold text-white block">Cerminkan Video Saya (Mirror My Video)</span>
                      <span className="text-[11px] text-slate-400">Pembalikan sudut pandang tampilan kamera lokal secara horizontal</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isMirrorEnabled}
                      onChange={(e) => setIsMirrorEnabled(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded bg-slate-700 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer">
                    <div>
                      <span className="text-xs font-semibold text-white block">Peningkatan Cahaya Rendah Otomatis</span>
                      <span className="text-[11px] text-slate-400">Menyesuaikan eksposur wajah saat berada di ruangan redup</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isLowLightBoost}
                      onChange={(e) => setIsLowLightBoost(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded bg-slate-700 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* TAB: AUDIO */}
            {activeTab === 'audio' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white block">Uji Speaker / Suara</span>
                      <span className="text-[11px] text-slate-400">Putar nada uji untuk memeriksa perangkat keluaran suara</span>
                    </div>
                    <button
                      onClick={() => playSound.doorbell()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Uji Suara</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white block">Peredam Bising Latar AI (Noise Suppression)</span>
                      <span className="text-[11px] text-slate-400">Hilangkan suara ketukan keyboard, hembusan angin, dan kebisingan sekitar</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isNoiseSuppressionOn}
                      onChange={(e) => setIsNoiseSuppressionOn(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded bg-slate-700 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <span className="text-xs font-semibold text-slate-300 block">Level Masukan Mikrofon</span>
                  <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden flex gap-0.5">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-full rounded-xs ${
                          i < 12 ? 'bg-emerald-500' : i < 16 ? 'bg-amber-400' : 'bg-rose-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-850 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              Simpan & Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
