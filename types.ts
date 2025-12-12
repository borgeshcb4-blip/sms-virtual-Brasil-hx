
// Telegram Web App Types (Simplified)
export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    photo_url?: string;
}

export interface TelegramWebApp {
    initData: string;
    initDataUnsafe: {
        query_id?: string;
        user?: TelegramUser;
        auth_date?: string;
        hash?: string;
    };
    version: string;
    platform: string;
    colorScheme: 'light' | 'dark';
    themeParams: {
        bg_color?: string;
        text_color?: string;
        hint_color?: string;
        link_color?: string;
        button_color?: string;
        button_text_color?: string;
    };
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    expand: () => void;
    close: () => void;
    ready: () => void;
    // Added optional method to fix TS error in telegramService.ts
    isVersionAtLeast?: (version: string) => boolean;
    MainButton: {
        text: string;
        color: string;
        textColor: string;
        isVisible: boolean;
        isActive: boolean;
        show: () => void;
        hide: () => void;
        onClick: (callback: () => void) => void;
    };
    BackButton: {
        isVisible: boolean;
        show: () => void;
        hide: () => void;
        onClick: (callback: () => void) => void;
        offClick: (callback: () => void) => void;
    };
    CloudStorage: {
        setItem: (key: string, value: string, callback?: (err: any, stored: boolean) => void) => void;
        getItem: (key: string, callback?: (err: any, value: string) => void) => void;
        getItems: (keys: string[], callback?: (err: any, values: any) => void) => void;
        removeItem: (key: string, callback?: (err: any, stored: boolean) => void) => void;
        getKeys: (callback?: (err: any, keys: string[]) => void) => void;
    };
    HapticFeedback: {
        notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
        impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
        selectionChanged: () => void;
    };
    setHeaderColor?: (color: string) => void;
}

declare global {
    interface Window {
        Telegram: {
            WebApp: TelegramWebApp;
        };
    }
}

export interface Service {
    id: string;
    name: string;
    price: number;
    icon: string;
    logoUrl?: string; // URL da imagem da logo
    isHot?: boolean;
    isNew?: boolean;
    stock?: number;
}

export interface Transaction {
    id: string;
    type: 'deposit' | 'purchase';
    amount: number;
    date: string;
    status: 'completed' | 'pending' | 'failed';
    description: string;
}