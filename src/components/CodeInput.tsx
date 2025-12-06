import { motion, AnimatePresence } from 'framer-motion';
import NumericKeypad from './NumericKeypad';
import { Package } from 'lucide-react';

interface CodeInputProps {
  code: string;
  onCodeChange: (code: string) => void;
  onSubmit: () => void; // <--- TAMBAHKAN INI (Menerima fungsi dari App.tsx)
}

export default function CodeInput({ code, onCodeChange, onSubmit }: CodeInputProps) {
  
  // Fungsi helper untuk handle angka
  const handleNumberClick = (num: string) => {
    if (code.length < 4) { // Batasi panjang kode misal 4 digit
       onCodeChange(code + num);
    }
  };

  const handleDelete = () => {
    onCodeChange(code.slice(0, -1));
  };

  const handleClear = () => {
    onCodeChange('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
          {/* Icon dsb */}
          Masukkan Kode
        </h3>
        <p className="text-gray-500 text-sm">Pilih produk atau ketik kode</p>
      </div>

      {/* Tampilan Layar Input Code */}
      <div className="bg-gray-100 p-4 rounded-xl text-center mb-4 font-mono text-2xl font-bold text-gray-700 tracking-widest min-h-[64px] flex items-center justify-center">
        {code || "- - - -"}
      </div>

      {/* KEYPAD */}
      {/* Di sini kita sambungkan onSubmit dari props ke keypad */}
      <NumericKeypad 
        onNumberClick={handleNumberClick}
        onDelete={handleDelete}
        onClear={handleClear}
        onSubmit={onSubmit} // <--- SAMBUNGKAN DI SINI
      />
    </div>
  );
}