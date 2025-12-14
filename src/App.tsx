import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingBag, Coins, XCircle, PackageX, Wallet, ArrowRight } from 'lucide-react';
import ProductGrid from './components/ProductGrid';
import CodeInput from './components/CodeInput';
import CashInput from './components/CashInput';

const BASE = import.meta.env.BASE_URL;

// --- TIPE DATA ---
interface Product {
  id: string;
  name: string;
  price: number;
  code: string;
  image: string;
  stock: number;
}

interface Topping {
  id: string;
  name: string;
  price: number;
  image: string;
  code: string; 
}

interface MoneyDenomination {
  value: number;
  image: string;
}

const moneyDenominations: MoneyDenomination[] = [
  { value: 20000, image: `${BASE}images/12.png` },
  { value: 10000, image: `${BASE}images/11.png` },
  { value: 5000, image: `${BASE}images/10.png` },
  { value: 2000, image: `${BASE}images/9.png` },
  { value: 1000, image: `${BASE}images/15.png` },
  { value: 500, image: `${BASE}images/16.png` },
  { value: 200, image: `${BASE}images/18.png` },
  { value: 100, image: `${BASE}images/17.png` },
];

const coinDenominations: MoneyDenomination[] = [
  { value: 1000, image: `${BASE}images/15.png` },
  { value: 500, image: `${BASE}images/16.png` },
  { value: 200, image: `${BASE}images/18.png` },
  { value: 100, image: `${BASE}images/17.png` },
];

const products: Product[] = [
  { id: '1', name: 'Jus Jeruk', price: 6200, code: 'D901', image: `${BASE}images/1.png`, stock: 8 },
  { id: '2', name: 'Jus Melon', price: 8000, code: 'D341', image: `${BASE}images/2.png`, stock: 0 }, 
  { id: '3', name: 'Jus Strawberry', price: 14500, code: 'D713', image: `${BASE}images/3.png`, stock: 7 },
  { id: '4', name: 'Jus Mangga', price: 12300, code: 'S218', image: `${BASE}images/4.png`, stock: 12 },
  { id: '5', name: 'Jus Apel', price: 16000, code: 'S982', image: `${BASE}images/5.png`, stock: 0 }, 
  { id: '6', name: 'Jus Alpukat', price: 15800, code: 'S573', image: `${BASE}images/6.png`, stock: 9 },
];

const availableToppings: Topping[] = [
  { id: 't1', name: 'Susu', price: 1000, image: `${BASE}images/7.png`, code: 'T01' },
  { id: 't2', name: 'Madu', price: 3000, image: `${BASE}images/8.png`, code: 'T02' },
];

function App() {
  const [code, setCode] = useState('');
  const [insertedAmount, setInsertedAmount] = useState(0);
  const [change, setChange] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTopping, setSelectedTopping] = useState<Topping | null>(null);


  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showOutOfStockModal, setShowOutOfStockModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ title: '', message: '' });
  
  const [changeBreakdown, setChangeBreakdown] = useState<{ money: MoneyDenomination; count: number }[]>([]);

 //total harga
 const totalPrice =
  (selectedProduct?.price || 0) + (selectedTopping?.price || 0);


 //buat suara klik
  const playClickSound = () => {
    const audio = new Audio(`${BASE}sounds/click.mp3`);
    audio.volume = 0.5;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  //algortima greedy buat ngitung kembalian coin 
  const calculateChangeBreakdown = (changeAmount: number) => {
    let remaining = changeAmount;
    const breakdown: { money: MoneyDenomination; count: number }[] = [];

    coinDenominations.forEach((denom) => {
      if (remaining >= denom.value) {
        const count = Math.floor(remaining / denom.value);
        remaining = remaining % denom.value;
        breakdown.push({ money: denom, count });
      }
    });
    return breakdown;
  };

  const toggleTopping = (topping: Topping) => {
    if (selectedTopping?.id === topping.id) {
    setSelectedTopping(null);
  } else {
    setSelectedTopping(topping);
  }
};
 
  const handleKeypadSubmit = useCallback(() => {
    const foundProduct = products.find(p => p.code === code);
    const foundTopping = availableToppings.find(t => t.code === code);

    if (foundProduct) {
        if (foundProduct.stock > 0) {
            setSelectedProduct(foundProduct);
            setSelectedTopping(null); 
            setCode(''); 
        } else {
            setShowOutOfStockModal(true);
        }
    } else if (foundTopping) {
        if (selectedProduct) {
            toggleTopping(foundTopping);
            setCode(''); 
        } else {
            setErrorMessage({
                title: "Pilih Jus Dulu",
                message: "Anda harus memilih produk minuman sebelum menambahkan topping."
            });
            setShowErrorModal(true);
        }
    } else {
        setErrorMessage({
            title: "Tidak Ditemukan",
            message: `Kode "${code}" tidak terdaftar sebagai produk maupun topping.`
        });
        setShowErrorModal(true);
    }
  }, [code, selectedProduct, selectedTopping]);

 const handleManualToppingClick = (topping: Topping) => {
  if (selectedProduct) {
    playClickSound();
    toggleTopping(topping);
  }
};


  const handleSelectProduct = (productCode: string) => {
    const product = products.find(p => p.code === productCode);
    if (product) {
       if (product.stock > 0) {
          setSelectedProduct(product);
          setSelectedTopping(null); 
          setCode(productCode);
       } else {
          setShowOutOfStockModal(true);
       }
    }
  };

  const handleStartPayment = () => {
    if (!selectedProduct) {
      setErrorMessage({ title: "Belum Ada Pesanan", message: "Silahkan pilih produk terlebih dahulu!" });
      setShowErrorModal(true);
      return;
    }
    if (selectedProduct.stock <= 0) {
      setShowOutOfStockModal(true);
    } else {
      setShowPaymentModal(true);
      setInsertedAmount(0);
    }
  };

  const handleInsertMoney = (amount: number) => {
    setInsertedAmount(prev => prev + amount);
  };

  // --- PROSES TRANSAKSI ---
  const handleFinalizeTransaction = () => {
    if (insertedAmount < totalPrice) {
        alert("Uang kurang!");
        return;
    }

    const changeAmount = insertedAmount - totalPrice;
    setChange(changeAmount);
    
    // Hitung kembalian (akan otomatis pakai koin saja karena fungsi calculateChangeBreakdown sudah diubah)
    setChangeBreakdown(calculateChangeBreakdown(changeAmount));
    
    setShowPaymentModal(false);
    
    setTimeout(() => {
        setShowSuccessModal(true);
        const successAudio = new Audio(`${BASE}sounds/cekring.mp3`);
        successAudio.volume = 0.6; 
        successAudio.play().catch(() => {});
    }, 300);
  };

  const handleCloseAll = () => {
    setShowSuccessModal(false);
    setShowErrorModal(false);
    setShowOutOfStockModal(false);
    setShowPaymentModal(false);
    
    setTimeout(() => {
      setCode('');
      setInsertedAmount(0);
      setChange(0);
      setSelectedProduct(null);
      setSelectedTopping([]);
      setChangeBreakdown([]);
    }, 300);
  };

  const playTopingSound = () => {
    const soundToping = new Audio(`${BASE}sounds/click.mp3`);
    soundToping.volume = 0.5;
    soundToping.currentTime = 0;
    soundToping.play().catch((e) => console.log("Audio error:", e));  
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSuccessModal || showErrorModal || showOutOfStockModal || showPaymentModal) return;
      const key = e.key.toUpperCase();
      if (key === 'ENTER') { playClickSound(); handleKeypadSubmit(); return; }
      if (key === 'BACKSPACE') { playClickSound(); setCode(prev => prev.slice(0, -1)); return; }
      if (key === 'ESCAPE') { playClickSound(); setCode(''); return; }
      if (/^[0-9A-Z]$/.test(key)) {
        playClickSound();
        setCode(prev => { if (prev.length < 4) return prev + key; return prev; });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, handleKeypadSubmit, showSuccessModal, showErrorModal, showOutOfStockModal, showPaymentModal]);

  return (
    <div 
        className="min-h-screen p-4 flex flex-col items-center justify-center relative"
        style={{
            backgroundImage: `url("${BASE}images/wp2.jpg")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
        }}
    >
      
      {/* MODAL OUT OF STOCK */}
      <AnimatePresence>
        {showOutOfStockModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden">
              <div className="bg-amber-500 p-4 text-center text-white">
                 <div className="mx-auto bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-2"><PackageX size={28} strokeWidth={3} /></div>
                 <h2 className="text-lg font-bold">Jus Habis!</h2>
              </div>
              <div className="p-4 text-center">
                <p className="text-gray-600 text-sm mb-4">Aduhh Jus ini lagi kosong.</p>
                <button onClick={handleCloseAll} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-xl text-sm">PILIH LAIN</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL PEMBAYARAN */}
      <AnimatePresence>
        {showPaymentModal && selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
                
                {/* KIRI: Ringkasan */}
                <div className="bg-gray-50 p-5 md:w-5/12 border-r border-gray-200 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2"><ShoppingBag size={18}/> Pesanan Anda</h3>
                    <div className="flex flex-col items-center mb-3">
                        <img src={selectedProduct.image} alt={selectedProduct.name} className="h-24 object-contain mb-2" />
                        <div className="font-bold text-base">{selectedProduct.name}</div>
                        <div className="text-xs text-gray-500">{selectedProduct.code}</div>
                    </div>
                    {selectedTopping && (
                      <div className="bg-white p-2 rounded-lg border border-gray-200 mb-3">
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Topping:</p>
                        <div className="flex items-center gap-2">
                          <img
                            src={selectedTopping.image}
                            alt={selectedTopping.name}
                            className="h-4 w-4 object-contain"
                          />
                          <span className="text-xs font-semibold">{selectedTopping.name}</span>
                        </div>
                      </div>
                    )}


                    <div className="border-t border-gray-200 pt-3 mt-auto text-sm">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-500">Harga Produk</span>
                            <span>Rp {selectedProduct.price.toLocaleString()}</span>
                        </div>
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500">Total Topping</span>
                            <span>Rp {(totalPrice - selectedProduct.price).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* KANAN: Input Uang */}
                <div className="p-5 md:w-7/12 flex flex-col overflow-hidden">
                     <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Wallet size={18}/> Pembayaran</h3>
                        <button onClick={() => setShowPaymentModal(false)} className="text-red-500 font-bold text-xs hover:underline">BATALKAN</button>
                     </div>

                     <div className="flex-1 overflow-y-auto mb-3 pr-1">
                        {/* Di sini tetap menampilkan moneyDenominations (Kertas + Koin) agar user bisa bayar pakai apa aja */}
                        <CashInput insertedAmount={insertedAmount} onInsertMoney={handleInsertMoney} denominations={moneyDenominations} />
                     </div>

                     <div className="grid grid-cols-2 gap-3 mt-auto">
                        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 flex flex-col justify-center">
                            <p className="text-[10px] text-blue-500 font-bold uppercase mb-1">Total Tagihan</p>
                            <p className="text-xl font-bold text-blue-700 truncate">Rp {totalPrice.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="bg-gray-900 p-3 rounded-xl border border-gray-800 text-white flex flex-col justify-center">
                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Uang Masuk</p>
                            <p className="text-xl font-bold text-emerald-400 truncate">Rp {insertedAmount.toLocaleString('id-ID')}</p>
                        </div>
                     </div>
                     
                     <button 
                        onClick={handleFinalizeTransaction}
                        disabled={insertedAmount < totalPrice}
                        className={`w-full py-3 rounded-xl font-bold text-base shadow-lg flex items-center justify-center gap-2 mt-3 transition-all
                            ${insertedAmount >= totalPrice 
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200 transform hover:scale-[1.02]' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                     >
                        {insertedAmount >= totalPrice ? <>BAYAR SEKARANG <ArrowRight size={18}/></> : `KURANG Rp ${(totalPrice - insertedAmount).toLocaleString()}`}
                     </button>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL SUKSES (TAMPILAN KEMBALIAN DI SINI) */}
      <AnimatePresence>
        {showSuccessModal && selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative max-h-[90vh] overflow-y-auto">
              
              <div className="bg-emerald-500 p-4 text-center text-white">
                 <div className="mx-auto bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-2"><Check size={28} strokeWidth={3} /></div>
                 <h2 className="text-xl font-bold">Berhasil!</h2>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex flex-col items-center">
                   <img src={selectedProduct.image} alt={selectedProduct.name} className="h-20 object-contain mb-2" />
                   <h3 className="text-lg font-bold text-gray-800">{selectedProduct.name}</h3>
                   
                 {selectedTopping && (
                  <div className="flex items-center gap-2 mt-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase mr-1">
                      Extra:
                    </span>
                    <img
                      src={selectedTopping.image}
                      alt={selectedTopping.name}
                      className="h-8 w-8 object-contain drop-shadow-sm"
                    />
                  </div>
                )}
                </div>


                <div className="bg-gray-50 p-3 rounded-xl space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Belanja</span>
                        <span className="font-bold text-gray-800">Rp {totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Uang Masuk</span>
                        <span className="font-bold text-gray-800">Rp {insertedAmount.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-emerald-600 border-t border-gray-200 pt-2 mt-2">
                        <span>Kembalian</span>
                        <span>Rp {change.toLocaleString('id-ID')}</span>
                    </div>
                </div>

                {change > 0 && (
                    <div className="border-t border-dashed border-gray-200 pt-3">
                        <p className="text-[10px] text-gray-400 font-bold mb-2 uppercase text-center">Rincian Pecahan Kembalian (Koin):</p>
                        <div className="bg-emerald-50 rounded-lg p-2 max-h-32 overflow-y-auto space-y-1.5">
                           {changeBreakdown.map((item, index) => (
                              <div key={index} className="flex items-center justify-between bg-white p-1.5 rounded border border-emerald-100 shadow-sm">
                                 <img src={item.money.image} alt="uang" className="h-6 w-auto object-contain" />
                                 <div className="font-mono font-bold text-gray-700 text-xs">x {item.count}</div>
                              </div>
                           ))}
                        </div>
                    </div>
                )}

                <button onClick={handleCloseAll} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-emerald-200">AMBIL JUS DAN KEMBALIAN</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL ERROR (DINAMIS) */}
      <AnimatePresence>
        {showErrorModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden">
              <div className="bg-rose-500 p-4 text-center text-white">
                 <div className="mx-auto bg-white/20 w-10 h-10 rounded-full flex items-center justify-center mb-2"><XCircle size={24} strokeWidth={3} /></div>
                 <h2 className="text-lg font-bold">{errorMessage.title || "Tidak Ditemukan"}</h2>
              </div>
              <div className="p-4 text-center">
                <p className="text-gray-600 mb-6 text-sm">
                    {errorMessage.message || `Kode "${code}" tidak terdaftar.`}
                </p>
                <button onClick={() => {setShowErrorModal(false); setCode('');}} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 rounded-xl text-sm">COBA LAGI</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* HALAMAN UTAMA */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-6 mt-2">
          <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-poppins text-5xl md:text-6xl font-extrabold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.9)] mb-2 tracking-tight"
        >
          TriJuice Vending Machine
        </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} 
          className="font-poppins text-lg text-yellow-200 font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)] tracking-wide">
            Pilih jus Favorit anda,tambahkan toping biar enakk,dijamin Mantulty</motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <ProductGrid products={products} onSelectProduct={handleSelectProduct} />
            
            {selectedProduct && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 rounded-2xl shadow-lg border border-purple-100">
                <div className="mb-3 flex justify-between items-center border-b border-gray-100 pb-2">
                    <h3 className="text-lg font-bold text-gray-800">Pilih Topping</h3>
                    <p className="text-lg font-bold text-blue-600">Total: Rp {totalPrice.toLocaleString('id-ID')}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {availableToppings.map((topping) => {
                    const isActive = selectedTopping?.id === topping.id;

                    return (
                      <motion.button
                        key={topping.id}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => handleManualToppingClick(topping)}
                        className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center relative
                          ${isActive ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}
                      >
                        <span className="absolute top-1 left-1 bg-gray-200 text-gray-600 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {topping.code}
                        </span>

                        <div className="h-8 w-full flex items-center justify-center mb-1 mt-2">
                            {topping.image.startsWith('/') ? (<img src={topping.image} alt={topping.name} className="h-full object-contain" />) : (<span className="text-2xl">{topping.image}</span>)}
                        </div>
                        <div className="font-semibold text-xs">{topping.name}</div>
                        <div className="text-[10px] text-gray-500">+Rp {topping.price.toLocaleString()}</div>
                        {isActive && <div className="absolute top-1 right-1 text-purple-600"><Check size={12} /></div>}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-4">
            <CodeInput code={code} onCodeChange={setCode} onSubmit={handleKeypadSubmit} />
            
            <div className="bg-white p-5 rounded-2xl shadow-lg border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 font-bold text-sm">Total Pembayaran</span>
                    <span className="text-2xl font-bold text-blue-600">Rp {totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-gray-400 text-right mb-4 italic">*Klik tombol di bawah untuk bayar yak</p>

                <button 
                    onClick={() => { playClickSound(); handleStartPayment(); }}
                    disabled={!selectedProduct}
                    className={`w-full py-3 rounded-xl font-bold text-base shadow-lg flex items-center justify-center gap-2 transition-all
                        ${selectedProduct 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 transform hover:scale-[1.02]' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                    <Wallet size={20} />
                    {selectedProduct ? 'LANJUT KE PEMBAYARAN' : 'PILIH PRODUK DULU'}
                </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default App;