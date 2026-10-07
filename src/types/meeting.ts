export interface Participant {
  id: string;
  name: string;
  role: 'host' | 'co-host' | 'participant';
  avatarBg: string;
  avatarUrl?: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isHandRaised: boolean;
  isScreenSharing?: boolean;
  breakoutRoomId?: string | null;
  connectionQuality: 'excellent' | 'good' | 'poor';
  isSpeaking?: boolean;
  recentReaction?: {
    emoji: string;
    timestamp: number;
  };
  city?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole?: 'host' | 'co-host' | 'participant';
  recipientId: 'everyone' | string; // 'everyone' or participant ID
  recipientName?: string;
  text: string;
  timestamp: string;
  fileAttachment?: {
    name: string;
    size: string;
  };
}

export interface PollQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  totalVotes: number;
  isActive: boolean;
  hasVoted?: boolean;
  userVoteId?: string;
}

export interface BreakoutRoom {
  id: string;
  name: string;
  participantIds: string[];
  isOpen: boolean;
}

export interface MeetingDetails {
  id: string;
  topic: string;
  passcode: string;
  hostName: string;
  startTime: Date;
  inviteLink: string;
  isLocked: boolean;
  isWaitingRoomEnabled: boolean;
  allowParticipantScreenShare: boolean;
  allowParticipantChat: boolean;
  allowParticipantUnmute: boolean;
  isRecording: boolean;
}

export type ViewMode = 'gallery' | 'speaker' | 'whiteboard' | 'screenshare';
export type GridSize = 4 | 9 | 16 | 25 | 49;
