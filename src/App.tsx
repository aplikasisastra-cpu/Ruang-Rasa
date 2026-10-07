/**
 * Ruang Rasa - Aplikasi Video Conference 100 Peserta & Durasi Tanpa Batas Waktu
 * @license Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Participant, ChatMessage, PollQuestion, BreakoutRoom, MeetingDetails, ViewMode } from './types/meeting';
import { generateInitialParticipants } from './data/mockParticipants';
import { VIRTUAL_BACKGROUNDS, VirtualBackground } from './data/virtualBackgrounds';
import { playSound } from './utils/audioEffects';

import { Lobby } from './components/Lobby';
import { PreMeetingRoom } from './components/PreMeetingRoom';
import { MeetingHeader } from './components/MeetingHeader';
import { VideoGrid } from './components/VideoGrid';
import { MeetingControls } from './components/MeetingControls';
import { Whiteboard } from './components/Whiteboard';
import { ScreenShareStage } from './components/ScreenShareStage';
import { ParticipantsDrawer } from './components/ParticipantsDrawer';
import { ChatDrawer } from './components/ChatDrawer';
import { BreakoutRoomsModal } from './components/BreakoutRoomsModal';
import { PollsModal } from './components/PollsModal';
import { SettingsModal } from './components/SettingsModal';
import { InviteModal } from './components/InviteModal';
import { SecurityModal } from './components/SecurityModal';
import { ScheduleModal } from './components/ScheduleModal';

type AppStage = 'lobby' | 'premeeting' | 'meeting';

export default function App() {
  const [stage, setStage] = useState<AppStage>('lobby');
  const [userName, setUserName] = useState<string>('Host (Anda)');
  const [userEmail] = useState<string>('aplikasisastra@gmail.com');

  // Participants (100 total: 1 Local Host + 99 Peers)
  const [participants, setParticipants] = useState<Participant[]>(() => generateInitialParticipants('Host'));
  const currentUserId = 'user-host-local';

  // Audio / Video Streams
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [selectedBg, setSelectedBg] = useState<VirtualBackground>(VIRTUAL_BACKGROUNDS[0]);

  // Views & Focus
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);
  const [pinnedParticipantId, setPinnedParticipantId] = useState<string | null>(null);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);

  // Unlimited Duration Meeting Timer (Never stops, no 40 min limit)
  const [durationSeconds, setDurationSeconds] = useState(0);

  // Meeting Metadata
  const [meetingDetails, setMeetingDetails] = useState<MeetingDetails>({
    id: '842 9102 3841',
    topic: 'Rapat Koordinasi Tim Ruang Rasa (100 Peserta)',
    passcode: '739201',
    hostName: 'Host (Anda)',
    startTime: new Date(),
    inviteLink: `${window.location.origin}/?j=84291023841`,
    isLocked: false,
    isWaitingRoomEnabled: false,
    allowParticipantScreenShare: true,
    allowParticipantChat: true,
    allowParticipantUnmute: true,
    isRecording: false,
  });

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      senderId: 'participant-1',
      senderName: 'Siti Rahmawati',
      senderRole: 'co-host',
      recipientId: 'everyone',
      text: 'Selamat pagi rekan-rekan sekalian, selamat bergabung di Ruang Rasa 100 peserta!',
      timestamp: '10:01',
    },
    {
      id: 'msg-2',
      senderId: 'participant-2',
      senderName: 'Budi Santoso',
      senderRole: 'participant',
      recipientId: 'everyone',
      text: 'Pagi Bu Siti dan Pak Host. Audio dan video sangat jernih di Surabaya.',
      timestamp: '10:02',
    },
    {
      id: 'msg-3',
      senderId: 'participant-4',
      senderName: 'Prof. Maya Kusuma, M.Sc',
      senderRole: 'participant',
      recipientId: 'everyone',
      text: 'Senang sekali durasi rapat ini tanpa batas waktu, pembahasan kurikulum bisa tuntas hari ini.',
      timestamp: '10:03',
    },
  ]);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  // Polls state
  const [polls, setPolls] = useState<PollQuestion[]>([
    {
      id: 'poll-1',
      question: 'Apakah durasi tanpa batas waktu ini mencukupi untuk seluruh agenda rapat hari ini?',
      options: [
        { id: 'opt-1', text: 'Sangat Cukup & Efektif', votes: 72 },
        { id: 'opt-2', text: 'Cukup', votes: 24 },
        { id: 'opt-3', text: 'Perlu Sesi Tambahan', votes: 4 },
      ],
      totalVotes: 100,
      isActive: false,
      hasVoted: true,
      userVoteId: 'opt-1',
    },
  ]);

  // Breakout rooms state
  const [breakoutRooms, setBreakoutRooms] = useState<BreakoutRoom[]>([]);

  // Drawers and Modals
  const [isParticipantsDrawerOpen, setIsParticipantsDrawerOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [isBreakoutModalOpen, setIsBreakoutModalOpen] = useState(false);
  const [isPollsModalOpen, setIsPollsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsModalTab, setSettingsModalTab] = useState<'audio' | 'video' | 'background'>('video');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Initialize or request Webcam & Mic stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (stage === 'premeeting' || stage === 'meeting') {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then((s) => {
          stream = s;
          setLocalStream(s);
        })
        .catch(() => {
          // Fallback if camera denied/not available
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stage]);

  // Handle local mic mute toggle on MediaStream
  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted, localStream]);

  // Handle local video toggle on MediaStream
  useEffect(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOn;
      });
    }
  }, [isVideoOn, localStream]);

  // Sync Host Participant profile
  useEffect(() => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === currentUserId) {
          return {
            ...p,
            name: `${userName} (Anda)`,
            isMuted,
            isVideoOn,
          };
        }
        return p;
      })
    );
  }, [userName, isMuted, isVideoOn]);

  // Unlimited Meeting Timer
  useEffect(() => {
    if (stage !== 'meeting') return;
    const interval = setInterval(() => {
      setDurationSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [stage]);

  // Simulated active speaker shifts among the 100 participants
  useEffect(() => {
    if (stage !== 'meeting') return;
    const interval = setInterval(() => {
      // Pick random participant from the first 12 active ones
      const randomIdx = Math.floor(Math.random() * 12);
      const speaker = participants[randomIdx];
      if (speaker) {
        setActiveSpeakerId(speaker.id);
        setParticipants((prev) =>
          prev.map((p) => ({
            ...p,
            isSpeaking: p.id === speaker.id,
          }))
        );
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [stage, participants.length]);

  // Controls Handlers
  const handleToggleMic = () => {
    setIsMuted((prev) => !prev);
    playSound.toggleClick();
  };

  const handleToggleVideo = () => {
    setIsVideoOn((prev) => !prev);
    playSound.toggleClick();
  };

  const handleToggleScreenShare = async () => {
    if (isSharingScreen) {
      if (screenStream) {
        screenStream.getTracks().forEach((t) => t.stop());
        setScreenStream(null);
      }
      setIsSharingScreen(false);
      setViewMode('gallery');
    } else {
      try {
        if (navigator.mediaDevices?.getDisplayMedia) {
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          setScreenStream(stream);
          stream.getVideoTracks()[0].onended = () => {
            setIsSharingScreen(false);
            setScreenStream(null);
            setViewMode('gallery');
          };
        }
      } catch {
        // Fallback to high-res built-in presentation deck
      }
      setIsSharingScreen(true);
      setViewMode('screenshare');
    }
  };

  const handleToggleWhiteboard = () => {
    setIsWhiteboardOpen((prev) => {
      const next = !prev;
      setViewMode(next ? 'whiteboard' : 'gallery');
      return next;
    });
  };

  const handleToggleRecording = () => {
    setMeetingDetails((prev) => {
      const nextState = !prev.isRecording;
      if (nextState) {
        alert('Perekaman rapat dimulai. Seluruh 100 peserta diberitahu bahwa rapat sedang direkam.');
      } else {
        alert('Perekaman dihentikan. File rekaman cloud siap diunduh.');
      }
      return { ...prev, isRecording: nextState };
    });
  };

  const handleSendReaction = (emoji: string) => {
    // Show reaction on local tile and float
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === currentUserId
          ? {
              ...p,
              recentReaction: {
                emoji,
                timestamp: Date.now(),
              },
            }
          : p
      )
    );
  };

  const handleToggleHandRaise = () => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === currentUserId) {
          const nextHand = !p.isHandRaised;
          if (nextHand) playSound.handRaise();
          return { ...p, isHandRaised: nextHand };
        }
        return p;
      })
    );
  };

  const handleMuteParticipant = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isMuted: !p.isMuted } : p))
    );
    playSound.toggleClick();
  };

  const handleMuteAll = () => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === currentUserId ? p : { ...p, isMuted: true }))
    );
    alert('Seluruh peserta selain Host telah dibisukan.');
    playSound.toggleClick();
  };

  const handleToggleHand = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isHandRaised: !p.isHandRaised } : p))
    );
  };

  const handleMakeCoHost = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, role: p.role === 'co-host' ? 'participant' : 'co-host' }
          : p
      )
    );
  };

  const handleTogglePin = (id: string) => {
    setPinnedParticipantId((prev) => (prev === id ? null : id));
  };

  // Chat message sending
  const handleSendMessage = (
    text: string,
    recipientId: string,
    fileAttachment?: { name: string; size: string }
  ) => {
    const recipient = participants.find((p) => p.id === recipientId);
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      senderName: userName,
      senderRole: 'host',
      recipientId,
      recipientName: recipient?.name,
      text,
      timestamp: timeStr,
      fileAttachment,
    };

    setChatMessages((prev) => [...prev, newMsg]);
    playSound.chatMessage();
  };

  // Polls voting & creation
  const handleVote = (pollId: string, optionId: string) => {
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id === pollId) {
          return {
            ...poll,
            totalVotes: poll.totalVotes + 1,
            hasVoted: true,
            userVoteId: optionId,
            options: poll.options.map((opt) =>
              opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            ),
          };
        }
        return poll;
      })
    );
  };

  const handleCreatePoll = (question: string, optionsText: string[]) => {
    const newPoll: PollQuestion = {
      id: `poll-${Date.now()}`,
      question,
      options: optionsText.map((t, i) => ({
        id: `opt-${i}`,
        text: t,
        votes: 0,
      })),
      totalVotes: 0,
      isActive: true,
      hasVoted: false,
    };

    setPolls((prev) => [newPoll, ...prev]);
    alert('Polling baru berhasil diluncurkan ke seluruh 100 peserta rapat!');

    // Simulate remote participants voting within 5 seconds
    setTimeout(() => {
      setPolls((prev) =>
        prev.map((poll) => {
          if (poll.id === newPoll.id) {
            return {
              ...poll,
              totalVotes: 98,
              options: poll.options.map((opt, i) => ({
                ...opt,
                votes: i === 0 ? 64 : Math.round(34 / (poll.options.length - 1 || 1)),
              })),
            };
          }
          return poll;
        })
      );
    }, 2500);
  };

  const handleEndPoll = (pollId: string) => {
    setPolls((prev) =>
      prev.map((p) => (p.id === pollId ? { ...p, isActive: false } : p))
    );
  };

  // Breakout rooms management
  const handleCreateBreakoutRooms = (count: number) => {
    const peerIds = participants.filter((p) => p.id !== currentUserId).map((p) => p.id);
    const rooms: BreakoutRoom[] = [];

    for (let i = 0; i < count; i++) {
      rooms.push({
        id: `room-${i + 1}`,
        name: `Ruang Terpisah ${i + 1}`,
        participantIds: [],
        isOpen: false,
      });
    }

    // Distribute 99 peers across the rooms
    peerIds.forEach((pid, index) => {
      const targetRoom = rooms[index % count];
      targetRoom.participantIds.push(pid);
    });

    setBreakoutRooms(rooms);
  };

  const handleOpenAllBreakoutRooms = () => {
    setBreakoutRooms((prev) => prev.map((r) => ({ ...r, isOpen: true })));
    alert('Seluruh ruang terpisah telah dibuka! 100 peserta telah berpindah ke kelompok masing-masing.');
  };

  const handleCloseAllBreakoutRooms = () => {
    setBreakoutRooms((prev) => prev.map((r) => ({ ...r, isOpen: false })));
    alert('Seluruh ruang terpisah telah ditutup. Semua peserta kembali ke ruang utama.');
  };

  const handleBroadcastBreakoutMessage = (msg: string) => {
    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        senderId: currentUserId,
        senderName: 'Host (Siaran Ruang Terpisah)',
        recipientId: 'everyone',
        text: `📢 SIARAN KE SEMUA RUANG: ${msg}`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleJoinBreakoutRoom = (roomId: string) => {
    const room = breakoutRooms.find((r) => r.id === roomId);
    alert(`Host bergabung ke ${room?.name}.`);
    setIsBreakoutModalOpen(false);
  };

  // Stage Transitions
  const handleStartNewMeeting = () => {
    setStage('premeeting');
  };

  const handleJoinFromLobby = (meetingId: string, name: string) => {
    setUserName(name);
    setMeetingDetails((prev) => ({ ...prev, id: meetingId }));
    setStage('premeeting');
  };

  const handleEnterMeetingFromPre = () => {
    setStage('meeting');
    playSound.doorbell();
  };

  const handleLeaveMeeting = () => {
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      setLocalStream(null);
    }
    if (screenStream) {
      screenStream.getTracks().forEach((t) => t.stop());
      setScreenStream(null);
    }
    setIsSharingScreen(false);
    setIsWhiteboardOpen(false);
    setViewMode('gallery');
    setDurationSeconds(0);
    setStage('lobby');
  };

  // Render View by Stage
  if (stage === 'lobby') {
    return (
      <>
        <Lobby
          onStartNewMeeting={handleStartNewMeeting}
          onJoinMeeting={handleJoinFromLobby}
          onOpenSchedule={() => setIsScheduleModalOpen(true)}
          onOpenSettings={() => {
            setSettingsModalTab('video');
            setIsSettingsModalOpen(true);
          }}
          userEmail={userEmail}
        />

        {isScheduleModalOpen && (
          <ScheduleModal
            onClose={() => setIsScheduleModalOpen(false)}
            onSchedule={(scheduled) => {
              setMeetingDetails((prev) => ({
                ...prev,
                topic: scheduled.topic,
                passcode: scheduled.passcode,
                isWaitingRoomEnabled: scheduled.isWaitingRoom,
              }));
            }}
          />
        )}

        {isSettingsModalOpen && (
          <SettingsModal
            initialTab={settingsModalTab}
            currentBgId={selectedBg.id}
            onSelectBackground={(bg) => setSelectedBg(bg)}
            onClose={() => setIsSettingsModalOpen(false)}
          />
        )}
      </>
    );
  }

  if (stage === 'premeeting') {
    return (
      <PreMeetingRoom
        userName={userName}
        onUpdateUserName={setUserName}
        localStream={localStream}
        isVideoOn={isVideoOn}
        isMuted={isMuted}
        selectedBg={selectedBg}
        onToggleVideo={handleToggleVideo}
        onToggleMic={handleToggleMic}
        onSelectBackground={(bg) => setSelectedBg(bg)}
        onJoinMeeting={handleEnterMeetingFromPre}
        onCancel={() => setStage('lobby')}
      />
    );
  }

  // Active Zoom Meeting Experience
  const localParticipant = participants.find((p) => p.id === currentUserId) || participants[0];

  return (
    <div className="relative w-screen h-screen flex flex-col bg-slate-950 overflow-hidden select-none">
      {/* Top Header */}
      <MeetingHeader
        meetingDetails={meetingDetails}
        viewMode={viewMode}
        onViewModeChange={(mode) => {
          setViewMode(mode);
          if (mode !== 'whiteboard') setIsWhiteboardOpen(false);
        }}
        durationSeconds={durationSeconds}
        totalParticipants={participants.length}
      />

      {/* Main Body (Video Grid / Whiteboard / Screen Share + Drawers) */}
      <div className="relative flex-1 w-full h-full min-h-0 flex overflow-hidden">
        {/* Main Stage View */}
        <div className="relative flex-1 w-full h-full min-h-0 overflow-hidden bg-slate-950">
          {viewMode === 'whiteboard' ? (
            <div className="w-full h-full p-2 sm:p-3">
              <Whiteboard
                onClose={() => {
                  setIsWhiteboardOpen(false);
                  setViewMode('gallery');
                }}
                collaboratorName={userName}
              />
            </div>
          ) : viewMode === 'screenshare' ? (
            <ScreenShareStage
              presenter={localParticipant}
              isLocalPresenter={true}
              screenStream={screenStream}
              onStopScreenShare={() => {
                if (screenStream) {
                  screenStream.getTracks().forEach((t) => t.stop());
                  setScreenStream(null);
                }
                setIsSharingScreen(false);
                setViewMode('gallery');
              }}
            />
          ) : (
            <VideoGrid
              participants={participants}
              currentUserId={currentUserId}
              localStream={localStream}
              virtualBgType={selectedBg.type}
              virtualBgUrl={selectedBg.url}
              viewMode={viewMode}
              activeSpeakerId={activeSpeakerId}
              pinnedParticipantId={pinnedParticipantId}
              onTogglePin={handleTogglePin}
              onMuteParticipant={handleMuteParticipant}
              onToggleHand={handleToggleHand}
              onMakeCoHost={handleMakeCoHost}
            />
          )}
        </div>

        {/* Participants Drawer (Right Panel) */}
        {isParticipantsDrawerOpen && (
          <ParticipantsDrawer
            participants={participants}
            currentUserId={currentUserId}
            onClose={() => setIsParticipantsDrawerOpen(false)}
            onMuteParticipant={handleMuteParticipant}
            onMuteAll={handleMuteAll}
            onToggleHand={handleToggleHand}
            onMakeCoHost={handleMakeCoHost}
            onOpenInviteModal={() => setIsInviteModalOpen(true)}
          />
        )}

        {/* Chat Drawer (Right Panel) */}
        {isChatDrawerOpen && (
          <ChatDrawer
            messages={chatMessages}
            participants={participants}
            currentUserId={currentUserId}
            onClose={() => setIsChatDrawerOpen(false)}
            onSendMessage={handleSendMessage}
          />
        )}
      </div>

      {/* Bottom Zoom Control Toolbar */}
      <MeetingControls
        localParticipant={localParticipant}
        totalParticipants={participants.length}
        unreadChatCount={unreadChatCount}
        isRecording={meetingDetails.isRecording}
        isSharingScreen={isSharingScreen}
        isWhiteboardOpen={isWhiteboardOpen}
        meetingDetails={meetingDetails}
        onToggleMic={handleToggleMic}
        onToggleVideo={handleToggleVideo}
        onToggleScreenShare={handleToggleScreenShare}
        onToggleWhiteboard={handleToggleWhiteboard}
        onToggleParticipantsDrawer={() => {
          setIsParticipantsDrawerOpen((prev) => !prev);
          setIsChatDrawerOpen(false);
        }}
        onToggleChatDrawer={() => {
          setIsChatDrawerOpen((prev) => !prev);
          setIsParticipantsDrawerOpen(false);
          setUnreadChatCount(0);
        }}
        onOpenBreakoutModal={() => setIsBreakoutModalOpen(true)}
        onOpenPollsModal={() => setIsPollsModalOpen(true)}
        onToggleRecording={handleToggleRecording}
        onSendReaction={handleSendReaction}
        onToggleHandRaise={handleToggleHandRaise}
        onOpenSettings={(tab) => {
          if (tab) setSettingsModalTab(tab);
          setIsSettingsModalOpen(true);
        }}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
        onLeaveMeeting={handleLeaveMeeting}
      />

      {/* Modals */}
      {isBreakoutModalOpen && (
        <BreakoutRoomsModal
          rooms={breakoutRooms}
          participants={participants}
          onClose={() => setIsBreakoutModalOpen(false)}
          onCreateRooms={handleCreateBreakoutRooms}
          onOpenAllRooms={handleOpenAllBreakoutRooms}
          onCloseAllRooms={handleCloseAllBreakoutRooms}
          onBroadcastMessage={handleBroadcastBreakoutMessage}
          onJoinRoom={handleJoinBreakoutRoom}
        />
      )}

      {isPollsModalOpen && (
        <PollsModal
          polls={polls}
          onClose={() => setIsPollsModalOpen(false)}
          onVote={handleVote}
          onCreatePoll={handleCreatePoll}
          onEndPoll={handleEndPoll}
        />
      )}

      {isSettingsModalOpen && (
        <SettingsModal
          initialTab={settingsModalTab}
          currentBgId={selectedBg.id}
          onSelectBackground={(bg) => setSelectedBg(bg)}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}

      {isInviteModalOpen && (
        <InviteModal
          meetingDetails={meetingDetails}
          onClose={() => setIsInviteModalOpen(false)}
        />
      )}

      {isSecurityModalOpen && (
        <SecurityModal
          meetingDetails={meetingDetails}
          onUpdateSecurity={(updates) => setMeetingDetails((prev) => ({ ...prev, ...updates }))}
          onClose={() => setIsSecurityModalOpen(false)}
        />
      )}
    </div>
  );
}
