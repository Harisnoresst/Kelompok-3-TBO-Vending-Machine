import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ArrowDownCircle } from 'lucide-react';

interface MoneyDisplayProps {
  insertedAmount: number;
  change: number;
  selectedPrice: number;
}

export default function MoneyDisplay({ insertedAmount, change, selectedPrice }: MoneyDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-3xl shadow-xl p-6"
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Wallet size={20} />
            <span className="text-sm font-medium opacity-80">Total Uang Masuk</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={insertedAmount}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="text-4xl font-bold font-mono"
            >
              Rp {insertedAmount.toLocaleString('id-ID')}
            </motion.div>
          </AnimatePresence>
        </div>

        {selectedPrice > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border-2 border-blue-200"
          >
            <div className="text-sm text-gray-600 mb-1">Harga Produk</div>
            <div className="text-2xl font-bold text-blue-600">
              Rp {selectedPrice.toLocaleString('id-ID')}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {change > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center gap-2 mb-3">
                <ArrowDownCircle size={20} />
                <span className="text-sm font-medium">Kembalian Anda</span>
              </div>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold font-mono"
              >
                Rp {change.toLocaleString('id-ID')}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-3 text-sm opacity-90"
              >
                Silahkan ambil kembalian Anda
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {insertedAmount > 0 && selectedPrice > 0 && insertedAmount < selectedPrice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 border-2 border-rose-200"
          >
            <div className="text-sm text-rose-600 font-medium">
              Uang kurang Rp {(selectedPrice - insertedAmount).toLocaleString('id-ID')}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
