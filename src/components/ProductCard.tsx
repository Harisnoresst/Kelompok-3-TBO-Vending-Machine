import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
const BASE = import.meta.env.BASE_URL;

interface Product {
  id: string;
  name: string;
  price: number;
  code: string;
  image: string;
  stock: number;
}

interface ProductCardProps extends Product {
  onSelect: (code: string) => void;
}

export default function ProductCard({ id, name, price, code, image, stock, onSelect }: ProductCardProps) {
  // LOGIKA PENTING: Cek apakah image diawali dengan '/' (artinya file gambar)
  const isImageFile = image.startsWith('/');
const playClickSound =() => {
  const audio = new Audio (`${BASE}sounds/click.mp3`);
  audio.volume = 0.5;
  audio.currentTime = 0;
  audio.play().catch((e) => console.log("Audio error:", e));
};


  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer relative group flex flex-col items-center text-center h-full"
      onClickCapture={() => {
        playClickSound();
        onSelect(code);
      }}
      
    >
      {/* Badge Kode (Pojok Kiri Atas) */}
      <div className="absolute top-3 left-3 bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-md">
        {code}
      </div>

      {/* Badge Stok (Pojok Kanan Atas) */}
      <div className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-md ${stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        Stok: {stock}
      </div>

      {/* --- AREA GAMBAR --- */}
      <div className="w-full h-32 flex items-center justify-center my-4 bg-gray-50 rounded-xl p-2">
        {isImageFile ? (
          // Jika path gambar (ada di folder public/images)
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-contain drop-shadow-sm" 
          />
        ) : (
          <span className="text-6xl filter drop-shadow-sm">{image}</span>
        )}
      </div>
      {/* ------------------- */}

      {/* Nama Produk */}
      <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">{name}</h3>
      
      {/* Harga */}
      <p className="text-emerald-600 font-bold text-lg mb-3">
        Rp {price.toLocaleString('id-ID')}
      </p>

      {/* Tombol Beli (Hanya visual, muncul saat hover) */}
      <button className="w-full mt-auto bg-gray-50 group-hover:bg-emerald-500 group-hover:text-white text-gray-400 font-semibold py-2 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
        <ShoppingCart size={16} />
        Pilih
      </button>
    </motion.div>
  );
}