import React, { useState } from 'react';
import { X, BarChart2, Plus, Check, Play, Square, Award } from 'lucide-react';
import { PollQuestion } from '../types/meeting';

interface PollsModalProps {
  polls: PollQuestion[];
  onClose: () => void;
  onVote: (pollId: string, optionId: string) => void;
  onCreatePoll: (question: string, options: string[]) => void;
  onEndPoll: (pollId: string) => void;
}

export const PollsModal: React.FC<PollsModalProps> = ({
  polls,
  onClose,
  onVote,
  onCreatePoll,
  onEndPoll,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['Sangat Setuju', 'Cukup Setuju', 'Perlu Diskusi Lanjut']);

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, `Pilihan ${options.length + 1}`]);
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    const validOptions = options.filter((o) => o.trim().length > 0);
    if (validOptions.length < 2) return;

    onCreatePoll(newQuestion.trim(), validOptions);
    setIsCreating(false);
    setNewQuestion('');
    setOptions(['Sangat Setuju', 'Cukup Setuju', 'Perlu Diskusi Lanjut']);
  };

  const activePoll = polls.find((p) => p.isActive) || polls[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white text-base">Polling Interaktif Rapat</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[70vh] space-y-4">
          {!isCreating && activePoll ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                  activePoll.isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {activePoll.isActive ? '● Polling Sedang Berlangsung' : 'Polling Selesai'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Total Suara: {activePoll.totalVotes} dari 100 peserta
                </span>
              </div>

              <h4 className="text-base font-semibold text-white">
                {activePoll.question}
              </h4>

              {/* Options & Results */}
              <div className="space-y-2.5">
                {activePoll.options.map((opt) => {
                  const percentage = activePoll.totalVotes > 0
                    ? Math.round((opt.votes / activePoll.totalVotes) * 100)
                    : 0;
                  const isUserChoice = activePoll.userVoteId === opt.id;

                  return (
                    <div
                      key={opt.id}
                      className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 relative overflow-hidden"
                    >
                      {/* Progress background bar */}
                      <div
                        className="absolute inset-y-0 left-0 bg-blue-600/20 border-r border-blue-500/30 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />

                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {activePoll.isActive && !activePoll.hasVoted ? (
                            <button
                              onClick={() => onVote(activePoll.id, opt.id)}
                              className="w-5 h-5 rounded-full border border-slate-500 hover:border-blue-400 hover:bg-blue-600/30 flex items-center justify-center cursor-pointer transition-colors"
                            />
                          ) : isUserChoice ? (
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          ) : null}

                          <span className="text-xs font-medium text-slate-100">
                            {opt.text}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="text-slate-400">{opt.votes} suara</span>
                          <span className="font-bold text-blue-400">{percentage}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Poll Controls */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Polling Baru</span>
                </button>

                {activePoll.isActive && (
                  <button
                    onClick={() => onEndPoll(activePoll.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Akhiri Polling</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            // Create Poll Form
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Pertanyaan Polling
                </label>
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Contoh: Apakah format laporan disetujui?"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Opsi Jawaban
                </label>
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-5 text-center text-xs text-slate-500 font-mono">
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                ))}

                {options.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-medium cursor-pointer pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Opsi Jawaban</span>
                  </button>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Luncurkan Polling ke 100 Orang</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
