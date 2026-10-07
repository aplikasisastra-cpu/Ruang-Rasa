import React, { useState } from 'react';
import { X, Copy, Check, Share2, Mail, MessageCircle, ShieldCheck } from 'lucide-react';
import { MeetingDetails } from '../types/meeting';

interface InviteModalProps {
  meetingDetails: MeetingDetails;
  onClose: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ meetingDetails, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedInvitation, setCopiedInvitation] = useState(false);

  const fullInvitationText = `Ruang Rasa - Undangan Konferensi Video

Topik: ${meetingDetails.topic}
Waktu: Sesi Berlangsung Sekarang (Durasi Tanpa Batas Waktu)
Kapasitas: Hingga 100 Orang Peserta

Gabung ke Rapat Ruang Rasa:
${meetingDetails.inviteLink}

ID Rapat: ${meetingDetails.id}
Kode Sandi: ${meetingDetails.passcode}

Fitur: Berbagi Layar HD, Papan Tulis Kolaboratif, Enkripsi E2E 256-bit.`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(meetingDetails.inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyInvitation = () => {
    navigator.clipboard?.writeText(fullInvitationText);
    setCopiedInvitation(true);
    setTimeout(() => setCopiedInvitation(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullInvitationText)}`;
    window.open(url, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Undangan Rapat: ${meetingDetails.topic}`);
    const body = encodeURIComponent(fullInvitationText);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-base">Undang Orang ke Rapat</h3>
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
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-emerald-300 block">Kapasitas 100 Orang & Durasi Tanpa Batas</span>
              <span className="text-emerald-400/80">Rapat ini tidak memiliki batas waktu 40 menit. Bebas digunakan hingga tuntas.</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Tautan Undangan Rapat</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={meetingDetails.inviteLink}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Disalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="text-[11px] text-slate-400 block">ID Rapat</span>
                <span className="font-mono text-sm font-bold text-white tracking-wider">
                  {meetingDetails.id}
                </span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="text-[11px] text-slate-400 block">Kode Sandi</span>
                <span className="font-mono text-sm font-bold text-white">
                  {meetingDetails.passcode}
                </span>
              </div>
            </div>
          </div>

          {/* Quick share channels */}
          <div className="pt-2">
            <span className="text-xs text-slate-400 block mb-2">Bagikan Langsung Melalui:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl cursor-pointer transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={handleShareEmail}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl cursor-pointer transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex justify-between items-center">
          <button
            onClick={handleCopyInvitation}
            className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
          >
            {copiedInvitation ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedInvitation ? 'Undangan Lengkap Tersalin!' : 'Salin Undangan Lengkap'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
