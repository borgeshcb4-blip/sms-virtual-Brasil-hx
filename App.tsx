
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Inbox,
  Headphones,
  FileText,
  Star,
  Settings,
  Send,
  Bot,
  ShieldAlert,
  Lock
} from 'lucide-react';
import { initTelegramApp, getTelegramUser, cloudStorage } from './services/telegramService';
import { gerarPix } from './services/hoopayService';
import { TelegramUser, Service, Transaction } from './types';
import { GoogleGenAI } from "@google/genai";

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

// --- SKELETON COMPONENTS (SHIMMER EFFECT) ---
const ServiceListSkeleton = () => (
    <div className="flex items-center justify-between p-3 rounded-xl mb-1 border border-transparent">
        <div className="flex items-center space-x-3 w-full">
            <div className="w-9 h-9 rounded-full bg-slate-200 animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
                <div className="h-3 bg-slate-200 rounded w-24 animate-pulse" />
                <div className="h-2 bg-slate-100 rounded w-16 animate-pulse" />
            </div>
        </div>
        <div className="h-6 bg-slate-200 rounded-lg w-16 animate-pulse" />
    </div>
);

const ServiceCardSkeleton = () => (
    <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-3.5 w-full">
            <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
                <div className="h-3 bg-slate-200 rounded w-24 animate-pulse" />
                <div className="h-2 bg-slate-100 rounded w-20 animate-pulse" />
            </div>
        </div>
        <div className="flex flex-col items-end gap-2">
            <div className="h-3 bg-slate-200 rounded w-12 animate-pulse" />
            <div className="h-6 bg-slate-200 rounded w-16 animate-pulse" />
        </div>
    </div>
);

// --- COMPONENTS ---

// 1. Navigation Bar
const BottomNav = ({ activeTab, setTab }: { activeTab: string, setTab: (t: string) => void }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'services', icon: ShoppingCart, label: 'Serviços' },
    { id: 'mynumbers', icon: MessageSquareText, label: 'Meus Números' },
    { id: 'orders', icon: ClipboardList, label: 'Pedidos' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  if (activeTab === 'support' || activeTab === 'terms') return null; // Hide nav when in chat or terms

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
  const [isServicesLoading, setIsServicesLoading] = useState(true);
  
  // Novos estados para a notificação do sino
  const [hasUnreadNotification, setHasUnreadNotification] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    // Simulate loading time for shimmer effect
    const timer = setTimeout(() => {
        setIsServicesLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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

  // Efeito para disparar a notificação após 9 segundos se não houver números
  useEffect(() => {
      if (activeNumbersCount === 0) {
          const timer = setTimeout(() => {
              setHasUnreadNotification(true);
          }, 9000); // 9 segundos exatos

          return () => clearTimeout(timer);
      }
  }, [activeNumbersCount]);

  const handleBellClick = () => {
      // Ao clicar, remove o badge vermelho e abre o modal
      setHasUnreadNotification(false);
      setShowNotificationModal(true);
  };

  const handleAcquireClick = () => {
      setShowNotificationModal(false);
      // Rola até o seletor de serviços
      document.getElementById('service-selector')?.scrollIntoView({ behavior: 'smooth' });
  };

  const closeNotificationModal = () => {
      setShowNotificationModal(false);
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
            onClick={handleBellClick}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 active:bg-slate-50 relative transition-transform active:scale-95"
        >
            <Bell size={20} className={hasUnreadNotification ? "text-slate-600" : ""} />
            {hasUnreadNotification && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            )}
        </button>
      </div>

      {/* NOTIFICATION MODAL */}
      {showNotificationModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
              <div 
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" 
                  onClick={closeNotificationModal}
              ></div>
              <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative z-10 animate-scaleIn flex flex-col items-center text-center">
                  <button onClick={closeNotificationModal} className="absolute right-4 top-4 text-slate-300 hover:text-slate-500 p-1">
                      <X size={20} />
                  </button>
                  
                  <div className="py-4 flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-2 shadow-sm">
                            <Smartphone size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Você ainda não tem nenhum número</h3>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-[240px]">
                            Para receber SMS de qualquer site ou aplicativo, compre um número virtual agora mesmo.
                        </p>
                        <button 
                            onClick={handleAcquireClick} 
                            className="mt-4 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl active:scale-95 transition-transform w-full shadow-lg shadow-blue-200"
                        >
                            Adquirir número
                        </button>
                  </div>
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
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-transparent focus:bg-white bg-slate-50 focus:outline-none focus:border-blue-500 focus:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm placeholder:text-slate-400 text-slate-800 font-medium"
                    />
                </div>
                <div className="space-y-1 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar px-1">
                    {isServicesLoading ? (
                        // Shimmer Skeleton Loading
                        Array(5).fill(0).map((_, i) => <ServiceListSkeleton key={i} />)
                    ) : (
                        filteredServices.length > 0 ? filteredServices.map(service => (
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
                        )
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const ServicesView = ({ onPurchase }: { onPurchase: (service: Service) => void }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const filteredServices = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return SERVICES.filter(s => s.name.toLowerCase().includes(term));
    }, [searchTerm]);

    return (
    <div className="pb-28 space-y-4 pt-4">
        <h2 className="text-xl font-bold text-slate-800 px-1">Todos Serviços</h2>
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 sticky top-4 z-30">
             <div className="relative">
                <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar serviço..." 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-slate-50 transition-all text-sm font-medium text-slate-800"
                />
            </div>
        </div>

        <div className="grid gap-2.5">
            {isLoading ? (
                // Shimmer Effect Skeletons
                Array(7).fill(0).map((_, i) => <ServiceCardSkeleton key={i} />)
            ) : (
                filteredServices.length > 0 ? (
                    filteredServices.map(service => (
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
                ))) : (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <Search size={32} className="mb-3 opacity-50"/>
                        <p className="font-medium text-sm">Nenhum serviço encontrado</p>
                    </div>
                )
            )}
        </div>
    </div>
)};

const MyNumbersView = ({ transactions }: { transactions: Transaction[] }) => {
    // Estado local para controle do loading
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simula o carregamento ao montar o componente (quando a aba é aberta)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500); // 1.5 segundos de loading

        return () => clearTimeout(timer);
    }, []);

    // Em um app real, filtrariamos por status 'ativo'. Aqui usamos a transação de compra como proxy.
    const activeNumbers = transactions.filter(t => t.type === 'purchase');

    return (
        <div className="pb-28 space-y-4 pt-4">
            <h2 className="text-xl font-bold text-slate-800 px-1">Meus Números</h2>
            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 min-h-[60vh] flex flex-col">
                 {isLoading ? (
                     <div className="flex-1 flex flex-col items-center justify-center gap-4">
                         <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                         <p className="text-slate-500 font-bold text-sm">Carregando seus números...</p>
                     </div>
                 ) : (
                     activeNumbers.length > 0 ? (
                        <div className="space-y-3 animate-fadeIn">
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
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-fadeIn">
                             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                                 <Inbox size={32} />
                             </div>
                             <p className="text-slate-500 font-bold text-sm">Não há números ativos no momento</p>
                        </div>
                     )
                 )}
            </div>
        </div>
    )
}

const OrdersView = ({ transactions }: { transactions: Transaction[] }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="pb-28 space-y-4 pt-4">
             <h2 className="text-xl font-bold text-slate-800 px-1">Histórico de Pedidos</h2>
             <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 min-h-[60vh] flex flex-col">
                {isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="text-slate-500 font-bold text-sm">Carregando histórico...</p>
                    </div>
                ) : (
                    transactions.length > 0 ? (
                        <div className="space-y-3 animate-fadeIn">
                            {transactions.map((t) => (
                                <div key={t.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {t.type === 'deposit' ? <ArrowUpRight size={20}/> : <ShoppingCart size={20}/>}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{t.description}</p>
                                            <p className="text-[10px] text-slate-400">{t.date}</p>
                                        </div>
                                    </div>
                                    <span className={`font-bold text-sm ${t.type === 'deposit' ? 'text-green-600' : 'text-slate-600'}`}>
                                        {t.type === 'deposit' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-fadeIn">
                             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                                 <ClipboardList size={32} />
                             </div>
                             <p className="text-slate-500 font-bold text-sm">Nenhum pedido realizado</p>
                        </div>
                    )
                )}
             </div>
        </div>
    );
}

const BalanceView = ({ onDeposit, currentBalance }: { onDeposit: (amount: number) => void, currentBalance: number }) => {
    const [amount, setAmount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'amount' | 'payment'>('amount');
    const [pixData, setPixData] = useState<{ payload: string, qrCode: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(60); 
    const [copied, setCopied] = useState(false);
    
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
                                        <span className="text-xs font-bold">Expirado</span>
                                    </div>
                                )}
                             </div>
                        </div>

                        {/* Copy Paste Section */}
                        <div className="bg-slate-50 p-6 border-t border-slate-100">
                             <p className="text-center text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-3">Código Copia e Cola</p>
                             <div className="flex items-center gap-2">
                                 <div className="bg-white border border-slate-200 text-slate-500 text-xs p-3 rounded-xl flex-1 font-mono truncate select-all">
                                     {pixData.payload}
                                 </div>
                                 <button 
                                    onClick={copyToClipboard}
                                    className={`p-3 rounded-xl font-bold transition-all ${copied ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-blue-600 text-white shadow-lg shadow-blue-200 active:scale-90'}`}
                                 >
                                     {copied ? <Check size={20} /> : <Copy size={20} />}
                                 </button>
                             </div>
                             {copied && <p className="text-center text-green-600 text-[10px] font-bold mt-2 animate-bounce">Código copiado!</p>}
                        </div>
                    </div>
                    
                    <p className="text-center text-slate-400 text-[10px] mt-6 px-8 leading-relaxed">
                        Ao realizar o pagamento, seu saldo será atualizado automaticamente em alguns instantes.
                    </p>
                </div>
                )
             )}
        </div>
    );
};

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

const SupportChatView = ({ user, onClose }: { user: TelegramUser | null, onClose: () => void }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: `Olá ${user?.first_name || 'Visitante'}! Sou o assistente virtual do Ativa SMS. Como posso ajudar você hoje com seus números ou recargas?`,
            isUser: false,
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatSessionRef = useRef<any>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Initialize Gemini
    useEffect(() => {
        const initChat = async () => {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Build services list string
            const servicesList = SERVICES.map(s => `- ${s.name}: R$ ${s.price.toFixed(2)} (${s.category})`).join('\n');
            
            const systemInstruction = `
            Você é o assistente virtual oficial do "Ativa SMS", um serviço de números virtuais para receber SMS.
            
            INFORMAÇÕES DO USUÁRIO:
            Nome: ${user?.first_name || 'Visitante'}
            
            SUAS DIRETRIZES:
            1. SEMPRE chame o usuário pelo nome (primeiro nome).
            2. Seu objetivo é ajudar com: comprar números, preços, recargas (Pix) e problemas de não receber SMS.
            3. RESTRICÃO IMPORTANTE: Você NÃO deve responder sobre assuntos que não sejam relacionados ao app (ex: não responda sobre matemática, história, política, programação, conselhos de vida, etc). Se o usuário perguntar algo fora do contexto, diga educadamente que só pode ajudar com o Ativa SMS.
            4. Tone de voz: Amigável, prestativo e direto. Use emojis ocasionalmente.
            5. Se o usuário perguntar preços, use a tabela abaixo.
            6. Sobre pagamentos: Aceitamos apenas PIX. O saldo cai automaticamente após o pagamento.
            7. Se o SMS não chegar: 
               - O valor volta para o saldo do app automaticamente após o tempo expirar.
               - IMPORTANTÍSSIMO: Se o usuário perguntar sobre "sacar" ou "devolver dinheiro para o banco", CONFIRME QUE É POSSÍVEL.
               - Diga: "Se os números não funcionaram para você, nós garantimos seu direito. Você pode solicitar o estorno (reembolso) do valor pago via PIX diretamente para sua conta bancária. Para isso, basta solicitar a um atendente humano."

            TABELA DE SERVIÇOS E PREÇOS:
            ${servicesList}
            `;

            try {
                chatSessionRef.current = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: systemInstruction,
                        temperature: 0.7,
                    }
                });
            } catch (error) {
                console.error("Erro ao iniciar chat IA", error);
            }
        };

        initChat();
    }, [user]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            if (chatSessionRef.current) {
                const result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
                const responseText = result.text;
                
                const aiMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    text: responseText,
                    isUser: false,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, aiMsg]);
            } else {
                // Fallback if AI init failed
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: (Date.now() + 1).toString(),
                        text: "Desculpe, estou com problemas de conexão no momento. Tente novamente mais tarde.",
                        isUser: false,
                        timestamp: new Date()
                    }]);
                }, 1000);
            }
        } catch (error) {
            console.error("Erro ao enviar mensagem", error);
             setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: "Ocorreu um erro ao processar sua mensagem.",
                isUser: false,
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="flex flex-col h-[100vh] bg-slate-50 fixed inset-0 z-[60]">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors">
                        <ChevronLeft size={24} className="text-slate-600"/>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md shadow-blue-200">
                            <Bot size={24} />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800 text-sm">Suporte Inteligente</h2>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide">Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#eef2f6]">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                            msg.isUser 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                        }`}>
                            {msg.text}
                            <span className={`text-[9px] block text-right mt-1 opacity-70 ${msg.isUser ? 'text-blue-100' : 'text-slate-400'}`}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-3 border-t border-slate-100 pb-safe">
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-100 transition-all">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Digite sua dúvida..." 
                        className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none font-medium"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="bg-blue-600 text-white p-2.5 rounded-lg shadow-sm active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const TermsView = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-[#f8fafc] z-[60] flex flex-col h-[100vh]">
            <div className="bg-white border-b border-slate-100 p-4 flex items-center gap-3 shadow-sm shrink-0">
                <button onClick={onClose} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors text-slate-600">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                        <FileText size={18} />
                     </div>
                     <h2 className="font-bold text-slate-800 text-lg">Termos e Condições</h2>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-8 text-sm text-slate-600 pb-12">
                
                {/* 1. Header & Verification */}
                <div className="text-center space-y-2 mb-2">
                    <h3 className="font-extrabold text-slate-800 text-xl">Ativa SMS</h3>
                    <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                        <CheckCircle2 size={12} strokeWidth={3} />
                        Mini App Verificado Telegram
                    </div>
                </div>

                {/* 2. Sobre Nós */}
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-900 font-bold text-base mb-3 flex items-center gap-2">
                        <Info size={20} className="text-blue-600"/> 1. Sobre Nós
                    </h3>
                    <p className="leading-relaxed text-slate-500 mb-2">
                        O <strong>Ativa SMS</strong> é uma plataforma automatizada que fornece números virtuais temporários para recebimento de SMS. 
                    </p>
                    <p className="leading-relaxed text-slate-500">
                        Nossa missão é oferecer privacidade e segurança para usuários que desejam se cadastrar em aplicativos, sites e redes sociais sem expor seu número de telefone pessoal.
                    </p>
                </section>

                {/* 3. Reembolsos (CRITICAL) */}
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-900 font-bold text-base mb-3 flex items-center gap-2">
                        <Banknote size={20} className="text-green-600"/> 2. Política de Reembolso
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                            <h4 className="font-bold text-green-800 text-xs uppercase mb-1">Reembolso Automático</h4>
                            <p className="text-xs text-green-700 leading-relaxed">
                                Se você comprar um número e o código SMS não chegar dentro do tempo limite (geralmente 20 minutos), o pedido é cancelado e o valor <strong>retorna automaticamente</strong> para seu saldo no app. Você não perde dinheiro.
                            </p>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                            <h4 className="font-bold text-blue-800 text-xs uppercase mb-1">Saque Bancário (Estorno)</h4>
                            <p className="text-xs text-blue-700 leading-relaxed">
                                Entendemos que imprevistos acontecem. Se o serviço não funcionar para você e desejar seu dinheiro de volta na conta bancária:
                            </p>
                            <p className="text-xs text-blue-700 font-bold mt-2">
                                ✅ Sim, fazemos o reembolso via PIX para sua conta bancária.
                            </p>
                            <p className="text-xs text-blue-700 mt-1">
                                Basta entrar em contato com nosso Suporte e solicitar o estorno do valor recarregado que não foi utilizado.
                            </p>
                        </div>
                    </div>
                </section>

                 {/* 4. Alerta de Golpes (CRITICAL) */}
                 <section className="bg-red-50 p-5 rounded-2xl border border-red-100 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 bg-red-100 w-24 h-24 rounded-full opacity-50"></div>
                    
                    <h3 className="text-red-700 font-bold text-base mb-3 flex items-center gap-2 relative z-10">
                        <ShieldAlert size={20}/> 3. Alerta de Golpes
                    </h3>
                    
                    <div className="space-y-3 relative z-10">
                        <p className="leading-relaxed text-red-800 text-xs font-bold">
                            ⚠️ ATENÇÃO: NÃO CAIA EM GOLPES!
                        </p>
                        <p className="leading-relaxed text-red-700/90 text-xs">
                            O Ativa SMS vende apenas o número para receber o código. <strong>Não temos vínculo com as plataformas</strong> (WhatsApp, Telegram, etc).
                        </p>
                        <ul className="list-disc pl-4 text-xs text-red-700/90 space-y-1">
                            <li>Não confie em promessas de "dinheiro fácil", "renda extra garantida" ou "tarefas pagas" que exigem criar contas.</li>
                            <li>Nunca compartilhe códigos de verificação com estranhos.</li>
                            <li>Se alguém pediu para você comprar um número aqui para "validar" algo e ganhar dinheiro, <strong>é provável que seja um golpe</strong>.</li>
                        </ul>
                    </div>
                </section>

                {/* 5. Responsabilidades */}
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-900 font-bold text-base mb-3 flex items-center gap-2">
                        <Lock size={20} className="text-slate-600"/> 4. Termos de Uso
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-500 mb-2">
                        Ao utilizar o Ativa SMS, você concorda que:
                    </p>
                    <ul className="space-y-2">
                        <li className="flex gap-2 text-xs text-slate-500">
                            <span className="text-slate-300">•</span>
                            Os números são temporários e descartáveis. Não devem ser usados para contas bancárias pessoais ou serviços que exijam recuperação futura.
                        </li>
                        <li className="flex gap-2 text-xs text-slate-500">
                            <span className="text-slate-300">•</span>
                            É estritamente proibido usar nossos serviços para atividades ilegais, fraudes, assédio ou spam. Contas identificadas com tais práticas serão banidas.
                        </li>
                        <li className="flex gap-2 text-xs text-slate-500">
                            <span className="text-slate-300">•</span>
                            O serviço é fornecido "como está". Embora tenhamos alta taxa de sucesso, não garantimos 100% de entrega de SMS devido a filtros das operadoras.
                        </li>
                    </ul>
                </section>
                
                <div className="pt-4 pb-4 text-center">
                    <p className="text-[10px] text-slate-400 font-medium">
                        Atualizado em Março de 2025<br/>
                        © 2025 Ativa SMS. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
};

const ProfileView = ({ user, onOpenSupport, onOpenTerms }: { user: TelegramUser | null, onOpenSupport: () => void, onOpenTerms: () => void }) => {
    const handleCloseApp = () => {
        window.Telegram?.WebApp?.close();
    };

    return (
        <div className="pb-28 pt-4 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 px-1">Meu Perfil</h2>
            
            {/* User Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-5 -mb-5"></div>
                
                <div className="relative z-10 flex items-center gap-4">
                     <div className="relative">
                        {user?.photo_url ? (
                            <img src={user.photo_url} alt="Profile" className="w-16 h-16 rounded-full border-4 border-white/20 shadow-sm" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white border-4 border-white/20">
                                <User size={32} />
                            </div>
                        )}
                        {user?.is_premium && (
                            <div className="absolute -bottom-1 -right-1 bg-white text-blue-600 p-1 rounded-full shadow-sm" title="Premium">
                                <Star size={12} fill="currentColor" />
                            </div>
                        )}
                     </div>
                     <div>
                         <h3 className="text-xl font-bold leading-tight">{user?.first_name} {user?.last_name}</h3>
                         {user?.username && <p className="text-blue-100 text-sm font-medium">@{user.username}</p>}
                     </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ID Usuário</p>
                    <p className="font-mono text-slate-700 font-bold">{user?.id || '---'}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Idioma</p>
                    <p className="font-bold text-slate-700 flex items-center gap-2">
                        <Globe size={14} className="text-blue-500" />
                        {(user?.language_code || 'pt-br').toUpperCase()}
                    </p>
                </div>
            </div>

            {/* Menu List */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <button 
                    onClick={onOpenSupport}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <Headphones size={18} />
                        </div>
                        <span className="font-bold text-slate-700 text-sm">Suporte Inteligente</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500" />
                </button>
                <button 
                    onClick={onOpenTerms}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                            <ShieldCheck size={18} />
                        </div>
                        <span className="font-bold text-slate-700 text-sm">Termos de Uso</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500" />
                </button>
                <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                            <Info size={18} />
                        </div>
                        <span className="font-bold text-slate-700 text-sm">Versão do App</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">v1.2.0</span>
                </button>
            </div>

             <button 
                onClick={handleCloseApp}
                className="w-full py-4 text-slate-400 font-bold text-sm hover:text-red-500 transition-colors flex items-center justify-center gap-2"
             >
                <LogOut size={18} /> Sair do Mini App
             </button>
        </div>
    );
};

const App = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [user, setUser] = useState<TelegramUser | null>(null);
    const [balance, setBalance] = useState(0.00);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    
    // NEW STATE
    const [showInsufficientBalanceModal, setShowInsufficientBalanceModal] = useState(false);

    useEffect(() => {
        initTelegramApp();
        const tgUser = getTelegramUser();
        setUser(tgUser);
        setBalance(0.00);
    }, []);

    const handlePurchase = (service: Service) => {
        if (balance >= service.price) {
            setBalance(prev => prev - service.price);
            const newTx: Transaction = {
                id: Date.now().toString(),
                type: 'purchase',
                amount: service.price,
                date: new Date().toLocaleDateString('pt-BR'),
                status: 'completed',
                description: service.name
            };
            setTransactions(prev => [newTx, ...prev]);
            setActiveTab('mynumbers');
        } else {
            // CHANGED HERE
            setShowInsufficientBalanceModal(true);
        }
    };

    const handleDeposit = (amount: number) => {
         // Logic to handle deposit visualization (mock)
         const newTx: Transaction = {
            id: Date.now().toString(),
            type: 'deposit',
            amount: amount,
            date: new Date().toLocaleDateString('pt-BR'),
            status: 'pending',
            description: 'Depósito PIX'
        };
        setTransactions(prev => [newTx, ...prev]);
    }

    const renderContent = () => {
        switch(activeTab) {
            case 'home': return <HomeView user={user} setTab={setActiveTab} transactions={transactions} currentBalance={balance} />;
            case 'services': return <ServicesView onPurchase={handlePurchase} />;
            case 'mynumbers': return <MyNumbersView transactions={transactions} />;
            case 'orders': return <OrdersView transactions={transactions} />;
            case 'balance': return <BalanceView onDeposit={handleDeposit} currentBalance={balance} />;
            case 'profile': return <ProfileView user={user} onOpenSupport={() => setActiveTab('support')} onOpenTerms={() => setActiveTab('terms')} />;
            case 'support': return <SupportChatView user={user} onClose={() => setActiveTab('profile')} />;
            case 'terms': return <TermsView onClose={() => setActiveTab('profile')} />;
            default: return <HomeView user={user} setTab={setActiveTab} transactions={transactions} currentBalance={balance} />;
        }
    };

    return (
        <div className="min-h-screen font-sans text-slate-900 bg-[#f8fafc] max-w-md mx-auto relative shadow-2xl">
            <div className="px-4">
                {renderContent()}
            </div>
            
            {/* NEW MODAL JSX */}
            {showInsufficientBalanceModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
                    <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" 
                        onClick={() => setShowInsufficientBalanceModal(false)}
                    ></div>
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative z-10 animate-scaleIn flex flex-col items-center text-center">
                        <button onClick={() => setShowInsufficientBalanceModal(false)} className="absolute right-4 top-4 text-slate-300 hover:text-slate-500 p-1">
                            <X size={20} />
                        </button>
                        
                        <div className="py-4 flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-2 shadow-sm">
                                    <Wallet size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">Saldo Insuficiente</h3>
                                <p className="text-sm text-slate-500 leading-relaxed max-w-[240px]">
                                    Você não tem saldo suficiente para realizar esta compra.
                                </p>
                                <div className="w-full flex flex-col gap-2 mt-4">
                                    <button 
                                        onClick={() => {
                                            setShowInsufficientBalanceModal(false);
                                            setActiveTab('balance');
                                        }} 
                                        className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl active:scale-95 transition-transform w-full shadow-lg shadow-blue-200"
                                    >
                                        Recarregar Agora
                                    </button>
                                    <button 
                                        onClick={() => setShowInsufficientBalanceModal(false)}
                                        className="text-slate-400 font-bold text-sm py-2 active:text-slate-600"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                        </div>
                    </div>
                </div>
            )}

            <BottomNav activeTab={activeTab} setTab={setActiveTab} />
        </div>
    );
};

export default App;
