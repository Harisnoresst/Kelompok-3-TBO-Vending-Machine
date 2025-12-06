import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
const BASE = import.meta.env.BASE_URL;

interface MoneyDenomination {
  value: number;
  image: string;
}

interface CashInputProps {
  insertedAmount: number;
  onInsertMoney: (amount: number) => void;
  denominations: MoneyDenomination[];
}

export default function CashInput({ insertedAmount, onInsertMoney, denominations }: CashInputProps) {
  const playClickSound =(amount : number) => {
    let soundFile = `${BASE}sounds/kertas.mp3`;

    if ( amount <= 1000 ) {
      soundFile= `${BASE}sounds/koin.mp3`;
    }

    const audio = new Audio (soundFile);
    audio.volume=0.5;
    audio.currentTime=0;
    audio.play().catch((e) => console.log("Audio error:", e));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Wallet className="text-emerald-500" />
          Masukkan Uang
        </h3>
        <p className="text-gray-500 text-sm">Klik nominal uang di bawah</p>
      </div>

      {/* UPDATE: grid-cols-3 agar muat lebih banyak */}
      <div className="grid grid-cols-3 gap-2">
        {denominations.map((money) => (
          <motion.button
            key={money.value}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              playClickSound(money.value);
              onInsertMoney(money.value)}}
            className="relative group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all bg-gray-50 border border-gray-200"
          >
            {/* Tampilan Gambar Uang */}
            <div className="w-full h-16 flex items-center justify-center p-1">
                <img 
                    src={money.image} 
                    alt={`Rp ${money.value}`} 
                    className="w-full h-full object-contain" 
                />
            </div>

            {/* Overlay Label */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-0.5 text-center opacity-0 group-hover:opacity-100 transition-opacity">
               {money.value >= 1000 ? `${money.value / 1000}k` : money.value}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-gray-500 text-sm">Total Masuk:</span>
        <span className="text-xl font-bold text-emerald-600">
          Rp {insertedAmount.toLocaleString('id-ID')}
        </span>
      </div>
    </div>
  );
}