import React from 'react';
import { X, Shield, Lock, Users, MessageSquare, Share2, Mic, Video, AlertTriangle } from 'lucide-react';
import { MeetingDetails } from '../types/meeting';

interface SecurityModalProps {
  meetingDetails: MeetingDetails;
  onUpdateSecurity: (updates: Partial<MeetingDetails>) => void;
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({
  meetingDetails,
  onUpdateSecurity,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Pengaturan Keamanan Rapat</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Akses & Masuk Rapat
            </span>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 cursor-pointer">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-white block">Kunci Rapat</span>
                  <span className="text-[11px] text-slate-400">Tidak ada peserta baru yang dapat bergabung</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={meetingDetails.isLocked}
                onChange={(e) => onUpdateSecurity({ isLocked: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 cursor-pointer">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-white block">Aktifkan Ruang Tunggu</span>
                  <span className="text-[11px] text-slate-400">Peserta memerlukan persetujuan Host untuk masuk</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={meetingDetails.isWaitingRoomEnabled}
                onChange={(e) => onUpdateSecurity({ isWaitingRoomEnabled: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Izinkan 100 Peserta Untuk:
            </span>

            <label className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-200">Berbagi Layar (Share Screen)</span>
              </div>
              <input
                type="checkbox"
                checked={meetingDetails.allowParticipantScreenShare}
                onChange={(e) => onUpdateSecurity({ allowParticipantScreenShare: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span className="text-xs text-slate-200">Mengirim Obrolan (Chat)</span>
              </div>
              <input
                type="checkbox"
                checked={meetingDetails.allowParticipantChat}
                onChange={(e) => onUpdateSecurity({ allowParticipantChat: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Mic className="w-4 h-4 text-rose-400" />
                <span className="text-xs text-slate-200">Membunyikan Suara Sendiri (Unmute)</span>
              </div>
              <input
                type="checkbox"
                checked={meetingDetails.allowParticipantUnmute}
                onChange={(e) => onUpdateSecurity({ allowParticipantUnmute: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Emergency Suspend Button */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                onUpdateSecurity({
                  allowParticipantScreenShare: false,
                  allowParticipantChat: false,
                  allowParticipantUnmute: false,
                  isLocked: true,
                });
                alert('Semua aktivitas peserta telah ditangguhkan sementara demi keamanan rapat.');
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 border border-rose-700/60 font-medium text-xs rounded-xl cursor-pointer transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Tangguhkan Semua Aktivitas Peserta</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
