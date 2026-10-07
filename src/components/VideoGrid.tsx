import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid, Users } from 'lucide-react';
import { Participant, ViewMode, GridSize } from '../types/meeting';
import { VideoTile } from './VideoTile';

interface VideoGridProps {
  participants: Participant[];
  currentUserId: string;
  localStream: MediaStream | null;
  virtualBgType: 'none' | 'blur' | 'image';
  virtualBgUrl?: string;
  viewMode: ViewMode;
  activeSpeakerId: string | null;
  pinnedParticipantId: string | null;
  onTogglePin: (id: string) => void;
  onMuteParticipant: (id: string) => void;
  onToggleHand: (id: string) => void;
  onMakeCoHost: (id: string) => void;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  participants,
  currentUserId,
  localStream,
  virtualBgType,
  virtualBgUrl,
  viewMode,
  activeSpeakerId,
  pinnedParticipantId,
  onTogglePin,
  onMuteParticipant,
  onToggleHand,
  onMakeCoHost,
}) => {
  // Page size for 100 participants: Zoom default is 25 per page (5x5) or 16 (4x4) or 49 (7x7)
  const [pageSize, setPageSize] = useState<GridSize>(25);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const totalPages = Math.ceil(participants.length / pageSize);

  // Clamp current page
  const safePage = Math.min(currentPage, Math.max(0, totalPages - 1));

  // Determine current slice of participants
  const startIndex = safePage * pageSize;
  const currentParticipants = participants.slice(startIndex, startIndex + pageSize);

  // Active speaker resolution
  const speaker = 
    participants.find((p) => p.id === pinnedParticipantId) ||
    participants.find((p) => p.id === activeSpeakerId) ||
    participants[0];

  const handleNextPage = () => {
    if (safePage < totalPages - 1) {
      setCurrentPage(safePage + 1);
    }
  };

  const handlePrevPage = () => {
    if (safePage > 0) {
      setCurrentPage(safePage - 1);
    }
  };

  // Grid column class computation based on pageSize and count
  const getGridClass = (count: number) => {
    if (pageSize === 4) return 'grid-cols-1 sm:grid-cols-2';
    if (pageSize === 9) return 'grid-cols-2 sm:grid-cols-3';
    if (pageSize === 16) return 'grid-cols-2 sm:grid-cols-4';
    if (pageSize === 49) return 'grid-cols-3 sm:grid-cols-5 md:grid-cols-7';
    // Default 25 (5x5)
    if (count <= 4) return 'grid-cols-1 sm:grid-cols-2';
    if (count <= 9) return 'grid-cols-2 sm:grid-cols-3';
    if (count <= 16) return 'grid-cols-2 sm:grid-cols-4';
    return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
  };

  if (viewMode === 'speaker') {
    return (
      <div className="relative w-full h-full flex flex-col p-2 gap-2 overflow-hidden bg-slate-950">
        {/* Top Filmstrip of Other Participants */}
        <div className="h-28 sm:h-32 flex items-center gap-2 overflow-x-auto pb-1 shrink-0 px-1 scrollbar-thin">
          {participants.slice(0, 15).map((p) => (
            <div key={p.id} className="w-40 h-full shrink-0">
              <VideoTile
                participant={p}
                isLocalUser={p.id === currentUserId}
                localStream={localStream}
                virtualBgType={virtualBgType}
                virtualBgUrl={virtualBgUrl}
                isPinned={p.id === pinnedParticipantId}
                onTogglePin={onTogglePin}
                onMuteParticipant={onMuteParticipant}
                onToggleHand={onToggleHand}
                onMakeCoHost={onMakeCoHost}
              />
            </div>
          ))}
          {participants.length > 15 && (
            <div className="h-full px-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs text-slate-400 shrink-0">
              +{participants.length - 15} lainnya
            </div>
          )}
        </div>

        {/* Large Focused Active Speaker Stage */}
        <div className="flex-1 w-full h-full min-h-0 relative">
          {speaker && (
            <VideoTile
              participant={speaker}
              isLocalUser={speaker.id === currentUserId}
              localStream={localStream}
              virtualBgType={virtualBgType}
              virtualBgUrl={virtualBgUrl}
              isPinned={speaker.id === pinnedParticipantId}
              isSpotlighted={true}
              onTogglePin={onTogglePin}
              onMuteParticipant={onMuteParticipant}
              onToggleHand={onToggleHand}
              onMakeCoHost={onMakeCoHost}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col p-2 md:p-3 overflow-hidden bg-slate-950">
      {/* Top Pagination and Grid Density Bar */}
      <div className="flex items-center justify-between pb-2 px-1 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            Total {participants.length} Peserta Aktif
          </span>
          <span className="text-slate-600">|</span>
          <span className="font-mono tabular-nums">
            Menampilkan {startIndex + 1}–{Math.min(startIndex + pageSize, participants.length)} dari {participants.length}
          </span>
        </div>

        {/* Grid size switcher & Pagination controls */}
        <div className="flex items-center gap-3">
          {/* Zoom Grid size presets */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
            <span className="px-2 text-[10px] text-slate-500 flex items-center gap-1 font-medium">
              <LayoutGrid className="w-3 h-3" /> Grid:
            </span>
            {([9, 16, 25, 49] as GridSize[]).map((size) => (
              <button
                key={size}
                onClick={() => {
                  setPageSize(size);
                  setCurrentPage(0);
                }}
                className={`px-2 py-0.5 text-[11px] font-medium rounded cursor-pointer transition-colors ${
                  pageSize === size
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Page navigation */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
              <button
                onClick={handlePrevPage}
                disabled={safePage === 0}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-slate-200 text-xs px-1">
                Hal {safePage + 1}/{totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={safePage === totalPages - 1}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Halaman Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid View Container */}
      <div className="relative flex-1 w-full h-full min-h-0">
        <div className={`w-full h-full grid gap-2 auto-rows-fr ${getGridClass(currentParticipants.length)}`}>
          {currentParticipants.map((p) => (
            <VideoTile
              key={p.id}
              participant={p}
              isLocalUser={p.id === currentUserId}
              localStream={localStream}
              virtualBgType={virtualBgType}
              virtualBgUrl={virtualBgUrl}
              isPinned={p.id === pinnedParticipantId}
              onTogglePin={onTogglePin}
              onMuteParticipant={onMuteParticipant}
              onToggleHand={onToggleHand}
              onMakeCoHost={onMakeCoHost}
            />
          ))}
        </div>

        {/* Floating Side Pagination Navigators (Zoom style arrows on hover) */}
        {safePage > 0 && (
          <button
            onClick={handlePrevPage}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/90 hover:bg-blue-600 text-white border border-slate-700/80 flex items-center justify-center shadow-2xl transition-all cursor-pointer backdrop-blur-md z-30"
            title="Lihat Peserta Sebelumnya"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {safePage < totalPages - 1 && (
          <button
            onClick={handleNextPage}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/90 hover:bg-blue-600 text-white border border-slate-700/80 flex items-center justify-center shadow-2xl transition-all cursor-pointer backdrop-blur-md z-30"
            title="Lihat Peserta Selanjutnya (Halaman Berikutnya)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};
