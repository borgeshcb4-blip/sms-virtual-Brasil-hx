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
  AlertCircle
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

// 2. Header
const Header = () => (
  <header className="bg-blue-600 text-white pt-4 pb-4 sticky top-0 z-40 shadow-md">
    <div className="flex justify-between items-center max-w-md mx-auto px-4">
      <div className="flex items-center space-x-2.5">
        <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
          <MessageSquare className="text-white" size={20} fill="currentColor" fillOpacity={0.2} />
        </div>
        <div>
           <h1 className="text-lg font-bold tracking-tight leading-none">ATIVA SMS</h1>
           <span className="text-[10px] text-blue-100 font-medium opacity-80">Virtual Numbers</span>
        </div>
      </div>
      <div className="bg-white/10 px-3 py-1.5 rounded-xl text-sm font-bold border border-white/20 flex items-center shadow-sm backdrop-blur-sm">
        R$ 0,00
      </div>
    </div>
  </header>
);

// 3. Views

const HomeView = () => {
  return (
    <div className="space-y-4 pb-28">
      {/* Hero Card */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="font-bold text-slate-800 text-lg">Obtenha um número virtual</h2>
        <p className="text-slate-500 text-sm mt-1 leading-relaxed">
          Escolha seu país, serviço e quantidade. Receba SMS em tempo real.
        </p>
      </div>

      {/* Selection Card */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        
        {/* Country */}
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">País</label>
            <button className="w-full flex items-center justify-between p-3.5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center space-x-3">
                <span className="text-2xl shadow-sm rounded-sm overflow-hidden">🇧🇷</span>
                <span className="font-bold text-slate-700">BRASIL (BR)</span>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
            </button>
        </div>

        {/* Service */}
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Serviço</label>
            
            <div className="border-2 border-blue-100 rounded-xl overflow-hidden p-1">
                <div className="bg-blue-50/50 rounded-lg p-2 mb-2">
                     <p className="text-center text-blue-800 font-bold text-sm">Selecione um serviço</p>
                </div>
                
                {/* Search Input */}
                <div className="relative mb-2 px-1">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Digite para buscar serviço..." 
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-white"
                    />
                </div>

                {/* Services List Preview */}
                <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                    {SERVICES.slice(0, 5).map(service => (
                        <div key={service.id} className="flex items-center justify-between p-2.5 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors group border border-transparent hover:border-blue-100">
                            <div className="flex items-center space-x-3">
                                <div className={`w-7 h-7 rounded-full ${service.icon} flex items-center justify-center text-white text-[10px] font-bold shadow-sm`}>
                                    {service.name[0]}
                                </div>
                                <span className="font-medium text-slate-700 text-sm group-hover:text-blue-700">{service.name}</span>
                                {service.isHot && <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold shadow-sm">HOT</span>}
                            </div>
                            <span className="font-bold text-slate-700 text-sm">R$ {service.price.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Active Activations - Empty State */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-3 rounded-full shadow-sm mb-3">
             <RefreshCw className="text-blue-500 animate-[spin_10s_linear_infinite]" size={24} />
        </div>
        <h3 className="font-bold text-blue-900 text-sm mb-1">Nenhuma ativação ativa</h3>
        <p className="text-blue-600/70 text-xs max-w-[200px]">
            As ativações aparecem aqui por 20 minutos após a criação.
        </p>
      </div>
      
      {/* Recent SMS */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-2 mb-4">
            <Smartphone size={18} className="text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">Últimos SMS recebidos (Hoje)</h3>
        </div>
        <div className="bg-slate-50 p-8 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center group hover:border-blue-200 transition-colors">
             <MessageSquare size={32} className="text-slate-300 mb-2 group-hover:text-blue-300 transition-colors" />
             <p className="font-bold text-slate-600 text-sm mb-1">Nenhum SMS recebido</p>
             <p className="text-xs text-slate-400">Suas mensagens aparecerão aqui automaticamente</p>
        </div>
      </div>
    </div>
  );
};

const ServicesView = () => (
    <div className="pb-28 space-y-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 sticky top-[76px] z-30">
             <div className="relative">
                <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar serviço..." 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-slate-50 transition-all"
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
                         <button className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-md shadow-blue-200 active:bg-blue-700">
                             COMPRAR
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
        <div className="pb-28 space-y-4">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="font-bold text-slate-800 mb-6 text-center text-lg">Quanto você quer recarregar?</h2>
                
                <div className="relative mb-6">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">R$</span>
                    <input 
                        type="number" 
                        value={amount > 0 ? amount : ''}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="0,00"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 text-3xl font-bold text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-center"
                    />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                    {presets.map(val => (
                        <button 
                            key={val}
                            onClick={() => setAmount(val)}
                            className={`py-3 rounded-xl border font-bold text-sm transition-all ${
                                amount === val 
                                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200' 
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

                <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                    <Smartphone size={20} />
                    Gerar Pix Copia e Cola
                </button>
             </div>
        </div>
    );
}

const OrdersView = () => (
    <div className="pb-28 space-y-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex items-center justify-between mb-5">
                 <h2 className="font-bold text-slate-800 text-lg">Histórico</h2>
                 <button className="text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1 rounded-full">Filtrar</button>
             </div>

             <div className="space-y-4">
                 {TRANSACTIONS.length > 0 ? TRANSACTIONS.map(tx => (
                     <div key={tx.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                         <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${tx.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                 {tx.type === 'deposit' ? <Plus size={18} strokeWidth={3}/> : <Minus size={18} strokeWidth={3}/>}
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
    // Se o user.photo_url estiver disponível, o Telegram já forneceu a imagem pública.
    // Se não estiver, exibimos o boneco genérico.
    const photoUrl = user?.photo_url;

    return (
        <div className="pb-28 space-y-4">
            {/* User Info Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-5">
                <div className="relative">
                    {photoUrl ? (
                         <img 
                            src={photoUrl} 
                            alt="Profile" 
                            className="w-16 h-16 rounded-full object-cover shadow-lg shadow-blue-200 border-2 border-white ring-2 ring-blue-50"
                        />
                    ) : (
                        // Boneco Genérico
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl font-bold shadow-lg shadow-slate-100 border-2 border-white ring-2 ring-slate-50">
                            <User size={32} />
                        </div>
                    )}
                </div>
                
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-blue-600 uppercase mb-0.5 tracking-wider">Conta Telegram</p>
                    <h2 className="font-bold text-xl text-slate-800 truncate">
                        {user?.first_name || 'Usuário'} {user?.last_name || ''}
                    </h2>
                    <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                        @{user?.username || 'usuario_anonimo'}
                    </p>
                </div>
            </div>

            {/* Stats Card (Optional but looks good) */}
            <div className="grid grid-cols-2 gap-3">
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                     <p className="text-xs text-slate-400 font-bold uppercase mb-1">Saldo Atual</p>
                     <p className="text-lg font-bold text-blue-600">R$ 0,00</p>
                 </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                     <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total Pedidos</p>
                     <p className="text-lg font-bold text-slate-700">0</p>
                 </div>
            </div>

            {/* Menu List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {[
                    { icon: Wallet, label: "Adicionar Saldo", desc: "Pix Instantâneo" },
                    { icon: ClipboardList, label: "Meus Pedidos", desc: "Histórico completo" },
                    { icon: Globe, label: "Idioma", desc: "Português (BR)" },
                    { icon: AlertCircle, label: "Suporte", desc: "Fale conosco" },
                    { icon: LogOut, label: "Sair", color: "text-red-500", desc: "Desconectar conta" }
                ].map((item, idx) => (
                    <button key={idx} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full ${item.color ? 'bg-red-50' : 'bg-slate-50'} flex items-center justify-center group-hover:scale-110 transition-transform`}>
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
                <p className="text-[10px] text-slate-400 font-medium">Ativa SMS v2.0 • Build 2024</p>
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
      case 'home': return <HomeView />;
      case 'services': return <ServicesView />;
      case 'balance': return <BalanceView />;
      case 'orders': return <OrdersView />;
      case 'profile': return <ProfileView user={user} />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-900 font-sans selection:bg-blue-100">
      <Header />
      <main className="max-w-md mx-auto p-4 animate-fadeIn">
        {renderContent()}
      </main>
      <BottomNav activeTab={activeTab} setTab={setActiveTab} />
    </div>
  );
}