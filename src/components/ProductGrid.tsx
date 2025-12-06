import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  code: string;
  image: string;
  stock: number;
}

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (code: string) => void;
}

export default function ProductGrid({ products, onSelectProduct }: ProductGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pilih Produk</h2>
        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
          {products.length} Produk
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={item}>
            <ProductCard {...product} onSelect={onSelectProduct} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
