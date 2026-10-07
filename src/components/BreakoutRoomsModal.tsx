import React, { useState } from 'react';
import { 
  X, 
  Grid, 
  Users, 
  Send, 
  Play, 
  Square, 
  Shuffle, 
  ChevronRight, 
  DoorOpen 
} from 'lucide-react';
import { BreakoutRoom, Participant } from '../types/meeting';

interface BreakoutRoomsModalProps {
  rooms: BreakoutRoom[];
  participants: Participant[];
  onClose: () => void;
  onCreateRooms: (roomCount: number) => void;
  onOpenAllRooms: () => void;
  onCloseAllRooms: () => void;
  onBroadcastMessage: (msg: string) => void;
  onJoinRoom: (roomId: string) => void;
}

export const BreakoutRoomsModal: React.FC<BreakoutRoomsModalProps> = ({
  rooms,
  participants,
  onClose,
  onCreateRooms,
  onOpenAllRooms,
  onCloseAllRooms,
  onBroadcastMessage,
  onJoinRoom,
}) => {
  const [selectedCount, setSelectedCount] = useState(4);
  const [broadcastText, setBroadcastText] = useState('');
  const [activeTab, setActiveTab] = useState<'rooms' | 'broadcast'>('rooms');

  const areRoomsOpen = rooms.some((r) => r.isOpen);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    onBroadcastMessage(broadcastText.trim());
    setBroadcastText('');
    alert('Pesan siaran berhasil dikirim ke seluruh ruang terpisah!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-pink-400" />
            <div>
              <h3 className="font-bold text-white text-base">Ruang Terpisah (Breakout Rooms)</h3>
              <p className="text-[11px] text-slate-400">
                Bagi 100 peserta rapat menjadi kelompok diskusi kecil terpisah
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center border-b border-slate-800 px-4 bg-slate-900 text-xs">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`py-2.5 px-3 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'rooms'
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Daftar Ruangan ({rooms.length})
          </button>
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`py-2.5 px-3 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'broadcast'
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Siarkan Pesan ke Semua Ruang
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[60vh] space-y-4">
          {activeTab === 'rooms' ? (
            rooms.length === 0 ? (
              // Initial Creation Setup
              <div className="space-y-4 py-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center mx-auto">
                  <Grid className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Buat Ruang Terpisah</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    Bagi {participants.length} peserta secara otomatis ke dalam ruang diskusi terpisah yang aman.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <span className="text-xs text-slate-300 font-medium">Bagi menjadi:</span>
                  <select
                    value={selectedCount}
                    onChange={(e) => setSelectedCount(Number(e.target.value))}
                    className="bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-pink-500"
                  >
                    {[2, 3, 4, 5, 8, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} Ruangan (~{Math.round(participants.length / num)} peserta/ruang)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => onCreateRooms(selectedCount)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs rounded-xl shadow-lg cursor-pointer transition-colors"
                  >
                    <Shuffle className="w-4 h-4" />
                    <span>Buat & Bagi Peserta Otomatis</span>
                  </button>
                </div>
              </div>
            ) : (
              // Rooms List
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs text-slate-400">
                    Status: <strong className={areRoomsOpen ? 'text-emerald-400' : 'text-slate-400'}>
                      {areRoomsOpen ? 'Ruangan Sedang Aktif' : 'Ruangan Belum Dibuka'}
                    </strong>
                  </span>
                  <button
                    onClick={() => onCreateRooms(selectedCount)}
                    className="text-xs text-pink-400 hover:text-pink-300 font-medium cursor-pointer"
                  >
                    Atur Ulang Distribusi
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex flex-col justify-between gap-3 hover:border-slate-600 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${room.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                          <h5 className="font-semibold text-xs text-white">{room.name}</h5>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {room.participantIds.length} peserta
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                        <span className="text-[10px] text-slate-400">
                          {room.isOpen ? 'Sesi sedang berjalan' : 'Menunggu dibuka'}
                        </span>
                        <button
                          onClick={() => onJoinRoom(room.id)}
                          className="flex items-center gap-1 text-[11px] text-pink-400 hover:text-pink-300 font-semibold cursor-pointer"
                        >
                          <DoorOpen className="w-3.5 h-3.5" />
                          <span>Masuk Ruang</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            // Broadcast Message
            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Pesan Siaran untuk Seluruh Ruang Terpisah
                </label>
                <textarea
                  rows={4}
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  placeholder="Contoh: Diskusi tersisa 5 menit lagi, mohon persiapkan perwakilan kelompok..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Pesan Siaran</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        {rooms.length > 0 && activeTab === 'rooms' && (
          <div className="p-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => onCreateRooms(selectedCount)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Hapus Semua Ruang
            </button>

            <div className="flex items-center gap-2">
              {areRoomsOpen ? (
                <button
                  onClick={onCloseAllRooms}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Tutup Semua Ruang Terpisah</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAllRooms}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Buka Semua Ruang Terpisah</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
