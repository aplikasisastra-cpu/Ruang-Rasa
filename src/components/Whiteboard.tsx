import React, { useRef, useState, useEffect } from 'react';
import { 
  Pen, 
  Highlighter, 
  Eraser, 
  Square, 
  Circle, 
  Minus, 
  RotateCcw, 
  Trash2, 
  Download, 
  X,
  Type
} from 'lucide-react';

interface WhiteboardProps {
  onClose: () => void;
  collaboratorName?: string;
}

type Tool = 'pen' | 'highlighter' | 'eraser' | 'rect' | 'circle' | 'line' | 'text';

export const Whiteboard: React.FC<WhiteboardProps> = ({ onClose, collaboratorName = 'Host & Peserta' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState<string>('#3b82f6');
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [history, setHistory] = useState<ImageData[]>([]);

  const colors = [
    '#ffffff', // White
    '#ef4444', // Red
    '#f97316', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#06b6d4', // Cyan
    '#3b82f6', // Blue
    '#a855f7', // Purple
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions based on client rect
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      // preserve current drawing if resizing
      const tempImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx.fillStyle = '#1e293b'; // slate-800 backdrop
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid dots
      ctx.fillStyle = '#334155';
      const gap = 28;
      for (let x = gap; x < canvas.width; x += gap) {
        for (let y = gap; y < canvas.height; y += gap) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (tempImage.data.length > 0) {
        ctx.putImageData(tempImage, 0, 0);
      }
      saveState();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    try {
      const state = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory((prev) => [...prev.slice(-15), state]);
    } catch {
      // ignore
    }
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    newHistory.pop(); // Remove current
    const previous = newHistory[newHistory.length - 1];
    if (previous) {
      ctx.putImageData(previous, 0, 0);
      setHistory(newHistory);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw grid dots
    ctx.fillStyle = '#334155';
    const gap = 28;
    for (let x = gap; x < canvas.width; x += gap) {
      for (let y = gap; y < canvas.height; y += gap) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    saveState();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `RuangRasa_PapanTulis_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getPos(e);
    setIsDrawing(true);
    setStartPos(pos);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'text') {
      const text = prompt('Ketik teks catatan papan tulis:');
      if (text) {
        ctx.fillStyle = color;
        ctx.font = 'bold 18px Plus Jakarta Sans, sans-serif';
        ctx.fillText(text, pos.x, pos.y);
        saveState();
      }
      setIsDrawing(false);
      return;
    }

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);

    if (tool === 'pen') {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === 'highlighter') {
      ctx.strokeStyle = `${color}40`; // 25% opacity
      ctx.lineWidth = lineWidth * 3.5;
      ctx.lineCap = 'square';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = lineWidth * 5;
      ctx.lineCap = 'round';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);

    if (tool === 'rect') {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      const width = pos.x - startPos.x;
      const height = pos.y - startPos.y;
      ctx.strokeRect(startPos.x, startPos.y, width, height);
    } else if (tool === 'circle') {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      const radius = Math.sqrt(
        Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2)
      );
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (tool === 'line') {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    ctx.closePath();
    saveState();
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-900 border border-slate-700/60 rounded-xl overflow-hidden shadow-2xl">
      {/* Top Header of Whiteboard */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/90 border-b border-slate-700/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-sm text-slate-100">Papan Tulis Kolaboratif Zoom</span>
          </div>
          <span className="text-xs text-slate-400 border-l border-slate-700 pl-3">
            Kolaborasi Aktif: {collaboratorName} (100 Peserta dapat melihat)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            title="Unduh Papan Tulis (.png)"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Simpan</span>
          </button>
          <button
            onClick={onClose}
            title="Tutup Papan Tulis"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 bg-slate-800 overflow-hidden cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full h-full block"
        />

        {/* Floating Toolbar on Bottom Center */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-2 bg-slate-900/95 border border-slate-700 shadow-xl rounded-xl backdrop-blur-md">
          {/* Tool Selection */}
          <div className="flex items-center gap-1 pr-2 border-r border-slate-700/80">
            <button
              onClick={() => setTool('pen')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                tool === 'pen' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Pena Gambar"
            >
              <Pen className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTool('highlighter')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                tool === 'highlighter' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Stabilo Transparan"
            >
              <Highlighter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                tool === 'eraser' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Penghapus"
            >
              <Eraser className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTool('text')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                tool === 'text' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Teks Catatan"
            >
              <Type className="w-4 h-4" />
            </button>
          </div>

          {/* Shapes */}
          <div className="flex items-center gap-1 pr-2 border-r border-slate-700/80">
            <button
              onClick={() => setTool('rect')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                tool === 'rect' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Persegi"
            >
              <Square className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTool('circle')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                tool === 'circle' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Lingkaran"
            >
              <Circle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTool('line')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                tool === 'line' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Garis Lurus"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Colors */}
          <div className="flex items-center gap-1.5 pr-2 border-r border-slate-700/80">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                  color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'opacity-80 hover:opacity-100'
                }`}
                title={`Pilih Warna ${c}`}
              />
            ))}
          </div>

          {/* Stroke Width */}
          <div className="flex items-center gap-1.5 pr-2 border-r border-slate-700/80">
            {[2, 4, 8].map((w) => (
              <button
                key={w}
                onClick={() => setLineWidth(w)}
                className={`w-6 h-6 rounded flex items-center justify-center text-xs font-semibold cursor-pointer ${
                  lineWidth === w ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {w}
              </button>
            ))}
          </div>

          {/* Undo and Clear */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Urungkan (Undo)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleClear}
              className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
              title="Bersihkan Semua Papan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
