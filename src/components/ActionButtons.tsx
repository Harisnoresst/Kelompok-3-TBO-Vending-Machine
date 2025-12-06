import { motion } from 'framer-motion';
import { CheckCircle, RotateCw } from 'lucide-react';

interface ActionButtonsProps {
  onProcess: () => void;
  onComplete: () => void;
  canProcess: boolean;
}

export default function ActionButtons({ onProcess, onComplete, canProcess }: ActionButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-3xl shadow-xl p-6"
    >
      <h3 className="font-bold text-gray-800 text-lg mb-4">Aksi</h3>
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: canProcess ? 1.02 : 1 }}
          whileTap={{ scale: canProcess ? 0.98 : 1 }}
          onClick={onProcess}
          disabled={!canProcess}
          className={`w-full py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
            canProcess
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <RotateCw size={22} />
          PROSES
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all flex items-center justify-center gap-3"
        >
          <CheckCircle size={22} />
          SELESAI
        </motion.button>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200">
        <p className="text-sm text-gray-600 text-center">
          Klik <span className="font-semibold text-amber-600">PROSES</span> untuk membeli produk
        </p>
      </div>
    </motion.div>
  );
}
