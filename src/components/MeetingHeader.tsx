import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Grid, 
  User, 
  Maximize, 
  Minimize, 
  Copy, 
  Check, 
  Wifi, 
  Clock, 
  Lock 
} from 'lucide-react';
import { ViewMode, MeetingDetails } from '../types/meeting';

interface MeetingHeaderProps {
  meetingDetails: MeetingDetails;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  durationSeconds: number;
  totalParticipants: number;
}

export const MeetingHeader: React.FC<MeetingHeaderProps> = ({
  meetingDetails,
  viewMode,
  onViewModeChange,
  durationSeconds,
  totalParticipants,
}) => {
  const [showInfoDropdown, setShowInfoDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const formatDuration = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(meetingDetails.inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <header className="relative z-30 h-14 bg-slate-900/95 border-b border-slate-800/80 px-3 sm:px-5 flex items-center justify-between select-none backdrop-blur-md">
      {/* Zone 1: Meeting Info & Security Shield */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowInfoDropdown(!showInfoDropdown)}
            title="Informasi Rapat & Keamanan"
            className="flex items-center gap-1.5 p-1.5 px-2.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-700/60 text-emerald-400 text-xs font-medium transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Info Rapat</span>
          </button>

          {/* Meeting Information Popover */}
          {showInfoDropdown && (
            <div 
              onMouseLeave={() => setShowInfoDropdown(false)}
              className="absolute left-0 top-11 w-80 bg-slate-900/98 border border-slate-700/90 rounded-2xl shadow-2xl p-4 text-xs z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Enkripsi End-to-End</h4>
                    <span className="text-[11px] text-emerald-400">Terproteksi 256-bit AES</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div>
                  <span className="text-[11px] text-slate-400">Topik Rapat</span>
                  <p className="font-medium text-slate-200">{meetingDetails.topic}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">ID Pertemuan</span>
                    <span className="font-mono text-slate-100 font-semibold tracking-wide">
                      {meetingDetails.id}
                    </span>
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">Kode Sandi</span>
                    <span className="font-mono text-slate-100 font-semibold">
                      {meetingDetails.passcode}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400">Host Penyelenggara</span>
                  <p className="text-slate-300 font-medium">{meetingDetails.hostName}</p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Tautan Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Tautan Undangan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Meeting Topic Name */}
        <div className="hidden md:flex flex-col">
          <span className="font-semibold text-sm text-slate-100 truncate max-w-xs">
            {meetingDetails.topic}
          </span>
          <span className="text-[11px] text-slate-400">
            Kapasitas: <strong className="text-slate-200">100 Orang</strong> · Terhubung: <strong className="text-blue-400">{totalParticipants} Peserta</strong>
          </span>
        </div>
      </div>

      {/* Zone 2: Unlimited Duration Banner & Timer */}
      <div className="flex items-center gap-2 sm:gap-3 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-full">
        <Clock className="w-4 h-4 text-emerald-400" />
        <span className="font-mono tabular-nums font-semibold text-sm text-white">
          {formatDuration(durationSeconds)}
        </span>
        <span className="text-slate-600 hidden sm:inline">|</span>
        <span className="text-[11px] font-medium text-emerald-400 hidden sm:inline">
          Durasi Tanpa Batas Waktu
        </span>
      </div>

      {/* Zone 3: View Mode Switcher, Signal, Fullscreen */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Network Signal */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px]">HD 1080p (14ms)</span>
        </div>

        {/* View Mode Toggle (Gallery vs Speaker) */}
        <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700/70">
          <button
            onClick={() => onViewModeChange('gallery')}
            title="Tampilan Galeri (Grid 100 Peserta)"
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'gallery'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Galeri</span>
          </button>
          <button
            onClick={() => onViewModeChange('speaker')}
            title="Tampilan Pembicara Aktif"
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'speaker'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Pembicara</span>
          </button>
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
