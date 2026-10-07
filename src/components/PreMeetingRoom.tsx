import React, { useRef, useEffect, useState } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Settings, 
  Sparkles, 
  Users, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Camera
} from 'lucide-react';
import { VIRTUAL_BACKGROUNDS, VirtualBackground } from '../data/virtualBackgrounds';

interface PreMeetingRoomProps {
  userName: string;
  onUpdateUserName: (name: string) => void;
  localStream: MediaStream | null;
  isVideoOn: boolean;
  isMuted: boolean;
  selectedBg: VirtualBackground;
  onToggleVideo: () => void;
  onToggleMic: () => void;
  onSelectBackground: (bg: VirtualBackground) => void;
  onJoinMeeting: () => void;
  onCancel: () => void;
}

export const PreMeetingRoom: React.FC<PreMeetingRoomProps> = ({
  userName,
  onUpdateUserName,
  localStream,
  isVideoOn,
  isMuted,
  selectedBg,
  onToggleVideo,
  onToggleMic,
  onSelectBackground,
  onJoinMeeting,
  onCancel,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showBgPicker, setShowBgPicker] = useState(false);

  useEffect(() => {
    if (videoRef.current && localStream && isVideoOn) {
      videoRef.current.srcObject = localStream;
      videoRef.current.play().catch(() => {});
    }
  }, [localStream, isVideoOn]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Video Camera Preview */}
        <div className="flex-1 p-6 flex flex-col justify-between bg-slate-950 relative min-h-[340px]">
          {/* Virtual Background layer */}
          {selectedBg.type === 'image' && selectedBg.url && isVideoOn && (
            <div
              className="absolute inset-0 bg-cover bg-center z-0 filter blur-[1px] brightness-90"
              style={{ backgroundImage: `url(${selectedBg.url})` }}
            />
          )}

          {/* Camera Frame */}
          <div className="relative z-10 w-full flex-1 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
            {isVideoOn && localStream ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover transform -scale-x-100 ${
                  selectedBg.type === 'blur' ? 'backdrop-blur-md' : ''
                }`}
              />
            ) : isVideoOn ? (
              // Live camera requested or loading
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Camera className="w-10 h-10 animate-pulse text-blue-400" />
                <span className="text-xs">Menyiapkan kamera web Anda...</span>
              </div>
            ) : (
              // Video is turned off
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                  {userName.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-xs font-medium text-slate-300">Kamera dinonaktifkan</span>
              </div>
            )}

            {/* Floating Audio Meter */}
            {!isMuted && (
              <div className="absolute bottom-3 left-3 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-700/60 backdrop-blur-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] text-slate-300 font-mono">Mikrofon Aktif</span>
              </div>
            )}
          </div>

          {/* Camera & Mic Action Bar */}
          <div className="relative z-10 flex items-center justify-center gap-3 mt-4">
            <button
              onClick={onToggleMic}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                isMuted
                  ? 'bg-rose-600 text-white shadow-rose-950/40 shadow-lg'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
              <span>{isMuted ? 'Mikrofon Bisu' : 'Mikrofon Aktif'}</span>
            </button>

            <button
              onClick={onToggleVideo}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                !isVideoOn
                  ? 'bg-rose-600 text-white shadow-rose-950/40 shadow-lg'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {!isVideoOn ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4 text-emerald-400" />}
              <span>{isVideoOn ? 'Kamera Aktif' : 'Kamera Mati'}</span>
            </button>

            <button
              onClick={() => setShowBgPicker(!showBgPicker)}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl cursor-pointer"
              title="Pilih Latar Belakang Virtual"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Latar</span>
            </button>
          </div>

          {/* Virtual Background Quick Drawer */}
          {showBgPicker && (
            <div className="relative z-20 mt-3 p-3 bg-slate-900 border border-slate-700 rounded-xl space-y-2 animate-in fade-in">
              <span className="text-xs font-semibold text-slate-300 block">
                Pilih Latar Belakang Virtual:
              </span>
              <div className="grid grid-cols-5 gap-2">
                {VIRTUAL_BACKGROUNDS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => onSelectBackground(bg)}
                    className={`p-1.5 rounded-lg text-[10px] font-medium border text-center cursor-pointer truncate ${
                      selectedBg.id === bg.id
                        ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                        : 'border-slate-700 hover:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {bg.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Configuration & Join Panel */}
        <div className="w-full md:w-80 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 bg-slate-900">
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Ruang Persiapan Rapat
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                Siap untuk Bergabung?
              </h2>
            </div>

            {/* Feature Highlights */}
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Paket Enterprise Aktif</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>Kapasitas Rapat: <strong>100 Orang</strong></span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Durasi: <strong>Tanpa Batas Waktu</strong></span>
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Nama Tampilan Anda di Rapat
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => onUpdateUserName(e.target.value)}
                placeholder="Masukkan nama Anda..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-6">
            <button
              onClick={onJoinMeeting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-900/40 cursor-pointer transition-colors"
            >
              <span>Masuk ke Rapat Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onCancel}
              className="w-full py-2.5 text-center text-xs text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              Kembali ke Menu Utama
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
