import React, { useState, useEffect } from 'react';
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
  Bell
} from 'lucide-react';
import { initTelegramApp, getTelegramUser } from './services/telegramService';
import { TelegramUser, Service, Transaction } from './types';

// --- MOCK DATA ---
const SERVICES: Service[] = [
  { id: '1', name: 'WhatsApp', price: 3.50, icon: 'bg-[#25D366]', isHot: true },
  { id: '2', name: 'Telegram', price: 4.20, icon: 'bg-[#0088cc]' },
  { id: '3', name: 'Google/Gmail', price: 2.10, icon: 'bg-[#EA4335]' },
  { id: '4', name: 'Instagram', price: 1.10, icon: 'bg-gradient-to-tr from-yellow-400 to-purple-600' },
  { id: '5', name: 'Uber', price: 1.20, icon: 'bg-black' },
  { id: '6', name: 'iFood', price: 1.50, icon: 'bg-[#EA1D2C]' },
  { id: '7', name: 'TikTok', price: 1.00, icon: 'bg-black' },
];

const TRANSACTIONS: Transaction[] = [
  { id: 'tx_1', type: 'deposit', amount: 50.00, date: '2023-10-25 14:30', status: 'completed', description: 'Pix Deposit' },
  { id: 'tx_2', type: 'purchase', amount: -3.50, date: '2023-10-24 09:15', status: 'completed', description: 'WhatsApp Number' },
];

// --- COMPONENTS ---

// 1. Navigation Bar
const BottomNav = ({ activeTab, setTab }: { activeTab: string, setTab: (t: string) => void }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'services', icon: ShoppingCart, label: 'Serviços' },
    { id: 'balance', icon: Wallet, label: 'Saldo' },
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

const HomeView = ({ user, setTab }: { user: TelegramUser | null, setTab: (t: string) => void }) => {
  const photoUrl = user?.photo_url;

  return (
    <div className="space-y-6 pb-28 pt-4">
      
      {/* HEADER: Foto Esquerda + Saudação + Notificação */}
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
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 active:bg-slate-50">
            <Bell size={20} />
        </button>
      </div>

      {/* BANK STYLE BALANCE CARD (FULL WIDTH) */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-200/50 relative overflow-hidden group">
             {/* Decorative elements */}
             <div className="absolute -right-12 -top-12 bg-white/10 w-48 h-48 rounded-full blur-3xl group-hover:bg-white/15 transition-colors"></div>
             <div className="absolute -left-10 -bottom-10 bg-black/10 w-32 h-32 rounded-full blur-2xl"></div>
             
             <div className="relative z-10 flex flex-col items-start gap-1">
                <div className="flex items-center justify-between w-full mb-2">
                    <p className="text-blue-100 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <Wallet size={14} className="text-blue-200"/> Saldo Disponível
                    </p>
                </div>
                
                <h2 className="text-[2.5rem] leading-none font-extrabold tracking-tight mb-6">
                    R$ 0<span className="text-2xl text-blue-200/80 font-bold">,00</span>
                </h2>
                
                <div className="w-full">
                    <button 
                        onClick={() => setTab('balance')}
                        className="w-full bg-white/20 hover:bg-white/25 active:bg-white/30 backdrop-blur-md border border-white/10 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/10"
                    >
                        <Plus size={18} strokeWidth={3} />
                        Adicionar Dinheiro
                    </button>
                </div>
             </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 gap-4">
         {/* Active Numbers */}
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center gap-1 active:scale-[0.98] transition-transform cursor-default">
             <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1">
                 <Smartphone size={22} strokeWidth={2.5} />
             </div>
             <span className="text-2xl font-extrabold text-slate-800 block">0</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Números Ativos</span>
         </div>

         {/* SMS Received */}
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center gap-1 active:scale-[0.98] transition-transform cursor-default">
             <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                 <MessageSquare size={22} strokeWidth={2.5} />
             </div>
             <span className="text-2xl font-extrabold text-slate-800 block">0</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">SMS Hoje</span>
         </div>
      </div>

      {/* SERVICE SELECTOR SECTION */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-5">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <ShoppingCart size={16} className="text-blue-500"/>
            Nova Ativação
        </h3>

        {/* Country */}
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block ml-1">País</label>
            <button className="w-full flex items-center justify-between p-3.5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 transition-colors group">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl drop-shadow-sm leading-none grayscale group-hover:grayscale-0 transition-all">🇧🇷</span>
                    <span className="font-bold text-slate-700 text-sm">BRASIL (BR)</span>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
            </button>
        </div>

        {/* Service */}
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block ml-1">Serviço</label>
            
            <div className="border border-slate-200 rounded-xl overflow-hidden p-1 bg-white">
                {/* Search Input */}
                <div className="relative mb-2">
                    <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Buscar serviço..." 
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-transparent focus:bg-white bg-slate-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm placeholder:text-slate-400 font-medium"
                    />
                </div>

                {/* Services List Preview */}
                <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                    {SERVICES.slice(0, 5).map(service => (
                        <div key={service.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group border border-transparent hover:border-slate-100">
                            <div className="flex items-center space-x-3">
                                <div className={`w-9 h-9 rounded-full ${service.icon} flex items-center justify-center text-white text-[11px] font-bold shadow-sm ring-1 ring-black/5`}>
                                    {service.name[0]}
                                </div>
                                <span className="font-bold text-slate-700 text-sm group-hover:text-slate-900">{service.name}</span>
                                {service.isHot && <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md font-bold">HOT</span>}
                            </div>
                            <span className="font-extrabold text-slate-700 text-sm bg-slate-100 px-2 py-1 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">R$ {service.price.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

const ServicesView = () => (
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
                        <div className={`w-10 h-10 rounded-full ${service.icon} flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-white`}>
                            {service.name.substring(0, 1)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-bold text-slate-800 text-sm">{service.name}</p>
                                {service.isHot && <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">HOT</span>}
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium">Disponível: Alta</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                         <p className="font-bold text-blue-600">R$ {service.price.toFixed(2)}</p>
                         <button className="bg-blue-600 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold shadow-md shadow-blue-200 active:bg-blue-700 uppercase tracking-wide">
                             Comprar
                         </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const BalanceView = () => {
    const [amount, setAmount] = useState<number>(0);
    const presets = [5, 10, 20, 30, 50, 100];

    return (
        <div className="pb-28 space-y-4 pt-4">
             <h2 className="text-xl font-bold text-slate-800 px-1">Carteira</h2>
             <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                <h2 className="font-bold text-slate-800 mb-6 text-center text-lg">Quanto você quer recarregar?</h2>
                
                <div className="relative mb-6">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">R$</span>
                    <input 
                        type="number" 
                        value={amount > 0 ? amount : ''}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="0,00"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 text-3xl font-bold text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-center bg-slate-50 focus:bg-white transition-colors"
                    />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                    {presets.map(val => (
                        <button 
                            key={val}
                            onClick={() => setAmount(val)}
                            className={`py-3.5 rounded-xl border font-bold text-sm transition-all active:scale-95 ${
                                amount === val 
                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                        >
                            R$ {val}
                        </button>
                    ))}
                </div>

                <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-6 text-xs text-green-800">
                    <p className="flex items-center gap-2 mb-2 font-semibold">
                        <CheckCircle2 size={16} className="text-green-600"/> 
                        Pagamento via Pix Instantâneo
                    </p>
                    <p className="flex items-center gap-2 font-semibold">
                        <CheckCircle2 size={16} className="text-green-600"/> 
                        Aprovação em segundos
                    </p>
                </div>

                <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    <Smartphone size={20} />
                    Gerar Pix Copia e Cola
                </button>
             </div>
        </div>
    );
}

const OrdersView = () => (
    <div className="pb-28 space-y-4 pt-4">
        <h2 className="text-xl font-bold text-slate-800 px-1">Meus Pedidos</h2>
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100">
             <div className="flex items-center justify-between mb-5">
                 <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Transações Recentes</h2>
                 <button className="text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1 rounded-full">Filtrar</button>
             </div>

             <div className="space-y-4">
                 {TRANSACTIONS.length > 0 ? TRANSACTIONS.map(tx => (
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
                             <p className="text-[10px] text-slate-400 font-medium capitalize bg-slate-100 px-1.5 py-0.5 rounded inline-block mt-1">
                                {tx.status === 'completed' ? 'Concluído' : tx.status}
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
            {/* User Info Card */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center space-x-5">
                <div className="relative">
                    {photoUrl ? (
                         <img 
                            src={photoUrl} 
                            alt="Profile" 
                            className="w-16 h-16 rounded-full object-cover shadow-lg shadow-blue-200 border-4 border-slate-50"
                        />
                    ) : (
                        // Boneco Genérico
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl font-bold shadow-lg shadow-slate-100 border-4 border-white">
                            <User size={32} />
                        </div>
                    )}
                </div>
                
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-blue-600 uppercase mb-1 tracking-wider bg-blue-50 inline-block px-2 py-0.5 rounded-md">Conta Telegram</p>
                    <h2 className="font-bold text-xl text-slate-800 truncate">
                        {user?.first_name || 'Usuário'} {user?.last_name || ''}
                    </h2>
                    <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                        <span className="text-blue-500 font-bold">@</span>
                        {user?.username ? user.username : 'usuario_anonimo'}
                    </p>
                </div>
            </div>

            {/* Menu List */}
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

            <div className="text-center pt-6">
                <p className="text-[10px] text-slate-400 font-medium">Ativa SMS v2.0</p>
            </div>
        </div>
    );
};

// --- MAIN APP ---
export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    // Initialize Telegram Web App
    initTelegramApp();
    
    // Fetch User Data
    const telegramUser = getTelegramUser();
    setUser(telegramUser);
    
    // Handle back button on mobile (Android)
    if (window.Telegram?.WebApp?.BackButton) {
        const handleBack = () => setActiveTab('home');

        if (activeTab !== 'home') {
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.BackButton.onClick(handleBack);
        } else {
            window.Telegram.WebApp.BackButton.hide();
        }

        return () => {
             // Cleanup listener
             if(window.Telegram?.WebApp?.BackButton?.offClick) {
                 window.Telegram.WebApp.BackButton.offClick(handleBack);
             }
        }
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeView user={user} setTab={setActiveTab} />;
      case 'services': return <ServicesView />;
      case 'balance': return <BalanceView />;
      case 'orders': return <OrdersView />;
      case 'profile': return <ProfileView user={user} />;
      default: return <HomeView user={user} setTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-900 font-sans selection:bg-blue-100">
      <main className="max-w-md mx-auto p-4 animate-fadeIn">
        {renderContent()}
      </main>
      <BottomNav activeTab={activeTab} setTab={setActiveTab} />
    </div>
  );
}