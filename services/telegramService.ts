import { TelegramUser } from '../types';

const tg = window.Telegram?.WebApp;

export const initTelegramApp = () => {
    if (tg) {
        tg.ready();
        tg.expand();
        // Set header color to match app
        try {
            // @ts-ignore
            if(tg.setHeaderColor) tg.setHeaderColor('#2563eb'); // blue-600
        } catch (e) {
            console.error(e);
        }
    }
};

export const getTelegramUser = (): TelegramUser | null => {
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        return tg.initDataUnsafe.user;
    }
    
    // Fallback for development outside Telegram
    if (process.env.NODE_ENV === 'development') {
        return {
            id: 987654321,
            first_name: "João",
            last_name: "Silva",
            username: "João36_",
            language_code: "pt-br",
            is_premium: true,
            photo_url: "https://ui-avatars.com/api/?name=Joao+Silva&background=0D8ABC&color=fff"
        };
    }

    return null;
};

export const closeApp = () => {
    if (tg) {
        tg.close();
    }
};