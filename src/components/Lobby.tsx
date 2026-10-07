import React, { useState, useEffect } from 'react';
import { 
  Video, 
  PlusSquare, 
  Calendar, 
  Share2, 
  Clock, 
  Users, 
  ShieldCheck, 
  ChevronRight, 
  Settings, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Play
} from 'lucide-react';

interface LobbyProps {
  onStartNewMeeting: () => void;
  onJoinMeeting: (meetingId: string, name: string) => void;
  onOpenSchedule: () => void;
  onOpenSettings: () => void;
  userEmail: string;
}

export const Lobby: React.FC<LobbyProps> = ({
  onStartNewMeeting,
  onJoinMeeting,
  onOpenSchedule,
  onOpenSettings,
  userEmail,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinId, setJoinId] = useState('');
  const [joinName, setJoinName] = useState('');

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedDate = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinId.trim()) return;
    onJoinMeeting(joinId.trim(), joinName.trim() || 'Tamu Peserta');
    setShowJoinModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none">
      {/* Top Bar Contract (1 line, 3 zones: Brand, Nav links, Action/Profile) */}
      <header className="h-16 px-6 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md flex items-center justify-between z-20">
        {/* Zone 1: Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/40 font-black text-lg">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg text-white tracking-tight">Ruang Rasa</span>
          </div>
        </div>

        {/* Zone 2: Informational Links / Status */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Kapasitas 100 Peserta Aktif</span>
          </div>
          <span className="text-slate-700">·</span>
          <div className="flex items-center gap-1.5 text-blue-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Durasi Tanpa Batas Waktu</span>
          </div>
          <span className="text-slate-700">·</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Enkripsi E2E 256-bit</span>
          </div>
        </nav>

        {/* Zone 3: Profile & Settings */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSettings}
            title="Pengaturan"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
              A
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 truncate max-w-[140px]">
                {userEmail}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">Enterprise Bebas Waktu</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Lobby Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col justify-center">
        {/* Banner: Unlimited 100-Person Guarantee */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-950/40 to-slate-900 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Aplikasi Konferensi Video Tanpa Batas Waktu & 100 Orang
                </h3>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[10px] font-bold">
                  NO 40-MIN LIMIT
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Gelar rapat online intensif, seminar, kuliah umum, atau koordinasi tim untuk 100 orang sekaligus tanpa khawatir terputus otomatis.
              </p>
            </div>
          </div>

          <button
            onClick={onStartNewMeeting}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-900/50 shrink-0 cursor-pointer transition-colors"
          >
            <span>Mulai Rapat Cepat</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Central 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Iconic 4 Zoom Quick Actions */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            {/* Action 1: Rapat Baru (Orange Zoom Button) */}
            <button
              onClick={onStartNewMeeting}
              className="group p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-orange-500/60 hover:bg-slate-850 flex flex-col items-center text-center transition-all duration-200 cursor-pointer shadow-lg hover:shadow-orange-950/20"
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/30 group-hover:scale-105 transition-transform mb-3">
                <Video className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-white text-base">Rapat Baru</h3>
              <p className="text-xs text-slate-400 mt-1">
                Mulai ruang video instan untuk 100 orang
              </p>
            </button>

            {/* Action 2: Gabung Rapat (Blue Zoom Button) */}
            <button
              onClick={() => setShowJoinModal(true)}
              className="group p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-850 flex flex-col items-center text-center transition-all duration-200 cursor-pointer shadow-lg hover:shadow-blue-950/20"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/30 group-hover:scale-105 transition-transform mb-3">
                <PlusSquare className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-white text-base">Gabung Rapat</h3>
              <p className="text-xs text-slate-400 mt-1">
                Masukkan ID Rapat atau Tautan Undangan
              </p>
            </button>

            {/* Action 3: Jadwalkan (Dark Blue Button) */}
            <button
              onClick={onOpenSchedule}
              className="group p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-850 flex flex-col items-center text-center transition-all duration-200 cursor-pointer shadow-lg hover:shadow-indigo-950/20"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 group-hover:scale-105 transition-transform mb-3">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-white text-base">Jadwalkan</h3>
              <p className="text-xs text-slate-400 mt-1">
                Atur agenda pertemuan di waktu mendatang
              </p>
            </button>

            {/* Action 4: Bagi Layar (Green Button) */}
            <button
              onClick={onStartNewMeeting}
              className="group p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-850 flex flex-col items-center text-center transition-all duration-200 cursor-pointer shadow-lg hover:shadow-emerald-950/20"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-600/30 group-hover:scale-105 transition-transform mb-3">
                <Share2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-white text-base">Bagi Layar Langsung</h3>
              <p className="text-xs text-slate-400 mt-1">
                Buka ruang presentasi & layar monitor
              </p>
            </button>
          </div>

          {/* Right Column: Clock Card & Today's Schedule Card */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Clock & Date Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-4xl sm:text-5xl font-extrabold font-mono text-white tracking-tight tabular-nums">
                  {formattedTime}
                </div>
                <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium capitalize">
                  {formattedDate}
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl" />
            </div>

            {/* Upcoming Agenda List */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-xs text-white">Jadwal Rapat Hari Ini</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">1 Rapat Terjadwal</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold text-slate-200">
                      Koordinasi Sesi Akbar (100 Peserta)
                    </span>
                  </div>
                  <span className="font-mono text-xs text-emerald-400 font-semibold">
                    10:00 WIB
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/60">
                  <span>ID: 842 9102 3841 · Durasi: Bebas</span>
                  <button
                    onClick={onStartNewMeeting}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                  >
                    <span>Mulai</span>
                    <Play className="w-3 h-3 fill-blue-400" />
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={onOpenSchedule}
                  className="w-full py-2 text-center text-xs text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  + Jadwalkan Pertemuan Lainnya
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Join Meeting Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-850">
              <div className="flex items-center gap-2">
                <PlusSquare className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-base">Gabung ke Rapat</h3>
              </div>
              <button
                onClick={() => setShowJoinModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleJoinSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ID Rapat atau Tautan Undangan
                </label>
                <input
                  type="text"
                  value={joinId}
                  onChange={(e) => setJoinId(e.target.value)}
                  placeholder="Contoh: 842 9102 3841"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nama Anda
                </label>
                <input
                  type="text"
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  placeholder="Masukkan nama tampilan Anda..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-2 pt-1 text-xs text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  <span>Ingat nama saya untuk rapat berikutnya</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600" />
                  <span>Jangan hubungkan ke audio (Bisu saat masuk)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600" />
                  <span>Matikan kamera video saya saat masuk</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg cursor-pointer transition-colors"
                >
                  Gabung Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
