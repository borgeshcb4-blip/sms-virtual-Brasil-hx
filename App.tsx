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
  ShieldAlert,
  Lock,
  MapPin,
  Clock,
  CalendarDays,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { initTelegramApp, getTelegramUser, cloudStorage } from './services/telegramService';
import { gerarPix } from './services/hoopayService';
import { TelegramUser, Service, Transaction } from './types';

// --- MOCK DATA ---
interface ExtendedService extends Service {
    category: 'social' | 'bank' | 'ecommerce' | 'other';
}

const SERVICES: ExtendedService[] = [
  // 0. Agregador (Fixado no Topo)
  { 
      id: 'specific', name: 'Outros Apps e Sites', price: 1.50, icon: 'bg-slate-800 text-white', category: 'other', isNew: true, stock: 325,
      logoUrl: 'https://iili.io/fRd2rCu.webp'
  },

  // 1. Mais Famosos (Top Tier)
  { 
      id: '1', name: 'WhatsApp', price: 3.50, icon: 'bg-[#25D366] text-white', isHot: true, category: 'social', stock: 4238,
      logoUrl: 'https://iili.io/fAb6sTu.png'
  },
  { 
      id: '4', name: 'Instagram', price: 1.10, icon: 'bg-gradient-to-tr from-yellow-400 to-purple-600 text-white', isHot: true, category: 'social', stock: 2841,
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/512px-Instagram_logo_2016.svg.png'
  },
  { 
      id: '2', name: 'Telegram', price: 4.20, icon: 'bg-[#0088cc] text-white', isHot: true, category: 'social', stock: 1205,
      logoUrl: 'https://iili.io/fAmgblS.jpg'
  },
  { 
      id: '7', name: 'TikTok', price: 1.00, icon: 'bg-black text-white', category: 'social', stock: 5620,
      logoUrl: 'https://iili.io/fAbt8NI.png'
  },
  { 
      id: '3', name: 'Google, youtube, Gmail', price: 2.10, icon: 'bg-[#EA4335] text-white', isHot: true, category: 'other', stock: 5400,
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png'
  },
  
  // 3. Bancos Populares
  { 
      id: '8', name: 'Nubank', price: 3.00, icon: 'bg-[#820AD1] text-white', isHot: true, category: 'bank', stock: 892,
      logoUrl: 'https://iili.io/fAm9pWB.png'
  },
  { 
      id: '13', name: 'Caixa Tem', price: 4.50, icon: 'bg-[#005CA9] text-white', isHot: true, category: 'bank', stock: 345,
      logoUrl: 'https://iili.io/fAmw1MF.md.png'
  },
  { 
      id: '9', name: 'PicPay', price: 2.80, icon: 'bg-[#11C76F] text-white', category: 'bank', stock: 1240,
      logoUrl: 'https://iili.io/fR9jJAx.md.webp'
  },

  // 4. E-commerce & Apps Populares
  { 
      id: '15', name: 'Mercado Livre', price: 2.50, icon: 'bg-[#FFE600] text-blue-900', isHot: true, category: 'ecommerce', stock: 1540,
      logoUrl: 'https://iili.io/fAplW42.jpg'
  },
  { 
      id: '5', name: 'Uber/UberEats', price: 1.20, icon: 'bg-black text-white', category: 'ecommerce', stock: 4500,
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Uber_logo_2018.png/512px-Uber_logo_2018.png'
  },
  { 
      id: '6', name: 'iFood', price: 1.50, icon: 'bg-[#EA1D2C] text-white', category: 'ecommerce', stock: 3120,
      logoUrl: 'https://iili.io/fAmDMyQ.png'
  },
  { 
      id: '34', name: 'OpenAI / ChatGPT', price: 2.50, icon: 'bg-[#74aa9c] text-white', category: 'other', stock: 890,
      logoUrl: 'https://iili.io/fR2ED8b.md.png'
  },
  { 
      id: '20', name: 'Gov.br', price: 5.00, icon: 'bg-[#002D72] text-white', isHot: true, category: 'other', stock: 150,
      logoUrl: 'https://iili.io/fRJ8aBj.webp'
  },

  // 5. Redes Sociais Secundárias
  { 
      id: '21', name: 'Facebook', price: 1.50, icon: 'bg-[#1877F2] text-white', category: 'social', stock: 3102,
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/512px-2021_Facebook_icon.svg.png'
  },
  { 
      id: '33', name: 'Twitter (X)', price: 1.20, icon: 'bg-black text-white', category: 'social', stock: 3200,
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/512px-X_logo_2023.svg.png'
  },
  { 
      id: '22', name: 'Kwai', price: 1.20, icon: 'bg-[#FF8F00] text-white', category: 'social', stock: 450,
      logoUrl: 'https://iili.io/fAmawqN.png'
  },
  { 
      id: '30', name: 'Tinder', price: 3.00, icon: 'bg-[#FE3C72] text-white', category: 'social', stock: 920,
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/TinderIcon-2017.svg/512px-TinderIcon-2017.svg.png'
  },
  { 
      id: '31', name: 'Discord', price: 1.50, icon: 'bg-[#5865F2] text-white', category: 'social', stock: 1850,
      logoUrl: 'https://iili.io/fApe4pf.png'
  },
  { 
      id: '32', name: 'Snapchat', price: 1.50, icon: 'bg-[#FFFC00] text-black', category: 'social', stock: 1100,
      logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Snapchat_logo.svg/1024px-Snapchat_logo.svg.png'
  },

  // 6. Outros Bancos
  { 
      id: '11', name: 'Mercado Pago', price: 2.20, icon: 'bg-[#009EE3] text-white', category: 'bank', stock: 2100,
      logoUrl: 'https://iili.io/fAmPJbn.jpg'
  },
  { 
      id: '10', name: 'Banco Inter', price: 2.50, icon: 'bg-[#FF7A00] text-white', category: 'bank', stock: 560,
      logoUrl: 'https://iili.io/fApEILb.jpg'
  },
  { 
      id: '12', name: 'PagBank', price: 2.00, icon: 'bg-[#96C93D] text-white', category: 'bank', stock: 890,
      logoUrl: 'https://iili.io/fRJVenI.jpg'
  },
  { 
      id: '14', name: 'C6 Bank', price: 2.50, icon: 'bg-[#2E2E2E] text-white', category: 'bank', stock: 420,
      logoUrl: 'https://iili.io/fApEQje.png'
  },
  { 
      id: '36', name: 'RecargaPay', price: 2.00, icon: 'bg-[#1A4D8C] text-white', category: 'bank', stock: 450,
      logoUrl: 'https://iili.io/fR2xjQR.webp'
  },
  { 
      id: '24', name: 'Bradesco', price: 3.00, icon: 'bg-[#CC092F] text-white', category: 'bank', stock: 280,
      logoUrl: 'https://iili.io/fR2TMv9.jpg'
  },
  { 
      id: '25', name: 'Santander', price: 3.20, icon: 'bg-[#EC0000] text-white', category: 'bank', stock: 250,
      logoUrl: 'https://iili.io/fApcVJ1.jpg'
  },

  // 7. Outros E-commerce
  { 
      id: '16', name: 'Shopee', price: 1.80, icon: 'bg-[#EE4D2D] text-white', category: 'ecommerce', stock: 2300,
      logoUrl: 'https://iili.io/fRdY5Nt.md.jpg'
  },
  { 
      id: '35', name: 'Shein', price: 1.80, icon: 'bg-black text-white', category: 'ecommerce', stock: 1500,
      logoUrl: 'https://iili.io/fR2zrS1.webp'
    },
  { 
      id: '17', name: 'Amazon', price: 2.00, icon: 'bg-[#232F3E] text-white', category: 'ecommerce', stock: 890,
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amazon_icon.svg/512px-Amazon_icon.svg.png'
  },
  { 
      id: '18', name: '99 App', price: 1.30, icon: 'bg-[#FFBB00] text-black', category: 'ecommerce', stock: 1200,
      logoUrl: 'https://iili.io/fR2RNCG.png'
  },
  { 
      id: '28', name: 'Zé Delivery', price: 1.50, icon: 'bg-[#FFC926] text-black', category: 'ecommerce', stock: 680,
      logoUrl: 'https://iili.io/fAp90kG.png'
  },

  // 8. Outros
  { 
      id: '19', name: 'Netflix', price: 3.50, icon: 'bg-[#E50914] text-white', category: 'other', stock: 780,
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Netflix-new-icon.png/512px-Netflix-new-icon.png'
  },
  { 
      id: '37', name: 'Xbox', price: 2.50, icon: 'bg-[#107C10] text-white', category: 'other', stock: 650,
      logoUrl: 'https://iili.io/fR251ou.webp'
  },
  { 
      id: '29', name: 'OLX', price: 2.00, icon: 'bg-[#6E0AD6] text-white', category: 'other', stock: 430,
      logoUrl: 'https://iili.io/fAp2yDG.png'
  },
];

// --- SOCIAL PROOF DATA ---
const BRAZILIAN_NAMES = [
  "Miguel", "Arthur", "Gael", "Théo", "Heitor", "Ravi", "Davi", "Bernardo", "Gabriel", "Noah",
  "Pedro", "Lucas", "Mateus", "Gustavo", "Felipe", "João", "Rafael", "Daniel", "Enzo", "Bruno",
  "Helena", "Alice", "Laura", "Maria", "Sophia", "Manuela", "Maitê", "Liz", "Cecília", "Isabella",
  "Luísa", "Beatriz", "Mariana", "Ana", "Júlia", "Lara", "Fernanda", "Camila", "Amanda", "Letícia",
  "Rodrigo", "Carlos", "Diego", "Eduardo", "Marcelo", "Ricardo", "Vanessa", "Patrícia", "Cristina"
];

const BRAZILIAN_STATES = [
  "SP", "RJ", "MG", "BA", "RS", "PR", "PE", "CE", "PA", "SC", "MA", "GO", "AM", "ES", "PB", "RN", "MT", "AL", "PI", "DF", "MS", "SE", "RO", "TO", "AC", "AP", "RR"
];

const TIME_VARIATIONS = [
    // Live (Apenas 1 chance, raro)
    { label: "agora", isLive: true },
    
    // Minutos Variados
    { label: "há 2 min", isLive: false },
    { label: "há 4 min", isLive: false },
    { label: "há 7 min", isLive: false },
    { label: "há 9 min", isLive: false },
    { label: "há 12 min", isLive: false },
    { label: "há 16 min", isLive: false },
    { label: "há 23 min", isLive: false },
    { label: "há 28 min", isLive: false },
    { label: "há 34 min", isLive: false },
    { label: "há 41 min", isLive: false },
    { label: "há 47 min", isLive: false },
    { label: "há 53 min", isLive: false },
    { label: "há 59 min", isLive: false },

    // Horas Variadas (Maioria)
    { label: "há 1 hora", isLive: false },
    { label: "há 1 hora", isLive: false },
    { label: "há 2 horas", isLive: false },
    { label: "há 2 horas", isLive: false },
    { label: "há 3 horas", isLive: false },
    { label: "há 4 horas", isLive: false },
    { label: "há 5 horas", isLive: false },
    { label: "há 6 horas", isLive: false },
    { label: "há 7 horas", isLive: false },
    { label: "há 9 horas", isLive: false },
    { label: "há 11 horas", isLive: false },
    { label: "há 14 horas", isLive: false },
    { label: "há 18 horas", isLive: false },
    { label: "há 21 horas", isLive: false },
    { label: "há 23 horas", isLive: false },

    // Dias (Perspectiva de longo prazo)
    { label: "ontem", isLive: false },
    { label: "ontem", isLive: false },
    { label: "ontem", isLive: false },
    { label: "há 2 dias", isLive: false },
    { label: "há 2 dias", isLive: false },
    { label: "há 3 dias", isLive: false },
    { label: "há 4 dias", isLive: false },
    { label: "há 5 dias", isLive: false },
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

// Helper for rendering Service Icon
const ServiceIcon = ({ service, size = "w-9 h-9", rounded = "rounded-full" }: { service: Service, size?: string, rounded?: string }) => {
    const [imgError, setImgError] = useState(false);

    if (service.logoUrl && !imgError) {
        return (
            <div className={`${size} ${rounded} bg-white flex items-center justify-center shadow-sm border border-slate-100 p-0.5 overflow-hidden shrink-0`}>
                <img 
                    src={service.logoUrl} 
                    alt={service.name} 
                    className="w-full h-full object-contain"
                    onError={() => setImgError(true)}
                />
            </div>
        );
    }
    return (
        <div className={`${size} ${rounded} ${service.icon} flex items-center justify-center font-bold shadow-sm ring-1 ring-black/5 shrink-0`}>
            {service.id === 'specific' ? <MoreHorizontal size={14}/> : service.name[0]}
        </div>
    );
};


// Social Proof Widget (Herd Effect)
const SocialProofWidget = () => {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState<{
        name: string, 
        state: string, 
        service: ExtendedService,
        timeLabel: string,
        isLive: boolean
    } | null>(null);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;
        let hideTimeoutId: ReturnType<typeof setTimeout>;

        const scheduleNext = () => {
            // Intervalo mais aleatório e um pouco mais espaçado (entre 6 e 18 segundos)
            const interval = Math.floor(Math.random() * (18000 - 6000 + 1) + 6000);
            
            timeoutId = setTimeout(() => {
                // Generate random data
                const randomName = BRAZILIAN_NAMES[Math.floor(Math.random() * BRAZILIAN_NAMES.length)];
                const randomState = BRAZILIAN_STATES[Math.floor(Math.random() * BRAZILIAN_STATES.length)];
                const randomService = SERVICES[Math.floor(Math.random() * SERVICES.length)];
                
                // Random Time Label from extended list
                const timeObj = TIME_VARIATIONS[Math.floor(Math.random() * TIME_VARIATIONS.length)];

                setData({ 
                    name: randomName, 
                    state: randomState, 
                    service: randomService,
                    timeLabel: timeObj.label,
                    isLive: timeObj.isLive
                });
                setVisible(true);

                // Hide after 5 seconds
                hideTimeoutId = setTimeout(() => {
                    setVisible(false);
                    scheduleNext(); // Schedule next occurrence
                }, 5000);

            }, interval);
        };

        // Start loop
        scheduleNext();

        return () => {
            clearTimeout(timeoutId);
            clearTimeout(hideTimeoutId);
        };
    }, []);

    if (!data) return null;

    return (
        <div className={`fixed bottom-24 left-0 right-0 z-40 flex justify-center pointer-events-none transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-full shadow-xl border border-slate-100 flex items-center gap-3 max-w-[95%] mx-4">
                 <ServiceIcon service={data.service} size="w-7 h-7" />
                 <div className="flex flex-col">
                     <p className="text-[11px] text-slate-800 leading-tight">
                        <span className="font-bold">{data.name}</span> ({data.state}) ativou <span className="font-bold text-blue-600">{data.service.name}</span>
                     </p>
                 </div>
                 <div className="flex items-center gap-1 pl-2 border-l border-slate-200 ml-1">
                     {data.isLive ? (
                         <>
                            <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </div>
                            <span className="text-[10px] font-bold text-green-600 whitespace-nowrap">{data.timeLabel}</span>
                         </>
                     ) : (
                         <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{data.timeLabel}</span>
                     )}
                 </div>
            </div>
        </div>
    );
};

// 1. Navigation Bar
const BottomNav = ({ activeTab, setTab }: { activeTab: string, setTab: (t: string) => void }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'services', icon: ShoppingCart, label: 'Serviços' },
    { id: 'mynumbers', icon: MessageSquareText, label: 'Meus Números' },
    { id: 'orders', icon: ClipboardList, label: 'Pedidos' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  if (activeTab === 'support' || activeTab === 'terms' || activeTab === 'faq') return null; // Hide nav when in sub-pages

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

// --- GLOBAL HEADER COMPONENT ---
interface AppHeaderProps {
    user: TelegramUser | null;
    currentBalance: number;
    setTab: (t: string) => void;
    hasUnreadNotification: boolean;
    handleBellClick: () => void;
    activeTab: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
    user, 
    currentBalance, 
    setTab, 
    hasUnreadNotification, 
    handleBellClick,
    activeTab
}) => {
    const photoUrl = user?.photo_url;
    
    const handleHomeClick = () => {
        if (activeTab === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="sticky top-0 z-50 bg-[#f8fafc]/95 backdrop-blur-sm py-3 px-4 flex items-center gap-3 border-b border-transparent transition-colors duration-200">
             {/* 1. Home Button */}
             <button
                className={`w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center active:scale-95 transition-transform shrink-0 ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-700'}`}
                onClick={handleHomeClick}
             >
                <Home size={20} strokeWidth={2.5} />
             </button>

             {/* 2. Balance Button (Center - Blue) */}
             <button
                onClick={() => setTab('balance')}
                className="flex-1 h-10 bg-blue-600 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center text-white gap-2 active:scale-95 transition-transform"
             >
                <span className="font-bold text-base tracking-tight">R$ {currentBalance.toFixed(2).replace('.', ',')}</span>
                <div className="bg-white/20 rounded-full p-0.5">
                   <Plus size={12} strokeWidth={3} />
                </div>
             </button>

             {/* 3. Notification Button */}
             <button
                onClick={handleBellClick}
                className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-500 relative active:scale-95 transition-transform shrink-0"
             >
                <Bell size={20} className="fill-slate-500 text-slate-500" />
                 {hasUnreadNotification && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white shadow-sm z-10">1</span>
                )}
             </button>

             {/* 4. Profile Button */}
             <button
                onClick={() => setTab('profile')}
                className={`w-10 h-10 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden active:scale-95 transition-transform shrink-0 ${activeTab === 'profile' ? 'ring-2 ring-blue-600' : ''}`}
             >
                 {photoUrl ? (
                    <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                    <User size={20} className="text-slate-700" />
                 )}
             </button>
      </div>
    );
};

// 2. Views

const HomeView = ({ user, setTab, transactions, currentBalance, activeNumbersCount }: { user: TelegramUser | null, setTab: (t: string) => void, transactions: Transaction[], currentBalance: number, activeNumbersCount: number }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'social' | 'bank' | 'other'>('all');
  const [isServicesLoading, setIsServicesLoading] = useState(true);

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
    { id: 'other', label: 'Outros', icon: MoreHorizontal },
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

  return (
    <div className="space-y-6 pb-28 relative">
      <SocialProofWidget />

      {/* HEADER IS NOW GLOBAL IN APP COMPONENT */}

      {/* STATS GRID */}
      <div className="grid grid-cols-2 gap-4 px-1 pt-2">
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
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm mx-1">
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
      <div id="service-selector" className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-5 mx-1">
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
                                    <ServiceIcon service={service} />
                                    <span className="font-bold text-slate-700 text-sm group-hover:text-slate-900">{service.name}</span>
                                    {service.isHot && <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md font-bold">HOT</span>}
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
    <div className="pb-28 space-y-4 pt-2">
        <h2 className="text-xl font-bold text-slate-800 px-1 pt-2">Todos Serviços</h2>
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 sticky top-20 z-30">
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
                            <ServiceIcon service={service} size="w-10 h-10" />
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
    const [timeLeft, setTimeLeft] = useState(120); 
    const [copied, setCopied] = useState(false);
    
    // Removed 5 from options
    const options = [10, 15, 20, 30, 50, 100, 200, 300];

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
                setTimeLeft(120); 
                // CRITICAL FIX: Removed onDeposit(amount) here. 
                // Balance should only be added after confirmation/payment.
            } else {
                setError(result.error || "Erro ao gerar PIX");
            }
        } catch (e) {
            setError("Falha na conexão");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmPayment = () => {
        setLoading(true);
        
        setTimeout(() => {
            setLoading(false);
            // Lógica alterada: Sempre nega o pagamento e não adiciona saldo
            alert("Pagamento não identificado");
        }, 2000);
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
                        <div className="mt-3 text-center space-y-0.5">
                            <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
                                <ShieldCheck size={12} className="text-green-500" /> Transação 100% segura
                            </p>
                            <p className="text-[10px] text-slate-400 opacity-75">
                                Processada pela hoopay LTDA • Reembolso em até 24 horas
                            </p>
                        </div>
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
                        Ao realizar o pagamento, clique no botão abaixo para confirmar.
                    </p>

                    <div className="px-4 pb-4">
                        <button 
                            onClick={handleConfirmPayment}
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-green-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Verificar pagamento'}
                        </button>
                    </div>
                </div>
                )
             )}
        </div>
    );
};

const FAQView = ({ onClose }: { onClose: () => void }) => {
    const [openQuestion, setOpenQuestion] = useState<number | null>(null);

    const faqs = [
        {
            id: 1,
            question: "O que acontece se o SMS não chegar?",
            answer: "Fique tranquilo! Nosso sistema é automático. Se o código SMS não chegar dentro do prazo (geralmente 20 minutos), o pedido é cancelado e o dinheiro volta para o seu saldo no aplicativo instantaneamente. Você não paga se não receber.",
            icon: Wallet
        },
        {
            id: 2,
            question: "Quanto tempo dura o número?",
            answer: "O número fica ativo e exclusivo para você por 20 minutos para receber o código de ativação. Após receber o código, o número é desativado. Use-o imediatamente após a compra.",
            icon: Clock
        },
        {
            id: 3,
            question: "Aceita cartão de crédito?",
            answer: "No momento, aceitamos apenas PIX. É o método mais rápido e seguro. O saldo cai na sua conta automaticamente assim que o pagamento é confirmado, 24 horas por dia.",
            icon: CreditCard
        },
        {
            id: 4,
            question: "É seguro? Meus dados estão protegidos?",
            answer: "Sim! Somos um app verificado. Todas as transações são processadas pela hoopay LTDA, garantindo segurança total. Seus dados são criptografados e não compartilhamos informações com terceiros.",
            icon: ShieldCheck
        }
    ];

    const toggleQuestion = (id: number) => {
        setOpenQuestion(openQuestion === id ? null : id);
    };

    return (
        <div className="fixed inset-0 bg-[#f8fafc] z-[60] flex flex-col h-[100vh]">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 p-4 flex items-center gap-3 shadow-sm shrink-0">
                <button onClick={onClose} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors text-slate-600">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <HelpCircle size={18} />
                     </div>
                     <h2 className="font-bold text-slate-800 text-lg">Central de Ajuda</h2>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 pb-12">
                {/* REMOVED: Blue Header Banner as requested */}

                <div className="space-y-3">
                    {faqs.map((item) => (
                        <div 
                            key={item.id} 
                            className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300"
                        >
                            <button 
                                onClick={() => toggleQuestion(item.id)}
                                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${openQuestion === item.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                        <item.icon size={16} />
                                    </div>
                                    <span className={`text-sm font-bold ${openQuestion === item.id ? 'text-blue-700' : 'text-slate-700'}`}>
                                        {item.question}
                                    </span>
                                </div>
                                {openQuestion === item.id ? <ChevronUp size={18} className="text-blue-500" /> : <ChevronDown size={18} className="text-slate-300" />}
                            </button>
                            
                            {openQuestion === item.id && (
                                <div className="px-4 pb-4 pt-0 animate-fadeIn">
                                    <div className="pl-11 pr-2">
                                        <p className="text-xs leading-relaxed text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            {item.answer}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-slate-400 text-xs font-medium mb-4">Não encontrou o que procurava?</p>
                    {/* Note: This assumes onClose will take user back to Profile where they can click Support */}
                    <button onClick={onClose} className="text-blue-600 font-bold text-sm bg-blue-50 px-6 py-3 rounded-xl hover:bg-blue-100 transition-colors active:scale-95">
                        Voltar
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
                    <h3 className="font-extrabold text-slate-800 text-xl">𝗦𝗠𝗦 𝗩𝗜𝗥𝗧𝗨𝗔𝗟 𝗕𝗥</h3>
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
                        O <strong>𝗦𝗠𝗦 𝗩𝗜𝗥𝗧𝗨𝗔𝗟 𝗕𝗥</strong> é uma plataforma automatizada que fornece números virtuais temporários para recebimento de SMS. 
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
                            O 𝗦𝗠𝗦 𝗩𝗜𝗥𝗧𝗨𝗔𝗟 𝗕𝗥 vende apenas o número para receber o código. <strong>Não temos vínculo com as plataformas</strong> (WhatsApp, Telegram, etc).
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
                        Ao utilizar o 𝗦𝗠𝗦 𝗩𝗜𝗥𝗧𝗨𝗔𝗟 𝗕𝗥, você concorda que:
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
                        © 2025 𝗦𝗠𝗦 𝗩𝗜𝗥𝗧𝗨𝗔𝗟 𝗕𝗥. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
};

const ProfileView = ({ user, onOpenSupport, onOpenTerms, onOpenFAQ }: { user: TelegramUser | null, onOpenSupport: () => void, onOpenTerms: () => void, onOpenFAQ: () => void }) => {
    const handleCloseApp = () => {
        window.Telegram?.WebApp?.close();
    };

    return (
        <div className="pb-28 pt-4 px-4 space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Meu Perfil</h2>
            
            {/* Header Card (Blue) */}
            {/* Reduced padding from p-8 to p-6 and avatar from w-24 to w-20 to make it "not too big" */}
            <div className="bg-blue-600 rounded-2xl p-6 flex flex-col justify-center items-center shadow-lg shadow-blue-200 text-center">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm border-2 border-white/20">
                     {user?.photo_url ? <img src={user.photo_url} alt="Profile" className="w-full h-full rounded-full object-cover"/> : <User size={32} />}
                </div>
                <h3 className="text-white font-bold text-xl mt-3">{user?.first_name} {user?.last_name || ''}</h3>
                {user?.username && <p className="text-blue-200 text-sm font-medium">@{user.username}</p>}
            </div>

            {/* Stats Info Grid */}
            <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">ID USUÁRIO</p>
                    <p className="font-bold text-slate-800 text-lg tracking-wide">{user?.id ? user.id : '---'}</p>
                 </div>
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">IDIOMA</p>
                    <div className="flex items-center gap-2 font-bold text-slate-800 text-lg">
                        <Globe size={20} className="text-blue-600"/> PT-BR
                    </div>
                 </div>
            </div>

            {/* Menu List */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                {/* FAQ BUTTON (Highlighted as primary help) */}
                <button onClick={onOpenFAQ} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <HelpCircle size={20} />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="font-bold text-slate-700 text-sm">Perguntas Frequentes</span>
                            <span className="text-[10px] text-slate-400 font-medium">Tire suas dúvidas aqui</span>
                        </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-300"/>
                </button>

                <button onClick={onOpenSupport} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Headphones size={20} />
                        </div>
                        <span className="font-bold text-slate-700 text-sm">Suporte</span>
                    </div>
                    <ChevronRight size={20} className="text-slate-300"/>
                </button>

                <button onClick={onOpenTerms} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="font-bold text-slate-700 text-sm">Termos de Uso</span>
                    </div>
                    <ChevronRight size={20} className="text-slate-300"/>
                </button>

                <div className="w-full p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Info size={20} />
                        </div>
                        <span className="font-bold text-slate-700 text-sm">Versão do App</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">v1.2.0</span>
                </div>
            </div>

            {/* Logout */}
            <button 
                onClick={handleCloseApp}
                className="w-full py-4 flex items-center justify-center gap-2 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
            >
                <LogOut size={18} /> Sair do Mini App
            </button>
        </div>
    );
};

// --- APP COMPONENT ---

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [balance, setBalance] = useState(0.00);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Modals & Navigation State
  const [showTerms, setShowTerms] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

  // Notification Logic (Lifted to App)
  const [hasUnreadNotification, setHasUnreadNotification] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  
  // Computed State
  const activeNumbersCount = transactions.filter(t => t.type === 'purchase' && t.status === 'completed').length;

  useEffect(() => {
    initTelegramApp();
    const telegramUser = getTelegramUser();
    setUser(telegramUser);
    
    // Load persisted data
    const loadData = async () => {
        const storedBalance = await cloudStorage.getItem('user_balance');
        if (storedBalance) setBalance(parseFloat(storedBalance));

        const storedTransactions = await cloudStorage.getItem('user_transactions');
        if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    };
    loadData();

  }, []);

  // Notification Timer Effect (Lifted to App)
  useEffect(() => {
      if (activeNumbersCount === 0) {
          const timer = setTimeout(() => {
              setHasUnreadNotification(true);
          }, 9000); // 9 seconds exact

          return () => clearTimeout(timer);
      }
  }, [activeNumbersCount]);

  const handleBellClick = () => {
      setHasUnreadNotification(false);
      setShowNotificationModal(true);
  };

  const closeNotificationModal = () => {
      setShowNotificationModal(false);
  };

  const handleAcquireClick = () => {
      setShowNotificationModal(false);
      // If we are not on home, go to home, then scroll
      if (activeTab !== 'home') {
          setActiveTab('home');
          // Wait for render then scroll
          setTimeout(() => {
               document.getElementById('service-selector')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
      } else {
           document.getElementById('service-selector')?.scrollIntoView({ behavior: 'smooth' });
      }
  };

  const handleSupportClick = () => {
    const supportUrl = "https://t.me/SMSVirtualBR_suporte";
    // Check if running inside Telegram
    // @ts-ignore
    if (window.Telegram?.WebApp?.openTelegramLink) {
        // @ts-ignore
        window.Telegram.WebApp.openTelegramLink(supportUrl);
    } else {
        // Fallback for browser testing
        window.open(supportUrl, '_blank');
    }
  };

  const updateBalance = async (newBalance: number) => {
      setBalance(newBalance);
      await cloudStorage.setItem('user_balance', newBalance.toString());
  };

  const addTransaction = async (transaction: Transaction) => {
      const newTransactions = [transaction, ...transactions];
      setTransactions(newTransactions);
      await cloudStorage.setItem('user_transactions', JSON.stringify(newTransactions));
  };

  const handleDeposit = (amount: number) => {
      const newBalance = balance + amount;
      updateBalance(newBalance);
      addTransaction({
          id: Date.now().toString(),
          type: 'deposit',
          amount: amount,
          date: new Date().toLocaleDateString('pt-BR'),
          status: 'completed',
          description: 'Depósito via Pix'
      });
  };

  const handlePurchase = (service: Service) => {
      if (balance >= service.price) {
          const newBalance = balance - service.price;
          updateBalance(newBalance);
          addTransaction({
              id: Date.now().toString(),
              type: 'purchase',
              amount: service.price,
              date: new Date().toLocaleDateString('pt-BR'),
              status: 'completed',
              description: `Número ${service.name}`
          });
          setActiveTab('mynumbers');
      } else {
          // Trigger Haptic Feedback (Vibration)
          if (window.Telegram?.WebApp?.HapticFeedback) {
             window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
          }
          
          // Show alert or redirect to wallet
          alert("Saldo insuficiente! Por favor, faça uma recarga.");
          setActiveTab('balance');
      }
  };

  const renderContent = () => {
      if (showFAQ) return <FAQView onClose={() => setShowFAQ(false)} />;
      if (showTerms) return <TermsView onClose={() => setShowTerms(false)} />;

      switch (activeTab) {
          case 'home':
              return <HomeView user={user} setTab={setActiveTab} transactions={transactions} currentBalance={balance} activeNumbersCount={activeNumbersCount} />;
          case 'services':
              return <ServicesView onPurchase={handlePurchase} />;
          case 'mynumbers':
              return <MyNumbersView transactions={transactions} />;
          case 'orders':
              return <OrdersView transactions={transactions} />;
          case 'profile':
              return <ProfileView user={user} onOpenSupport={handleSupportClick} onOpenTerms={() => setShowTerms(true)} onOpenFAQ={() => setShowFAQ(true)} />;
          case 'balance':
              return <BalanceView onDeposit={handleDeposit} currentBalance={balance} />;
          default:
              return <HomeView user={user} setTab={setActiveTab} transactions={transactions} currentBalance={balance} activeNumbersCount={activeNumbersCount} />;
      }
  };

  // Determine if header should be shown
  // Visible on: Home, Services, MyNumbers, Orders
  // Hidden on: Profile, Balance, Support/Terms/FAQ Modals
  const showHeader = ['home', 'services', 'mynumbers', 'orders'].includes(activeTab) && !showTerms && !showFAQ;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 selection:bg-blue-100 pb-safe">
      <div className="max-w-md mx-auto min-h-screen relative bg-slate-50/50 shadow-2xl">
        
        {/* GLOBAL HEADER */}
        {showHeader && (
            <AppHeader 
                user={user} 
                currentBalance={balance} 
                setTab={setActiveTab} 
                hasUnreadNotification={hasUnreadNotification} 
                handleBellClick={handleBellClick}
                activeTab={activeTab}
            />
        )}

        {/* NOTIFICATION MODAL (Telegram Message Style) */}
        {showNotificationModal && (
          <div className="fixed inset-0 z-[60] flex flex-col justify-end pb-[6.5rem] px-4">
              <div 
                  className="absolute inset-0 bg-black/20 backdrop-blur-[1px] animate-fadeIn" 
                  onClick={closeNotificationModal}
              ></div>
              
              {/* Telegram Message Lookalike */}
              <div className="relative z-10 flex items-end gap-2 animate-slideUp">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 mb-1 shadow-sm">
                      <Smartphone size={18} strokeWidth={2.5} />
                  </div>
                  
                  {/* Bubble */}
                  <div className="bg-white rounded-2xl rounded-bl-none p-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.1),0_10px_20px_-2px_rgba(0,0,0,0.04)] max-w-[85%] relative">
                      {/* Tail SVG */}
                      <svg className="absolute -bottom-[0px] -left-[9px] w-[10px] h-[20px] fill-white" viewBox="0 0 10 20">
                          <path d="M10,0 L10,20 L0,20 C0,20 8,20 8,10 C8,0 10,0 10,0 Z" />
                      </svg>

                      <div className="flex justify-between items-baseline mb-1 gap-4">
                          <span className="text-[#3b82f6] font-bold text-xs">𝗦𝗠𝗦 𝗩𝗜𝗥𝗧𝗨𝗔𝗟 𝗕𝗥</span>
                          <span className="text-slate-400 text-[10px]">agora</span>
                      </div>
                      <p className="text-sm text-slate-800 leading-snug">
                         Você ainda não tem nenhum número. Compre agora para receber SMS!
                      </p>
                      
                      {/* Button inside bubble */}
                      <button 
                          onClick={handleAcquireClick} 
                          className="mt-3 w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                          Adquirir Número <ArrowUpRight size={14} />
                      </button>
                  </div>
              </div>
          </div>
        )}

        {renderContent()}
        {!showTerms && !showFAQ && <BottomNav activeTab={activeTab} setTab={setActiveTab} />}
      </div>
    </div>
  );
};