import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Shield, 
  Users, 
  MessageSquare, 
  Share2, 
  PenTool, 
  BarChart2, 
  Grid, 
  CircleDot, 
  Smile, 
  PhoneOff, 
  ChevronUp, 
  Check, 
  Settings, 
  Hand,
  Volume2
} from 'lucide-react';
import { Participant, MeetingDetails } from '../types/meeting';

interface MeetingControlsProps {
  localParticipant: Participant;
  totalParticipants: number;
  unreadChatCount: number;
  isRecording: boolean;
  isSharingScreen: boolean;
  isWhiteboardOpen: boolean;
  meetingDetails: MeetingDetails;
  onToggleMic: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleWhiteboard: () => void;
  onToggleParticipantsDrawer: () => void;
  onToggleChatDrawer: () => void;
  onOpenBreakoutModal: () => void;
  onOpenPollsModal: () => void;
  onToggleRecording: () => void;
  onSendReaction: (emoji: string) => void;
  onToggleHandRaise: () => void;
  onOpenSettings: (tab?: 'audio' | 'video' | 'background') => void;
  onOpenSecurityModal: () => void;
  onLeaveMeeting: () => void;
}

export const MeetingControls: React.FC<MeetingControlsProps> = ({
  localParticipant,
  totalParticipants,
  unreadChatCount,
  isRecording,
  isSharingScreen,
  isWhiteboardOpen,
  meetingDetails,
  onToggleMic,
  onToggleVideo,
  onToggleScreenShare,
  onToggleWhiteboard,
  onToggleParticipantsDrawer,
  onToggleChatDrawer,
  onOpenBreakoutModal,
  onOpenPollsModal,
  onToggleRecording,
  onSendReaction,
  onToggleHandRaise,
  onOpenSettings,
  onOpenSecurityModal,
  onLeaveMeeting,
}) => {
  const [showMicMenu, setShowMicMenu] = useState(false);
  const [showVideoMenu, setShowVideoMenu] = useState(false);
  const [showReactionsMenu, setShowReactionsMenu] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const reactions = ['👏', '👍', '❤️', '😂', '😮', '🎉'];

  return (
    <footer className="relative z-30 h-18 bg-slate-900 border-t border-slate-800 px-3 sm:px-6 flex items-center justify-between select-none shadow-2xl">
      {/* Group Left: Audio & Video controls with dropdowns */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Audio Toggle + Dropdown */}
        <div className="relative flex items-center bg-slate-800/90 rounded-xl p-0.5 border border-slate-700/60">
          <button
            onClick={onToggleMic}
            className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg transition-colors cursor-pointer min-w-[56px] ${
              localParticipant.isMuted
                ? 'text-rose-400 hover:bg-rose-500/10'
                : 'text-slate-200 hover:bg-slate-700/80'
            }`}
            title={localParticipant.isMuted ? 'Nyalakan Mikrofon' : 'Bisukan Mikrofon'}
          >
            {localParticipant.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-400" />}
            <span className="text-[10px] mt-0.5 font-medium">
              {localParticipant.isMuted ? 'Bisu' : 'Suara'}
            </span>
          </button>
          
          <button
            onClick={() => setShowMicMenu(!showMicMenu)}
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-700/80 cursor-pointer"
            title="Pengaturan Audio"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          {showMicMenu && (
            <div 
              onMouseLeave={() => setShowMicMenu(false)}
              className="absolute bottom-16 left-0 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs backdrop-blur-xl animate-in fade-in zoom-in-95"
            >
              <div className="px-2 py-1.5 font-semibold text-slate-300 border-b border-slate-800">
                Pilih Mikrofon
              </div>
              <button 
                onClick={() => setShowMicMenu(false)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-slate-800 rounded-lg text-slate-200"
              >
                <span>Mikrofon Default Sistem</span>
                <Check className="w-3.5 h-3.5 text-blue-400" />
              </button>
              <div className="px-2 py-1.5 font-semibold text-slate-300 border-b border-slate-800 mt-1">
                Pilih Speaker
              </div>
              <button 
                onClick={() => setShowMicMenu(false)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-slate-800 rounded-lg text-slate-200"
              >
                <span>Speaker Default Sistem</span>
                <Check className="w-3.5 h-3.5 text-blue-400" />
              </button>
              <div className="border-t border-slate-800 mt-1.5 pt-1">
                <button
                  onClick={() => {
                    setShowMicMenu(false);
                    onOpenSettings('audio');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-800 rounded-lg text-blue-400 font-medium"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Pengaturan Audio Lanjutan...</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Video Toggle + Dropdown */}
        <div className="relative flex items-center bg-slate-800/90 rounded-xl p-0.5 border border-slate-700/60">
          <button
            onClick={onToggleVideo}
            className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg transition-colors cursor-pointer min-w-[56px] ${
              !localParticipant.isVideoOn
                ? 'text-rose-400 hover:bg-rose-500/10'
                : 'text-slate-200 hover:bg-slate-700/80'
            }`}
            title={localParticipant.isVideoOn ? 'Matikan Kamera' : 'Nyalakan Kamera'}
          >
            {!localParticipant.isVideoOn ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5 text-emerald-400" />}
            <span className="text-[10px] mt-0.5 font-medium">
              {localParticipant.isVideoOn ? 'Video' : 'Mati'}
            </span>
          </button>
          
          <button
            onClick={() => setShowVideoMenu(!showVideoMenu)}
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-700/80 cursor-pointer"
            title="Pengaturan Video & Latar Virtual"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          {showVideoMenu && (
            <div 
              onMouseLeave={() => setShowVideoMenu(false)}
              className="absolute bottom-16 left-0 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs backdrop-blur-xl animate-in fade-in zoom-in-95"
            >
              <div className="px-2 py-1.5 font-semibold text-slate-300 border-b border-slate-800">
                Pilih Kamera
              </div>
              <button 
                onClick={() => setShowVideoMenu(false)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-slate-800 rounded-lg text-slate-200"
              >
                <span>Kamera Web Terintegrasi HD</span>
                <Check className="w-3.5 h-3.5 text-blue-400" />
              </button>
              <div className="border-t border-slate-800 mt-1.5 pt-1 space-y-0.5">
                <button
                  onClick={() => {
                    setShowVideoMenu(false);
                    onOpenSettings('background');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-800 rounded-lg text-blue-400 font-medium"
                >
                  <span>Pilih Latar Belakang Virtual (Background)</span>
                </button>
                <button
                  onClick={() => {
                    setShowVideoMenu(false);
                    onOpenSettings('video');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-800 rounded-lg text-slate-300 font-medium"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Pengaturan Video...</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Group Center: Interactive Conference Tools (Security, Participants, Chat, Share, Whiteboard, Polls, Breakout, Record, Reactions) */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Security */}
        <button
          onClick={onOpenSecurityModal}
          className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer min-w-[50px] sm:min-w-[58px]"
          title="Keamanan Rapat"
        >
          <Shield className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px] mt-0.5 font-medium hidden sm:inline">Keamanan</span>
        </button>

        {/* Participants (100) */}
        <button
          onClick={onToggleParticipantsDrawer}
          className="relative flex flex-col items-center justify-center p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer min-w-[50px] sm:min-w-[58px]"
          title="Daftar 100 Peserta"
        >
          <div className="relative">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="absolute -top-1.5 -right-2 px-1 text-[9px] font-bold font-mono bg-blue-600 text-white rounded-full">
              {totalParticipants}
            </span>
          </div>
          <span className="text-[10px] mt-0.5 font-medium hidden sm:inline">Peserta</span>
        </button>

        {/* Chat */}
        <button
          onClick={onToggleChatDrawer}
          className="relative flex flex-col items-center justify-center p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer min-w-[50px] sm:min-w-[58px]"
          title="Obrolan Rapat"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1 text-[9px] font-bold font-mono bg-rose-600 text-white rounded-full animate-pulse">
                {unreadChatCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium hidden sm:inline">Obrolan</span>
        </button>

        {/* Share Screen (Green Accent Zoom iconic) */}
        <button
          onClick={onToggleScreenShare}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors cursor-pointer min-w-[50px] sm:min-w-[62px] ${
            isSharingScreen
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
              : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40'
          }`}
          title={isSharingScreen ? 'Hentikan Berbagi Layar' : 'Bagi Layar Anda'}
        >
          <Share2 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium hidden sm:inline">
            {isSharingScreen ? 'Berhenti' : 'Bagi Layar'}
          </span>
        </button>

        {/* Whiteboard */}
        <button
          onClick={onToggleWhiteboard}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors cursor-pointer min-w-[50px] sm:min-w-[58px] ${
            isWhiteboardOpen
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Papan Tulis Kolaboratif"
        >
          <PenTool className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] mt-0.5 font-medium hidden sm:inline">Papan Tulis</span>
        </button>

        {/* Polls */}
        <button
          onClick={onOpenPollsModal}
          className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer min-w-[50px] sm:min-w-[58px]"
          title="Jajak Pendapat / Polling"
        >
          <BarChart2 className="w-5 h-5 text-purple-400" />
          <span className="text-[10px] mt-0.5 font-medium hidden md:inline">Polling</span>
        </button>

        {/* Breakout Rooms */}
        <button
          onClick={onOpenBreakoutModal}
          className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer min-w-[50px] sm:min-w-[58px]"
          title="Ruang Terpisah (Breakout Rooms)"
        >
          <Grid className="w-5 h-5 text-pink-400" />
          <span className="text-[10px] mt-0.5 font-medium hidden md:inline">Ruang Terpisah</span>
        </button>

        {/* Record (Rekam) */}
        <button
          onClick={onToggleRecording}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors cursor-pointer min-w-[50px] sm:min-w-[58px] ${
            isRecording
              ? 'text-rose-400 bg-rose-500/10'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title={isRecording ? 'Jeda/Hentikan Rekaman' : 'Rekam Rapat'}
        >
          <div className="relative">
            <CircleDot className={`w-5 h-5 ${isRecording ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
          </div>
          <span className="text-[10px] mt-0.5 font-medium hidden sm:inline">
            {isRecording ? 'Merekam' : 'Rekam'}
          </span>
        </button>

        {/* Reactions + Hand Raise */}
        <div className="relative">
          <button
            onClick={() => setShowReactionsMenu(!showReactionsMenu)}
            className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer min-w-[50px] sm:min-w-[58px]"
            title="Kirim Reaksi & Angkat Tangan"
          >
            <Smile className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] mt-0.5 font-medium hidden sm:inline">Reaksi</span>
          </button>

          {showReactionsMenu && (
            <div 
              onMouseLeave={() => setShowReactionsMenu(false)}
              className="absolute bottom-16 right-0 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 text-xs backdrop-blur-xl animate-in fade-in zoom-in-95"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="font-semibold text-slate-300 text-xs">Pilih Reaksi</span>
                <span className="text-[10px] text-slate-500">Muncul di video</span>
              </div>
              
              <div className="grid grid-cols-6 gap-1.5 pb-3">
                {reactions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onSendReaction(emoji);
                      setShowReactionsMenu(false);
                    }}
                    className="text-2xl p-1.5 rounded-lg hover:bg-slate-800 hover:scale-125 transition-all flex items-center justify-center cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-800 pt-2">
                <button
                  onClick={() => {
                    onToggleHandRaise();
                    setShowReactionsMenu(false);
                  }}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-medium cursor-pointer transition-colors ${
                    localParticipant.isHandRaised
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Hand className="w-4 h-4" />
                  <span>{localParticipant.isHandRaised ? 'Turunkan Tangan' : 'Angkat Tangan ✋'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Group Right: End / Leave Button (Red Accent Zoom iconic) */}
      <div className="relative">
        <button
          onClick={() => setShowLeaveConfirm(!showLeaveConfirm)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-rose-950/40 transition-colors cursor-pointer"
        >
          <PhoneOff className="w-4 h-4" />
          <span className="hidden sm:inline">Akhiri Rapat</span>
        </button>

        {showLeaveConfirm && (
          <div 
            onMouseLeave={() => setShowLeaveConfirm(false)}
            className="absolute bottom-16 right-0 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 text-xs backdrop-blur-xl animate-in fade-in zoom-in-95 space-y-2"
          >
            <div className="font-semibold text-slate-200 pb-1 border-b border-slate-800">
              Konfirmasi Keluar Rapat
            </div>
            {localParticipant.role === 'host' && (
              <button
                onClick={() => {
                  setShowLeaveConfirm(false);
                  onLeaveMeeting();
                }}
                className="w-full text-left py-2 px-3 bg-rose-600/90 hover:bg-rose-600 text-white font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Akhiri Rapat untuk Semua
              </button>
            )}
            <button
              onClick={() => {
                setShowLeaveConfirm(false);
                onLeaveMeeting();
              }}
              className="w-full text-left py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Tinggalkan Rapat Saja
            </button>
            <button
              onClick={() => setShowLeaveConfirm(false)}
              className="w-full text-center py-1.5 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Batal
            </button>
          </div>
        )}
      </div>
    </footer>
  );
};
