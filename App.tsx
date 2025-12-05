
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, 
  ShoppingCart, 
  Wallet, 
  ClipboardList, 
  User, 
  Search, 
  Plus, 
  Minus, 
  MessageSquare, 
  RefreshCw, 
  ChevronRight,
  LogOut,
  Globe,
  Smartphone, 
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Bell,
  LayoutGrid,
  Landmark,
  MessageCircle,
  MoreHorizontal,
  Loader2,
  X,
  Info,
  Copy,
  Mail,
  CreditCard,
  QrCode,
  Timer,
  ShieldCheck,
  Check,
  ChevronLeft,
  Banknote,
  Zap,
  MessageSquareText,
  Inbox
} from 'lucide-react';
import { initTelegramApp, getTelegramUser, cloudStorage } from './services/telegramService';
import { gerarPix } from './services/hoopayService';
import { TelegramUser, Service, Transaction } from './types';

// --- MOCK DATA ---
interface ExtendedService extends Service {
    category: 'social' | 'bank' | 'ecommerce' | 'other';
}

const SERVICES: ExtendedService[] = [
  // Item Especial: Serviço Específico
  { id: 'specific', name: 'Serviço Específico', price: 1.50, icon: 'bg-slate-800 text-white', category: 'other', isNew: true, stock: 325 },

  // Redes Sociais & Mensageiros
  { id: '1', name: 'WhatsApp', price: 3.50, icon: 'bg-[#25D366] text-white', isHot: true, category: 'social', stock: 4238 },
  { id: '2', name: 'Telegram', price: 4.20, icon: 'bg-[#0088cc] text-white', category: 'social', stock: 1205 },
  { id: '4', name: 'Instagram', price: 1.10, icon: 'bg-gradient-to-tr from-yellow-400 to-purple-600 text-white', category: 'social', stock: 2841 },
  { id: '7', name: 'TikTok', price: 1.00, icon: 'bg-black text-white', category: 'social', stock: 5620 },
  { id: '21', name: 'Facebook', price: 1.50, icon: 'bg-[#1877F2] text-white', category: 'social', stock: 3102 },
  { id: '22', name: 'Kwai', price: 1.20, icon: 'bg-[#FF8F00] text-white', category: 'social', stock: 450 },

  // Bancos & Fintechs (Brasil)
  { id: '8', name: 'Nubank', price: 3.00, icon: 'bg-[#820AD1] text-white', isHot: true, category: 'bank', stock: 892 },
  { id: '13', name: 'Caixa Tem', price: 4.50, icon: 'bg-[#005CA9] text-white', isHot: true, category: 'bank', stock: 345 },
  { id: '9', name: 'PicPay', price: 2.80, icon: 'bg-[#11C76F] text-white', category: 'bank', stock: 1240 },
  { id: '11', name: 'Mercado Pago', price: 2.20, icon: 'bg-[#009EE3] text-white', category: 'bank', stock: 2100 },
  { id: '10', name: 'Banco Inter', price: 2.50, icon: 'bg-[#FF7A00] text-white', category: 'bank', stock: 560 },
  { id: '12', name: 'PagBank', price: 2.00, icon: 'bg-[#96C93D] text-white', category: 'bank', stock: 890 },
  { id: '14', name: 'C6 Bank', price: 2.50, icon: 'bg-[#2E2E2E] text-white', category: 'bank', stock: 420 },
  { id: '23', name: 'Itaú', price: 3.00, icon: 'bg-[#EC7000] text-white', category: 'bank', stock: 310 },
  { id: '24', name: 'Bradesco', price: 3.00, icon: 'bg-[#CC092F] text-white', category: 'bank', stock: 280 },
  { id: '25', name: 'Santander', price: 3.20, icon: 'bg-[#EC0000] text-white', category: 'bank', stock: 250 },
  { id: '26', name: 'Banco do Brasil', price: 3.50, icon: 'bg-[#F4F613] text-blue-900', category: 'bank', stock: 305 }, 
  { id: '27', name: 'Next', price: 2.00, icon: 'bg-[#00FF5F] text-black', category: 'bank', stock: 670 },

  // E-commerce & Delivery
  { id: '15', name: 'Mercado Livre', price: 2.50, icon: 'bg-[#FFE600] text-blue-900', isHot: true, category: 'ecommerce', stock: 1540 },
  { id: '16', name: 'Shopee', price: 1.80, icon: 'bg-[#EE4D2D] text-white', category: 'ecommerce', stock: 2300 },
  { id: '17', name: 'Amazon', price: 2.00, icon: 'bg-[#232F3E] text-white', category: 'ecommerce', stock: 890 },
  { id: '6', name: 'iFood', price: 1.50, icon: 'bg-[#EA1D2C] text-white', category: 'ecommerce', stock: 3120 },
  { id: '5', name: 'Uber/UberEats', price: 1.20, icon: 'bg-black text-white', category: 'ecommerce', stock: 4500 },
  { id: '18', name: '99 App', price: 1.30, icon: 'bg-[#FFBB00] text-black', category: 'ecommerce', stock: 1200 },
  { id: '28', name: 'Zé Delivery', price: 1.50, icon: 'bg-[#FFC926] text-black', category: 'ecommerce', stock: 680 },

  // Serviços & Governo
  { id: '20', name: 'Gov.br', price: 5.00, icon: 'bg-[#002D72] text-white', isHot: true, category: 'other', stock: 150 },
  { id: '3', name: 'Google/Gmail', price: 2.10, icon: 'bg-[#EA4335] text-white', category: 'other', stock: 5400 },
  { id: '19', name: 'Netflix', price: 3.50, icon: 'bg-[#E50914] text-white', category: 'other', stock: 780 },
  { id: '29', name: 'OLX', price: 2.00, icon: 'bg-[#6E0AD6] text-white', category: 'other', stock: 430 },
  { id: '30', name: 'Tinder', price: 3.00, icon: 'bg-[#FE3C72] text-white', category: 'social', stock: 920 },
];

// --- COMPONENTS ---

// 1. Navigation Bar
const BottomNav = ({ activeTab, setTab }: { activeTab: string, setTab: (t: string) => void }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'services', icon: ShoppingCart, label: 'Serviços' },
    { id: 'mynumbers', icon: MessageSquareText, label: 'Meus Números' }, // Changed Balance to My Numbers
    { id: 'orders', icon: ClipboardList, label: 'Pedidos' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 pb-safe pt-2 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex flex-col items-center justify-center w-full py-1 space-y-1.5 transition-colors ${
              activeTab === item.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// 2. Views

const HomeView = ({ user, setTab, transactions, currentBalance }: { user: TelegramUser | null, setTab: (t: string) => void, transactions: Transaction[], currentBalance: number }) => {
  const photoUrl = user?.photo_url;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'social' | 'bank' | 'other'>('all');
  const [notificationStatus, setNotificationStatus] = useState<'idle' | 'loading' | 'empty'>('idle');

  const categories = [
    { id: 'all', label: 'Todos', icon: LayoutGrid },
    { id: 'social', label: 'Social', icon: MessageCircle },
    { id: 'bank', label: 'Bancos', icon: Landmark },
    { id: 'other', label: 'Específico', icon: MoreHorizontal },
  ];

  const filteredServices = useMemo(() => {
    return SERVICES.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || 
                                (selectedCategory === 'other' && (service.category === 'other' || service.id === 'specific')) ||
                                service.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const activeNumbersCount = transactions.filter(t => t.type === 'purchase' && t.status === 'completed').length;

  const handleNotificationClick = () => {
      setNotificationStatus('loading');
      setTimeout(() => {
          setNotificationStatus('empty');
      }, 1500);
  };

  const closeNotificationModal = () => {
      setNotificationStatus('idle');
  };

  return (
    <div className="space-y-6 pb-28 pt-4 relative">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
             <button onClick={() => setTab('profile')} className="relative active:scale-95 transition-transform">
                {photoUrl ? (
                    <img 
                    src={photoUrl} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-white"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shadow-sm ring-2 ring-white">
                        <User size={20} />
                    </div>
                )}
            </button>
            <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider leading-none mb-0.5">Olá,</span>
                <span className="text-slate-800 font-bold text-lg leading-none">{user?.first_name || 'Visitante'}</span>
            </div>
        </div>
        <button 
            onClick={handleNotificationClick}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 active:bg-slate-50 relative"
        >
            <Bell size={20} />
        </button>
      </div>

      {/* NOTIFICATION MODAL */}
      {notificationStatus !== 'idle' && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
              <div 
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" 
                  onClick={closeNotificationModal}
              ></div>
              <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative z-10 animate-scaleIn flex flex-col items-center text-center">
                  <button onClick={closeNotificationModal} className="absolute right-4 top-4 text-slate-300 hover:text-slate-500 p-1">
                      <X size={20} />
                  </button>
                  {notificationStatus === 'loading' ? (
                      <div className="py-8 flex flex-col items-center gap-4">
                          <Loader2 size={48} className="text-blue-600 animate-spin" />
                          <p className="font-bold text-slate-600 animate-pulse">Buscando SMS...</p>
                      </div>
                  ) : (
                      <div className="py-4 flex flex-col items-center gap-3">
                           <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-2">
                               <MessageSquare size={32} />
                           </div>
                           <h3 className="text-lg font-bold text-slate-800">Não há novos SMS</h3>
                           <p className="text-sm text-slate-500 leading-relaxed max-w-[200px]">
                               Nenhuma mensagem encontrada para seus números ativos no momento.
                           </p>
                           <button onClick={closeNotificationModal} className="mt-4 bg-slate-100 text-slate-600 font-bold px-6 py-2.5 rounded-xl active:scale-95 transition-transform w-full">
                               Entendido
                           </button>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* BALANCE CARD */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-200/50 relative overflow-hidden group">
             <div className="absolute -right-12 -top-12 bg-white/10 w-48 h-48 rounded-full blur-3xl group-hover:bg-white/15 transition-colors"></div>
             <div className="absolute -left-10 -bottom-10 bg-black/10 w-32 h-32 rounded-full blur-2xl"></div>
             <div className="relative z-10 flex flex-col items-start gap-1">
                <div className="flex items-center justify-between w-full mb-2">
                    <p className="text-blue-100 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <Wallet size={14} className="text-blue-200"/> Saldo Disponível
                    </p>
                </div>
                <h2 className="text-[2.5rem] leading-none font-extrabold tracking-tight mb-6">
                    R$ {currentBalance.toFixed(2).split('.')[0]}<span className="text-2xl text-blue-200/80 font-bold">,{currentBalance.toFixed(2).split('.')[1]}</span>
                </h2>
                <div className="w-full">
                    <button onClick={() => setTab('balance')} className="w-full bg-white/20 hover:bg-white/25 active:bg-white/30 backdrop-blur-md border border-white/10 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/10">
                        <Plus size={18} strokeWidth={3} /> Adicionar Dinheiro
                    </button>
                </div>
             </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center gap-1 active:scale-[0.98] transition-transform cursor-default">
             <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1">
                 <Smartphone size={22} strokeWidth={2.5} />
             </div>
             <span className="text-2xl font-extrabold text-slate-800 block">{activeNumbersCount}</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Números Ativos</span>
         </div>
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center gap-1 active:scale-[0.98] transition-transform cursor-default">
             <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                 <MessageSquare size={22} strokeWidth={2.5} />
             </div>
             <span className="text-2xl font-extrabold text-slate-800 block">0</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">SMS</span>
         </div>
      </div>

      {/* ALERT / CTA */}
      {activeNumbersCount === 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
                 <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                         <Info size={20} />
                     </div>
                     <div className="flex-1">
                         <p className="font-bold text-slate-800 text-xs">Você não comprou nenhum número</p>
                         <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Para receber o SMS, compre um serviço abaixo.</p>
                     </div>
                 </div>
                 <button
                    onClick={() => document.getElementById('service-selector')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-blue-600 text-white text-[10px] font-bold px-3 py-2 rounded-lg whitespace-nowrap shadow-md shadow-blue-200 active:scale-95 transition-transform"
                 >
                    Adquirir
                 </button>
          </div>
      )}

      {/* SERVICE SELECTOR SECTION */}
      <div id="service-selector" className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-5">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <ShoppingCart size={16} className="text-blue-500"/> Nova Ativação
        </h3>
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block ml-1">País</label>
            <div className="w-full flex items-center justify-between p-3.5 border border-slate-200 rounded-xl bg-slate-50 cursor-default">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl drop-shadow-sm leading-none">🇧🇷</span>
                    <span className="font-bold text-slate-700 text-sm">BRASIL (BR)</span>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                    Disponível
                </span>
            </div>
        </div>
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block ml-1">Serviço</label>
            <div className="border border-slate-200 rounded-xl overflow-hidden p-1 bg-white">
                <div className="flex gap-2 p-2 overflow-x-auto no-scrollbar mb-1">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id as any)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${
                                selectedCategory === cat.id 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                                : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'
                            }`}
                        >
                            <cat.icon size={14} /> {cat.label}
                        </button>
                    ))}
                </div>
                <div className="relative mb-2 px-2">
                    <Search className="absolute left-5 top-3 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar serviço específico..." 
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-transparent focus:bg-white bg-slate-50 focus:outline-none focus:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm placeholder:text-slate-400 font-medium"
                    />
                </div>
                <div className="space-y-1 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar px-1">
                    {filteredServices.length > 0 ? filteredServices.map(service => (
                        <div key={service.id} onClick={() => setTab('services')} className={`flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group border ${service.id === 'specific' ? 'bg-slate-50 border-blue-100' : 'border-transparent hover:border-slate-100'}`}>
                            <div className="flex items-center space-x-3">
                                <div className={`w-9 h-9 rounded-full ${service.icon} flex items-center justify-center font-bold shadow-sm ring-1 ring-black/5`}>
                                    {service.id === 'specific' ? <MoreHorizontal size={18}/> : service.name[0]}
                                </div>
                                <span className="font-bold text-slate-700 text-sm group-hover:text-slate-900">{service.name}</span>
                                {service.isHot && <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md font-bold">HOT</span>}
                                {service.isNew && <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md font-bold">NOVO</span>}
                            </div>
                            <span className="font-extrabold text-slate-700 text-sm bg-slate-100 px-2 py-1 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">R$ {service.price.toFixed(2)}</span>
                        </div>
                    )) : (
                        <div className="p-4 text-center text-slate-400 text-xs font-medium">Nenhum serviço encontrado. Tente a opção "Específico".</div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const ServicesView = ({ onPurchase }: { onPurchase: (service: Service) => void }) => (
    <div className="pb-28 space-y-4 pt-4">
        <h2 className="text-xl font-bold text-slate-800 px-1">Todos Serviços</h2>
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 sticky top-4 z-30">
             <div className="relative">
                <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar serviço..." 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-slate-50 transition-all text-sm font-medium"
                />
            </div>
        </div>

        <div className="grid gap-2.5">
            {SERVICES.map(service => (
                <div key={service.id} className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between active:scale-[0.99] transition-transform">
                     <div className="flex items-center space-x-3.5">
                        <div className={`w-10 h-10 rounded-full ${service.icon} flex items-center justify-center font-bold shadow-sm ring-2 ring-white`}>
                             {service.id === 'specific' ? <MoreHorizontal size={18}/> : service.name.substring(0, 1)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-bold text-slate-800 text-sm">{service.name}</p>
                                {service.isHot && <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">HOT</span>}
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium">
                                Disponível: <span className="font-bold text-slate-600">{service.stock || 0}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                         <p className="font-bold text-blue-600">R$ {service.price.toFixed(2)}</p>
                         <button 
                            onClick={() => onPurchase(service)}
                            className="bg-blue-600 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold shadow-md shadow-blue-200 active:bg-blue-700 uppercase tracking-wide"
                         >
                             Comprar
                         </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const MyNumbersView = ({ transactions }: { transactions: Transaction[] }) => {
    // Em um app real, filtrariamos por status 'ativo'. Aqui usamos a transação de compra como proxy.
    const activeNumbers = transactions.filter(t => t.type === 'purchase');

    return (
        <div className="pb-28 space-y-4 pt-4">
            <h2 className="text-xl font-bold text-slate-800 px-1">Meus Números</h2>
            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 min-h-[60vh] flex flex-col">
                 {activeNumbers.length > 0 ? (
                    <div className="space-y-3">
                        {activeNumbers.map(num => (
                             <div key={num.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                                    <Smartphone size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{num.description}</p>
                                    <p className="text-[10px] text-slate-400">Aguardando SMS...</p>
                                </div>
                             </div>
                        ))}
                    </div>
                 ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                         <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                             <Inbox size={32} />
                         </div>
                         <p className="text-slate-500 font-bold text-sm">Não há números ativos no momento</p>
                    </div>
                 )}
            </div>
        </div>
    )
}

const BalanceView = ({ onDeposit, currentBalance }: { onDeposit: (amount: number) => void, currentBalance: number }) => {
    const [amount, setAmount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'amount' | 'payment'>('amount');
    const [pixData, setPixData] = useState<{ payload: string, qrCode: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(60); 
    const [copied, setCopied] = useState(false);
    
    // Fixed options instead of typing
    const options = [5, 10, 15, 20, 30, 50, 100, 200, 300];

    useEffect(() => {
        let interval: any;
        if (step === 'payment' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleGeneratePix = async () => {
        if (!amount || amount < 1) {
            setError("Selecione um valor");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const result = await gerarPix(amount);
            if (result.success && result.pixPayload && result.pixQrCode) {
                setPixData({ payload: result.pixPayload, qrCode: result.pixQrCode });
                setStep('payment');
                setTimeLeft(60); 
                onDeposit(amount);
            } else {
                setError(result.error || "Erro ao gerar PIX");
            }
        } catch (e) {
            setError("Falha na conexão");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (pixData?.payload) {
            const cleanPayload = pixData.payload.trim();
            navigator.clipboard.writeText(cleanPayload);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="pb-28 pt-4">
             {step === 'amount' ? (
                <div className="flex flex-col h-[calc(100vh-140px)] px-2 animate-fadeIn relative">
                    
                    {/* Header: Saldo Atual (Top) */}
                    <div className="text-center py-2 mb-4">
                        <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest block mb-1">Saldo Atual</span>
                        <h3 className="text-3xl font-extrabold text-slate-700">R$ {currentBalance.toFixed(2)}</h3>
                    </div>

                    {/* Main: Selector Grid */}
                    <div className="flex-1 flex flex-col pt-2">
                        <h3 className="text-center text-slate-500 font-bold text-xs mb-4 uppercase tracking-wide">Selecione o valor</h3>
                        
                        <div className="grid grid-cols-3 gap-3 px-1 overflow-y-auto pb-4">
                            {options.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => { setAmount(opt); setError(null); }}
                                    className={`relative py-4 rounded-xl transition-all duration-200 border flex flex-col items-center justify-center gap-0.5 group ${
                                        amount === opt 
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200/50 scale-[1.02]' 
                                        : 'bg-white border-slate-100 text-slate-600 hover:border-blue-100 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-baseline">
                                        <span className={`text-xs font-bold mr-0.5 ${amount === opt ? 'text-blue-100' : 'text-slate-400'}`}>R$</span>
                                        <span className="text-xl font-extrabold tracking-tight">{opt}</span>
                                        <span className={`text-xs font-bold ${amount === opt ? 'text-blue-100' : 'text-slate-400'}`}>,00</span>
                                    </div>
                                    {amount === opt && (
                                        <div className="absolute top-1 right-1 bg-white/20 p-0.5 rounded-full">
                                            <Check size={10} strokeWidth={4} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                        
                        {error && <p className="text-red-500 font-bold text-center bg-red-50 px-4 py-2 rounded-xl animate-bounce text-xs mx-4">{error}</p>}
                    </div>

                    {/* Footer: Button (Bottom) */}
                    <div className="mt-auto pt-4 pb-2 px-1">
                        <button 
                            onClick={handleGeneratePix}
                            disabled={loading || amount === 0}
                            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : amount > 0 ? `Gerar Pix de R$ ${amount},00` : 'Selecione um Valor'}
                        </button>
                    </div>
                </div>
             ) : (
                pixData && (
                <div className="px-1 animate-slideUp">
                    <div className="flex items-center gap-2 mb-6">
                        <button onClick={() => setStep('amount')} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 bg-white rounded-xl shadow-sm border border-slate-100"><ChevronLeft size={24} /></button>
                        <h2 className="text-xl font-bold text-slate-800">Pagamento Pix</h2>
                    </div>

                    {/* TICKET / RECIPT CARD */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden relative border border-slate-100">
                        {/* Top Section */}
                        <div className="bg-slate-50 p-6 flex flex-col items-center border-b border-dashed border-slate-200">
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5 ${timeLeft < 30 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600'}`}>
                                <Timer size={12} /> Expira em {formatTime(timeLeft)}
                            </div>
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Valor Total</span>
                            <span className="text-4xl font-extrabold text-slate-800">R$ {amount.toFixed(2)}</span>
                        </div>

                        {/* QR Code Section */}
                        <div className="p-8 flex flex-col items-center">
                             <div className="relative w-full aspect-square max-w-[240px] bg-white rounded-2xl flex items-center justify-center border-2 border-slate-100 p-2 shadow-inner">
                                {timeLeft > 0 ? (
                                    <img src={`data:image/jpeg;base64,${pixData.qrCode}`} alt="QR Code Pix" className="w-full h-full object-contain mix-blend-multiply"/>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-slate-300 gap-3">
                                        <X size={48} />
                                        <span className="font-bold text-sm uppercase">Expirado</span>
                                    </div>
                                )}
                                {/* Scan Corners Visual */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl -mt-1 -ml-1"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl -mt-1 -mr-1"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl -mb-1 -ml-1"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl -mb-1 -mr-1"></div>
                             </div>
                             
                             <p className="text-center text-xs text-slate-400 mt-6 max-w-[200px] leading-relaxed">
                                Escaneie o QR Code acima no aplicativo do seu banco ou use o botão abaixo.
                             </p>
                        </div>

                        {/* Actions */}
                        <div className="p-6 pt-0 space-y-4">
                            {timeLeft > 0 ? (
                                <>
                                <button 
                                    onClick={copyToClipboard}
                                    className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg ${copied ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'}`}
                                >
                                    {copied ? <Check size={20} strokeWidth={3} /> : <Copy size={20} />} 
                                    {copied ? 'Copiado com Sucesso!' : 'Copiar Código Pix'}
                                </button>
                                
                                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3">
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Código Pix</p>
                                        <p className="text-xs text-slate-500 font-mono truncate select-all">{pixData.payload}</p>
                                    </div>
                                </div>
                                </>
                            ) : (
                                <button 
                                    onClick={() => setStep('amount')}
                                    className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <RefreshCw size={18}/> Gerar Novo Pagamento
                                </button>
                            )}
                        </div>

                        {/* Decorative Circles (Ticket effect) */}
                        <div className="absolute top-[138px] -left-3 w-6 h-6 bg-[#F0F2F5] rounded-full"></div>
                        <div className="absolute top-[138px] -right-3 w-6 h-6 bg-[#F0F2F5] rounded-full"></div>
                    </div>
                </div>
                )
             )}
        </div>
    );
};

const OrdersView = ({ transactions }: { transactions: Transaction[] }) => (
    <div className="pb-28 space-y-4 pt-4">
        <h2 className="text-xl font-bold text-slate-800 px-1">Meus Pedidos</h2>
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100">
             <div className="flex items-center justify-between mb-5">
                 <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Transações Recentes</h2>
                 <button className="text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1 rounded-full">Filtrar</button>
             </div>
             <div className="space-y-4">
                 {transactions.length > 0 ? transactions.map(tx => (
                     <div key={tx.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                         <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${tx.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                 {tx.type === 'deposit' ? <ArrowUpRight size={18} strokeWidth={3}/> : <Smartphone size={18} strokeWidth={3}/>}
                             </div>
                             <div>
                                 <p className="font-bold text-sm text-slate-800">{tx.description}</p>
                                 <p className="text-[11px] text-slate-400 font-medium mt-0.5">{tx.date}</p>
                             </div>
                         </div>
                         <div className="text-right">
                             <p className={`font-bold text-sm ${tx.type === 'deposit' ? 'text-green-600' : 'text-slate-800'}`}>
                                 {tx.type === 'deposit' ? '+' : '-'} R$ {Math.abs(tx.amount).toFixed(2)}
                             </p>
                             <p className="text-xs text-slate-400 font-medium capitalize bg-slate-100 px-1.5 py-0.5 rounded inline-block mt-1">
                                {tx.status === 'completed' ? 'Concluído' : tx.status === 'pending' ? 'Pendente' : tx.status}
                             </p>
                         </div>
                     </div>
                 )) : (
                     <div className="text-center py-12">
                         <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                            <ClipboardList size={32} className="text-slate-300"/>
                         </div>
                         <p className="text-slate-500 font-medium">Nenhum pedido encontrado</p>
                     </div>
                 )}
             </div>
        </div>
    </div>
);

const ProfileView = ({ user }: { user: TelegramUser | null }) => {
    const photoUrl = user?.photo_url;
    return (
        <div className="pb-28 space-y-4 pt-4">
            <h2 className="text-xl font-bold text-slate-800 px-1">Meu Perfil</h2>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center space-x-5">
                <div className="relative">
                    {photoUrl ? (
                         <img src={photoUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover shadow-lg shadow-blue-200 border-4 border-slate-50"/>
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl font-bold shadow-lg shadow-slate-100 border-4 border-white"><User size={32} /></div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-blue-600 uppercase mb-1 tracking-wider bg-blue-50 inline-block px-2 py-0.5 rounded-md">Conta Telegram</p>
                    <h2 className="font-bold text-xl text-slate-800 truncate">{user?.first_name || 'Usuário'} {user?.last_name || ''}</h2>
                    <p className="text-sm text-slate-500 font-medium flex items-center gap-1"><span className="text-blue-500 font-bold">@</span>{user?.username ? user.username : 'usuario_anonimo'}</p>
                </div>
            </div>
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                {[
                    { icon: Globe, label: "Idioma", desc: "Português (BR)" },
                    { icon: AlertCircle, label: "Suporte", desc: "Fale conosco" },
                    { icon: LogOut, label: "Sair", color: "text-red-500", desc: "Desconectar conta" }
                ].map((item, idx) => (
                    <button key={idx} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl ${item.color ? 'bg-red-50' : 'bg-slate-50'} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                                <item.icon size={20} className={item.color || "text-slate-600"} />
                            </div>
                            <div className="text-left">
                                <span className={`block font-bold text-sm ${item.color || "text-slate-700"}`}>{item.label}</span>
                                <span className="text-[10px] text-slate-400 font-medium">{item.desc}</span>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </button>
                ))}
            </div>
            <div className="text-center pt-6"><p className="text-[10px] text-slate-400 font-medium">Ativa SMS v2.0</p></div>
        </div>
    );
};

// --- MAIN APP ---
export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showBalanceAlert, setShowBalanceAlert] = useState(false);

  // Calculate Balance (Simple Mock Logic: Sum of pending/completed deposits)
  // Nota: Num app real, isso viria do backend. Aqui somamos os depositos simulados.
  const currentBalance = useMemo(() => {
      // Inicia com 0
      return transactions.reduce((acc, tx) => {
          if (tx.type === 'deposit' && tx.status !== 'failed') return acc + tx.amount;
          if (tx.type === 'purchase' && tx.status === 'completed') return acc + tx.amount; // amount is negative
          return acc;
      }, 0);
  }, [transactions]);

  // Carregar transações do CloudStorage ao iniciar
  useEffect(() => {
    initTelegramApp();
    setUser(getTelegramUser());
    
    const loadHistory = async () => {
        const stored = await cloudStorage.getItem('transactions');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setTransactions(parsed);
                }
            } catch (e) {
                console.error("Erro ao ler historico", e);
            }
        }
    };
    loadHistory();

    if (window.Telegram?.WebApp?.BackButton) {
        const handleBack = () => setActiveTab('home');
        if (activeTab !== 'home') {
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.BackButton.onClick(handleBack);
        } else {
            window.Telegram.WebApp.BackButton.hide();
        }
        return () => {
             if(window.Telegram?.WebApp?.BackButton?.offClick) {
                 window.Telegram.WebApp.BackButton.offClick(handleBack);
             }
        }
    }
  }, [activeTab]);

  // Função auxiliar para adicionar e salvar transação
  const handleAddTransaction = (newTx: Transaction) => {
      const updatedList = [newTx, ...transactions];
      // Mantém apenas os últimos 50 itens para não estourar o limite de 4kb do CloudStorage
      const slicedList = updatedList.slice(0, 50);
      
      setTransactions(slicedList);
      cloudStorage.setItem('transactions', JSON.stringify(slicedList));
  };

  const handleDeposit = (amount: number) => {
      handleAddTransaction({
          id: `dep_${Date.now()}`,
          type: 'deposit',
          amount: amount,
          date: new Date().toLocaleString('pt-BR'),
          status: 'pending', // PIX gerado é pendente
          description: 'Depósito PIX'
      });
  };

  const handlePurchase = (service: Service) => {
      // Verifica se há saldo suficiente
      if (currentBalance < service.price) {
          setShowBalanceAlert(true);
          return;
      }

      // Simulação de compra (em produção validaria o saldo)
      handleAddTransaction({
          id: `pur_${Date.now()}`,
          type: 'purchase',
          amount: -service.price,
          date: new Date().toLocaleString('pt-BR'),
          status: 'completed',
          description: `Serviço ${service.name}`
      });
      // Navegar para meus números após compra
      setActiveTab('mynumbers');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeView user={user} setTab={setActiveTab} transactions={transactions} currentBalance={currentBalance} />;
      case 'services': return <ServicesView onPurchase={handlePurchase} />;
      case 'mynumbers': return <MyNumbersView transactions={transactions} />;
      case 'orders': return <OrdersView transactions={transactions} />;
      case 'profile': return <ProfileView user={user} />;
      // Balance still needs to be rendered if navigated to from Home
      case 'balance': return <BalanceView onDeposit={handleDeposit} currentBalance={currentBalance} />;
      default: return <HomeView user={user} setTab={setActiveTab} transactions={transactions} currentBalance={currentBalance} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-900 font-sans selection:bg-blue-100">
      <main className="max-w-md mx-auto p-4 animate-fadeIn">
        {renderContent()}
      </main>
      <BottomNav activeTab={activeTab} setTab={setActiveTab} />
      
      {/* INSUFFICIENT BALANCE MODAL */}
      {showBalanceAlert && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
              <div 
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" 
                  onClick={() => setShowBalanceAlert(false)}
              ></div>
              <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative z-10 animate-scaleIn flex flex-col items-center text-center space-y-4">
                   <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-2">
                       <AlertCircle size={32} />
                   </div>
                   <div>
                      <h3 className="text-lg font-bold text-slate-800">Saldo Insuficiente</h3>
                      <p className="text-sm text-slate-500 mt-1">
                          Você precisa de mais créditos para realizar esta compra.
                      </p>
                   </div>
                   <div className="flex gap-3 w-full mt-2">
                       <button 
                          onClick={() => setShowBalanceAlert(false)}
                          className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl active:scale-95 transition-transform"
                       >
                          Cancelar
                       </button>
                       <button 
                          onClick={() => {
                              setShowBalanceAlert(false);
                              setActiveTab('balance');
                          }}
                          className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-transform"
                       >
                          Recarregar
                       </button>
                   </div>
              </div>
          </div>
      )}
    </div>
  );
}
