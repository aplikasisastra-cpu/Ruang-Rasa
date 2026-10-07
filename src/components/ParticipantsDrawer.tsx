import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Hand, 
  ShieldCheck, 
  UserPlus, 
  VolumeX, 
  MoreVertical,
  Check
} from 'lucide-react';
import { Participant } from '../types/meeting';

interface ParticipantsDrawerProps {
  participants: Participant[];
  currentUserId: string;
  onClose: () => void;
  onMuteParticipant: (id: string) => void;
  onMuteAll: () => void;
  onToggleHand: (id: string) => void;
  onMakeCoHost: (id: string) => void;
  onOpenInviteModal: () => void;
}

export const ParticipantsDrawer: React.FC<ParticipantsDrawerProps> = ({
  participants,
  currentUserId,
  onClose,
  onMuteParticipant,
  onMuteAll,
  onToggleHand,
  onMakeCoHost,
  onOpenInviteModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'hands' | 'muted'>('all');
  const [showMuteAllConfirm, setShowMuteAllConfirm] = useState(false);

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.city && p.city.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (filterType === 'hands') return p.isHandRaised;
    if (filterType === 'muted') return p.isMuted;
    return true;
  });

  const raisedHandsCount = participants.filter((p) => p.isHandRaised).length;

  return (
    <div className="w-80 sm:w-96 h-full bg-slate-900 border-l border-slate-800 flex flex-col z-30 select-none shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-white text-base">Peserta</h3>
          <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-blue-600/30 text-blue-400 font-semibold border border-blue-500/40">
            {participants.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari dari 100 peserta rapat..."
            className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 mt-2.5">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg cursor-pointer transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Semua ({participants.length})
          </button>
          <button
            onClick={() => setFilterType('hands')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg cursor-pointer transition-colors ${
              filterType === 'hands'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Hand className="w-3 h-3" />
            <span>Angkat Tangan ({raisedHandsCount})</span>
          </button>
          <button
            onClick={() => setFilterType('muted')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg cursor-pointer transition-colors ${
              filterType === 'muted'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Dibisukan
          </button>
        </div>
      </div>

      {/* Participant List Scroll Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40 p-2 space-y-1 scrollbar-thin">
        {filteredParticipants.map((p) => {
          const initials = p.name
            .split(' ')
            .slice(0, 2)
            .map((n) => n[0])
            .join('')
            .toUpperCase();
          const isCurrentUser = p.id === currentUserId;

          return (
            <div
              key={p.id}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/70 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${p.avatarBg}`}>
                  {initials}
                </div>

                {/* Name & Details */}
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-200 truncate">
                      {p.name}
                    </span>
                    {isCurrentUser && (
                      <span className="text-[10px] text-blue-400 font-bold shrink-0">
                        (Anda)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    {p.role === 'host' && (
                      <span className="text-blue-400 font-semibold">Host Penyelenggara</span>
                    )}
                    {p.role === 'co-host' && (
                      <span className="text-purple-400 font-semibold">Co-Host</span>
                    )}
                    {p.role === 'participant' && (
                      <span>Peserta</span>
                    )}
                    {p.city && (
                      <>
                        <span>·</span>
                        <span>{p.city}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Icons & Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {p.isHandRaised && (
                  <button
                    onClick={() => onToggleHand(p.id)}
                    title="Turunkan Tangan"
                    className="p-1 text-amber-400 hover:bg-amber-500/20 rounded cursor-pointer"
                  >
                    <Hand className="w-4 h-4 fill-amber-400" />
                  </button>
                )}

                <button
                  onClick={() => onMuteParticipant(p.id)}
                  title={p.isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
                  className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                    p.isMuted
                      ? 'text-rose-400 hover:bg-rose-500/20'
                      : 'text-emerald-400 hover:bg-emerald-500/20'
                  }`}
                >
                  {p.isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>

                <div className="p-1.5 text-slate-400">
                  {p.isVideoOn ? (
                    <Video className="w-3.5 h-3.5 text-slate-300" />
                  ) : (
                    <VideoOff className="w-3.5 h-3.5 text-rose-400" />
                  )}
                </div>

                {p.role !== 'host' && (
                  <button
                    onClick={() => onMakeCoHost(p.id)}
                    title={p.role === 'co-host' ? 'Turunkan Role Co-Host' : 'Jadikan Co-Host'}
                    className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${
                      p.role === 'co-host' ? 'text-purple-400 hover:bg-purple-500/20' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredParticipants.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-500">
            Tidak ada peserta yang cocok dengan filter pencarian.
          </div>
        )}
      </div>

      {/* Footer Controls: Mute All & Invite */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90 space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenInviteModal()}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-blue-400" />
            <span>Undang Peserta</span>
          </button>

          <button
            onClick={() => setShowMuteAllConfirm(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            <VolumeX className="w-4 h-4" />
            <span>Bisukan Semua</span>
          </button>
        </div>

        {showMuteAllConfirm && (
          <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl space-y-2 text-xs">
            <p className="text-slate-300 font-medium">
              Bisukan audio seluruh 100 peserta saat ini?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowMuteAllConfirm(false)}
                className="px-2.5 py-1 text-slate-400 hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onMuteAll();
                  setShowMuteAllConfirm(false);
                }}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg"
              >
                Ya, Bisukan Semua
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
