import React, { useState } from 'react';
import { X, Calendar, Clock, Lock, Shield, Video, Check } from 'lucide-react';

interface ScheduleModalProps {
  onClose: () => void;
  onSchedule: (meeting: {
    topic: string;
    date: string;
    time: string;
    passcode: string;
    isWaitingRoom: boolean;
  }) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ onClose, onSchedule }) => {
  const [topic, setTopic] = useState('Rapat Koordinasi Mingguan');
  const [date, setDate] = useState('2026-10-08');
  const [time, setTime] = useState('14:00');
  const [passcode, setPasscode] = useState('739201');
  const [isWaitingRoom, setIsWaitingRoom] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule({
      topic,
      date,
      time,
      passcode,
      isWaitingRoom,
    });
    alert(`Rapat "${topic}" berhasil dijadwalkan dengan durasi tanpa batas waktu!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-base">Jadwalkan Rapat Baru</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Topik Rapat
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tanggal Pelaksanaan
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Waktu Mulai
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Unlimited duration highlight */}
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs font-bold text-emerald-300 block">Durasi: Tanpa Batas Waktu</span>
                <span className="text-[11px] text-emerald-400/80">Kapasitas hingga 100 orang peserta tanpa batas waktu 40 menit</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-emerald-600/30 text-emerald-300 text-[10px] font-bold rounded">
              UNLIMITED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ID Rapat
              </label>
              <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs font-mono text-slate-200">
                842 9102 3841 (Otomatis)
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kode Sandi Keamanan
              </label>
              <input
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-white block">Aktifkan Ruang Tunggu</span>
              <span className="text-[11px] text-slate-400">Hanya peserta yang disetujui host yang dapat bergabung</span>
            </div>
            <input
              type="checkbox"
              checked={isWaitingRoom}
              onChange={(e) => setIsWaitingRoom(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </label>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg cursor-pointer"
            >
              Simpan Jadwal Rapat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
