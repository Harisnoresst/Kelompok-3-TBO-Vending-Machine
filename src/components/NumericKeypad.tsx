import { motion } from 'framer-motion';
import { Delete } from 'lucide-react';

interface NumericKeypadProps {
  onNumberClick: (num: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onSubmit: () => void;
}

export default function NumericKeypad({ onNumberClick, onDelete, onClear, onSubmit }: NumericKeypadProps) {
  const buttons = [
    '0', '1', '2', '3', '4',
    '5', '6', '7', '8', '9', 'D', 'S'
  ];

  // --- FUNGSI PEMUTAR SUARA ---
  const playClickSound = () => {
    // Pastikan path file sesuai dengan yang ada di folder public
    const audio = new Audio('${BASE}sounds/click.mp3');
    audio.volume = 0.5; // Atur volume (0.0 sampai 1.0)
    audio.currentTime = 0; // Agar kalau dipencet cepat suaranya tidak delay
    audio.play().catch((e) => console.log("Audio error:", e));
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {buttons.map((btn) => (
        <motion.button
          key={btn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playClickSound(); // <--- BUNYI DI SINI
            onNumberClick(btn);
          }}
          className="bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl shadow-md transition-all text-lg"
        >
          {btn}
        </motion.button>
      ))}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          playClickSound(); 
          onClear();
        }}
        className="bg-gradient-to-br from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl shadow-md transition-all text-sm"
      >
        HAPUS
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          playClickSound(); 
          onDelete();
        }}
        className="col-span-2 bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
      >
        <Delete size={18} />
        <span>DEL</span>
      </motion.button>

      {/* TOMBOL OK */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
            playClickSound(); // <--- BUNYI DI SINI
            onSubmit();
        }} 
        className="bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl shadow-md transition-all"
      >
        OK
      </motion.button>
    </div>
  );
}