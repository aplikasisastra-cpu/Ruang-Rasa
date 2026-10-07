import React, { useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Hand, 
  Pin, 
  MoreVertical, 
  ShieldCheck, 
  Radio
} from 'lucide-react';
import { Participant } from '../types/meeting';

interface VideoTileProps {
  participant: Participant;
  isLocalUser?: boolean;
  localStream?: MediaStream | null;
  virtualBgType?: 'none' | 'blur' | 'image';
  virtualBgUrl?: string;
  isPinned?: boolean;
  isSpotlighted?: boolean;
  onTogglePin?: (id: string) => void;
  onMuteParticipant?: (id: string) => void;
  onToggleHand?: (id: string) => void;
  onMakeCoHost?: (id: string) => void;
}

export const VideoTile: React.FC<VideoTileProps> = ({
  participant,
  isLocalUser = false,
  localStream,
  virtualBgType = 'none',
  virtualBgUrl,
  isPinned = false,
  isSpotlighted = false,
  onTogglePin,
  onMuteParticipant,
  onToggleHand,
  onMakeCoHost,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showMenu, setShowMenu] = React.useState(false);

  // Bind local webcam stream if available
  useEffect(() => {
    if (isLocalUser && videoRef.current && localStream && participant.isVideoOn) {
      videoRef.current.srcObject = localStream;
      videoRef.current.play().catch(() => {});
    }
  }, [isLocalUser, localStream, participant.isVideoOn]);

  const initials = participant.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className={`group relative w-full h-full min-h-[140px] rounded-xl overflow-hidden bg-slate-900 border transition-all duration-200 select-none flex flex-col items-center justify-center ${
        participant.isSpeaking
          ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
          : isPinned
          ? 'border-blue-500'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Background layer for Virtual Background */}
      {isLocalUser && virtualBgType === 'image' && virtualBgUrl && participant.isVideoOn && (
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 filter blur-[1px] brightness-90"
          style={{ backgroundImage: `url(${virtualBgUrl})` }}
        />
      )}

      {/* Video Stream or Avatar Placeholder */}
      {isLocalUser && participant.isVideoOn && localStream ? (
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center z-10">
          <video
            ref={videoRef}
            muted
            playsInline
            autoPlay
            className={`w-full h-full object-cover transform -scale-x-100 ${
              virtualBgType === 'blur' ? 'backdrop-blur-md' : ''
            }`}
          />
        </div>
      ) : participant.isVideoOn && !isLocalUser ? (
        // Simulated video for remote active camera participants
        <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 flex flex-col items-center justify-center overflow-hidden">
          {/* Subtle animated ambient webcam room reflection */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_40%,rgba(148,163,184,0.4),transparent_60%)]" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold shadow-lg ring-4 ${
              participant.isSpeaking ? 'ring-emerald-500 animate-pulse' : 'ring-slate-700/60'
            } ${participant.avatarBg}`}>
              {initials}
            </div>
            {participant.city && (
              <span className="mt-2 text-[10px] text-slate-400 font-medium">
                {participant.city}
              </span>
            )}
          </div>

          {/* Simulated audio frequency bars if speaking */}
          {participant.isSpeaking && (
            <div className="absolute top-3 right-3 flex items-center gap-0.5 z-20 bg-slate-900/80 px-2 py-1 rounded-full border border-emerald-500/40">
              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>
      ) : (
        // Video is Off (Avatar Tile)
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-900">
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold shadow-md ring-2 ${
              participant.isSpeaking
                ? 'ring-emerald-500 animate-pulse'
                : 'ring-slate-800'
            } ${participant.avatarBg}`}
          >
            {initials}
          </div>
          {participant.city && (
            <span className="mt-1 text-[10px] text-slate-500 font-medium">
              {participant.city}
            </span>
          )}
        </div>
      )}

      {/* Raised Hand Badge */}
      {participant.isHandRaised && (
        <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/90 text-slate-950 text-xs font-bold rounded-lg shadow-lg border border-amber-300 animate-bounce">
          <Hand className="w-3.5 h-3.5 fill-slate-950" />
          <span className="text-[11px]">Angkat Tangan</span>
        </div>
      )}

      {/* Floating Reaction */}
      {participant.recentReaction && Date.now() - participant.recentReaction.timestamp < 3500 && (
        <div className="absolute bottom-12 right-4 z-30 text-3xl animate-bounce drop-shadow-lg">
          {participant.recentReaction.emoji}
        </div>
      )}

      {/* Hover Action Controls (Pin, More) */}
      <div className="absolute top-2.5 right-2.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        {onTogglePin && (
          <button
            onClick={() => onTogglePin(participant.id)}
            title={isPinned ? 'Lepas Sematan (Unpin)' : 'Sematkan Video (Pin)'}
            className={`p-1.5 rounded-md cursor-pointer transition-colors backdrop-blur-md ${
              isPinned ? 'bg-blue-600 text-white' : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            title="Opsi Peserta"
            className="p-1.5 rounded-md cursor-pointer transition-colors backdrop-blur-md bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showMenu && (
            <div 
              onMouseLeave={() => setShowMenu(false)}
              className="absolute right-0 top-8 z-40 w-44 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl py-1 text-xs text-slate-200 backdrop-blur-lg"
            >
              {onMuteParticipant && (
                <button
                  onClick={() => {
                    onMuteParticipant(participant.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>{participant.isMuted ? 'Minta Nyalakan Suara' : 'Bisukan Suara'}</span>
                  {participant.isMuted ? <Mic className="w-3.5 h-3.5 text-slate-400" /> : <MicOff className="w-3.5 h-3.5 text-rose-400" />}
                </button>
              )}
              {onToggleHand && (
                <button
                  onClick={() => {
                    onToggleHand(participant.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>{participant.isHandRaised ? 'Turunkan Tangan' : 'Angkat Tangan'}</span>
                  <Hand className="w-3.5 h-3.5 text-amber-400" />
                </button>
              )}
              {onMakeCoHost && participant.role !== 'host' && (
                <button
                  onClick={() => {
                    onMakeCoHost(participant.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>{participant.role === 'co-host' ? 'Turunkan Co-Host' : 'Jadikan Co-Host'}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Name Label & Status Tag */}
      <div className="absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/75 backdrop-blur-md rounded-md max-w-[85%] border border-slate-800/60">
          {/* Mute icon */}
          {participant.isMuted ? (
            <MicOff className="w-3 h-3 text-rose-400 shrink-0" />
          ) : (
            <Mic className="w-3 h-3 text-emerald-400 shrink-0" />
          )}

          {/* Name */}
          <span className="text-xs font-medium text-slate-100 truncate tracking-tight">
            {participant.name}
          </span>

          {/* Role badge */}
          {participant.role === 'host' && (
            <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded shrink-0">
              Host
            </span>
          )}
          {participant.role === 'co-host' && (
            <span className="text-[10px] font-semibold bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded shrink-0">
              Co-Host
            </span>
          )}
        </div>

        {/* Live Audio activity dot */}
        {participant.isSpeaking && (
          <div className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-semibold flex items-center gap-1">
            <Radio className="w-2.5 h-2.5 animate-pulse" />
            <span>Bicara</span>
          </div>
        )}
      </div>
    </div>
  );
};
