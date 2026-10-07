import React, { useRef, useEffect, useState } from 'react';
import { 
  StopCircle, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Monitor, 
  PenTool, 
  CheckCircle2, 
  BarChart3, 
  TrendingUp, 
  Users 
} from 'lucide-react';
import { Participant } from '../types/meeting';

interface ScreenShareStageProps {
  presenter: Participant;
  isLocalPresenter: boolean;
  screenStream?: MediaStream | null;
  onStopScreenShare: () => void;
}

export const ScreenShareStage: React.FC<ScreenShareStageProps> = ({
  presenter,
  isLocalPresenter,
  screenStream,
  onStopScreenShare,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [activeSlide, setActiveSlide] = useState(1);
  const [isAnnotating, setIsAnnotating] = useState(false);

  useEffect(() => {
    if (screenStream && videoRef.current) {
      videoRef.current.srcObject = screenStream;
      videoRef.current.play().catch(() => {});
    }
  }, [screenStream]);

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 overflow-hidden">
      {/* Top Notification Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-emerald-950/80 border-b border-emerald-800/60 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs text-emerald-200">
          <Monitor className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>
            {isLocalPresenter
              ? 'Anda sedang berbagi layar dengan seluruh 100 peserta rapat'
              : `${presenter.name} sedang berbagi layar (Resolusi Tinggi 1080p)`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isLocalPresenter ? (
            <button
              onClick={onStopScreenShare}
              className="flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-colors"
            >
              <StopCircle className="w-3.5 h-3.5" />
              <span>Hentikan Berbagi Layar</span>
            </button>
          ) : (
            <button
              onClick={onStopScreenShare}
              className="text-xs text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-800/80 cursor-pointer"
            >
              Tutup Tampilan Layar
            </button>
          )}
        </div>
      </div>

      {/* Main Presentation / Screen Feed */}
      <div className="relative flex-1 w-full h-full min-h-0 bg-slate-900 flex items-center justify-center p-3">
        {screenStream ? (
          <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-xl bg-black border border-slate-800 shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          // Simulated Enterprise Presentation Deck
          <div className="w-full max-w-5xl aspect-video bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Slide Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-850 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="font-semibold text-sm text-slate-200 tracking-tight">
                  Laporan Kuartal & Rencana Strategis Ruang Rasa 2026
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Slide {activeSlide} dari 3</span>
              </div>
            </div>

            {/* Slide Body */}
            <div className="flex-1 p-8 flex flex-col justify-center">
              {activeSlide === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-blue-400 tracking-wide uppercase">
                      Ringkasan Eksekutif
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      Infrastruktur Konferensi Tanpa Batas Waktu & Kapasitas 100 Orang
                    </h2>
                    <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                      Sistem arsitektur streaming WebRTC peer mesh teroptimasi latency rendah menjamin 100 koneksi bersamaan tanpa degradasi kualitas audio maupun video.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-start gap-3">
                      <Users className="w-8 h-8 text-blue-400 shrink-0" />
                      <div>
                        <div className="text-2xl font-bold font-mono text-white tabular-nums">100</div>
                        <div className="text-xs text-slate-400">Kapasitas Peserta Aktif</div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-start gap-3">
                      <TrendingUp className="w-8 h-8 text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-2xl font-bold font-mono text-white tabular-nums">∞ Jam</div>
                        <div className="text-xs text-slate-400">Durasi Tanpa Batas</div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-start gap-3">
                      <CheckCircle2 className="w-8 h-8 text-purple-400 shrink-0" />
                      <div>
                        <div className="text-2xl font-bold font-mono text-white tabular-nums">1080p</div>
                        <div className="text-xs text-slate-400">Kejernihan Ultra HD 60FPS</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSlide === 2 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-semibold text-emerald-400 uppercase">
                      Kinerja Pertumbuhan
                    </span>
                    <h2 className="text-2xl font-bold text-white">
                      Statistik Adopsi Rapat Kolaboratif
                    </h2>
                  </div>
                  <div className="p-6 bg-slate-800/60 rounded-xl border border-slate-700/60 flex flex-col gap-4">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>Efisiensi Waktu Kolaborasi Tim</span>
                      <span className="font-mono text-emerald-400 font-semibold">+87%</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full w-[87%]" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>Tingkat Kepuasan Peserta (NPS)</span>
                      <span className="font-mono text-blue-400 font-semibold">94.8%</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full w-[95%]" />
                    </div>
                  </div>
                </div>
              )}

              {activeSlide === 3 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-semibold text-purple-400 uppercase">
                      Fitur Utama Lengkap
                    </span>
                    <h2 className="text-2xl font-bold text-white">
                      Semua Fitur Unggulan Aktif Siap Digunakan
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                    <div className="p-3 bg-slate-800/60 rounded-lg flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                      <span>Polling Langsung & Real-Time Votes</span>
                    </div>
                    <div className="p-3 bg-slate-800/60 rounded-lg flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-blue-400" />
                      <span>Papan Tulis Gambar Kolaboratif</span>
                    </div>
                    <div className="p-3 bg-slate-800/60 rounded-lg flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span>Ruang Terpisah (Breakout Rooms)</span>
                    </div>
                    <div className="p-3 bg-slate-800/60 rounded-lg flex items-center gap-2">
                      <Maximize2 className="w-4 h-4 text-amber-400" />
                      <span>Enkripsi Ujung-ke-Ujung (E2EE)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Slide Navigation Footer */}
            <div className="flex items-center justify-between px-6 py-3 bg-slate-850 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSlide((s) => Math.max(1, s - 1))}
                  disabled={activeSlide === 1}
                  className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveSlide((s) => Math.min(3, s + 1))}
                  disabled={activeSlide === 3}
                  className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-400 ml-2 font-mono">
                  Slide {activeSlide} / 3
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAnnotating(!isAnnotating)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors ${
                    isAnnotating
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>{isAnnotating ? 'Anotasi Aktif' : 'Anotasi Layar'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
