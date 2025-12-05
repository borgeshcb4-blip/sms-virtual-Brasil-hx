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

// --- CLOUD STORAGE HELPERS ---

export const cloudStorage = {
    setItem: async (key: string, value: string): Promise<boolean> => {
        return new Promise((resolve) => {
            if (tg && tg.CloudStorage) {
                tg.CloudStorage.setItem(key, value, (error, stored) => {
                    if (error) {
                        console.error("CloudStorage Error:", error);
                        resolve(false);
                    } else {
                        resolve(stored);
                    }
                });
            } else {
                // Fallback LocalStorage
                localStorage.setItem(key, value);
                resolve(true);
            }
        });
    },

    getItem: async (key: string): Promise<string | null> => {
        return new Promise((resolve) => {
            if (tg && tg.CloudStorage) {
                tg.CloudStorage.getItem(key, (error, value) => {
                    if (error) {
                        console.error("CloudStorage Error:", error);
                        resolve(null);
                    } else {
                        resolve(value);
                    }
                });
            } else {
                // Fallback LocalStorage
                const val = localStorage.getItem(key);
                resolve(val);
            }
        });
    }
};