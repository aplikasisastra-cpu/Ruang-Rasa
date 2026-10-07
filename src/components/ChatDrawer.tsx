import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Smile, 
  Paperclip, 
  Download, 
  Users, 
  Lock, 
  FileText 
} from 'lucide-react';
import { ChatMessage, Participant } from '../types/meeting';

interface ChatDrawerProps {
  messages: ChatMessage[];
  participants: Participant[];
  currentUserId: string;
  onClose: () => void;
  onSendMessage: (text: string, recipientId: string, fileAttachment?: { name: string; size: string }) => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  messages,
  participants,
  currentUserId,
  onClose,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const [recipientId, setRecipientId] = useState<'everyone' | string>('everyone');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const emojis = ['👍', '👏', '🙏', '❤️', '💡', '🎉', '😊', '✅', '🚀'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(inputText.trim(), recipientId);
    setInputText('');
  };

  const handleAttachDemoFile = () => {
    onSendMessage(
      'Membagikan materi presentasi rapat:',
      recipientId,
      {
        name: 'Slide_Materi_RuangRasa_2026.pdf',
        size: '4.2 MB',
      }
    );
  };

  const handleExportChat = () => {
    const textContent = messages
      .map((m) => `[${m.timestamp}] ${m.senderName} -> ${m.recipientId === 'everyone' ? 'Semua' : m.recipientName || 'Private'}: ${m.text}`)
      .join('\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RuangRasa_CatatanObrolan_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-80 sm:w-96 h-full bg-slate-900 border-l border-slate-800 flex flex-col z-30 select-none shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-white text-base">Obrolan Dalam Rapat</h3>
          <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-400 font-semibold border border-indigo-500/40">
            {messages.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleExportChat}
            title="Simpan Riwayat Obrolan (.txt)"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recipient Selector (Everyone or Direct Message to 100 participants) */}
      <div className="px-4 py-2.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">Kirim ke:</span>
        <select
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 max-w-[200px] truncate"
        >
          <option value="everyone">Semua Orang (Publik)</option>
          {participants
            .filter((p) => p.id !== currentUserId)
            .map((p) => (
              <option key={p.id} value={p.id}>
                🔒 {p.name} {p.role === 'host' ? '(Host)' : ''} (Pesan Pribadi)
              </option>
            ))}
        </select>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          const isDirect = msg.recipientId !== 'everyone';

          return (
            <div
              key={msg.id}
              className={`flex flex-col space-y-1 ${
                isMe ? 'items-end' : 'items-start'
              }`}
            >
              {/* Sender Name & Meta */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-200">
                  {isMe ? 'Anda' : msg.senderName}
                </span>
                {isDirect && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-400 font-medium bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30">
                    <Lock className="w-2.5 h-2.5" />
                    {isMe ? `ke ${msg.recipientName || 'Peserta'}` : '(Pribadi)'}
                  </span>
                )}
                <span className="font-mono text-[10px]">{msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-sm ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : isDirect
                    ? 'bg-slate-800 text-amber-200 border border-amber-500/30 rounded-tl-xs'
                    : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-tl-xs'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                {/* File Attachment Card */}
                {msg.fileAttachment && (
                  <div className="mt-2 p-2 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <div className="truncate">
                        <span className="block font-medium text-slate-200 truncate text-[11px]">
                          {msg.fileAttachment.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {msg.fileAttachment.size}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Mengunduh file: ${msg.fileAttachment?.name}`)}
                      className="p-1 hover:bg-slate-800 text-blue-400 rounded cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Bar Picker */}
      {showEmojiPicker && (
        <div className="p-2 bg-slate-850 border-t border-slate-800 flex items-center justify-around">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                setInputText((prev) => prev + emoji);
                setShowEmojiPicker(false);
              }}
              className="text-lg hover:scale-125 transition-transform cursor-pointer p-1"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input Box Footer */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-900">
        <div className="relative bg-slate-800 border border-slate-700/80 rounded-2xl p-2 focus-within:border-blue-500">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={2}
            placeholder={
              recipientId === 'everyone'
                ? 'Ketik pesan ke 100 peserta rapat...'
                : 'Ketik pesan pribadi...'
            }
            className="w-full bg-transparent text-xs text-white placeholder-slate-400 resize-none focus:outline-none scrollbar-none"
          />

          <div className="flex items-center justify-between pt-1 border-t border-slate-700/50 mt-1">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer rounded"
                title="Sisipkan Emoji"
              >
                <Smile className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleAttachDemoFile}
                className="p-1 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer rounded"
                title="Kirim Dokumen / File Presentasi"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            </div>

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <span>Kirim</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
