
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
            // CloudStorage is only available in Telegram Web Apps version 6.9+
            // Check if isVersionAtLeast exists (it might not in very old versions) and check version
            const supportsCloudStorage = tg && 
                                         tg.isVersionAtLeast && 
                                         tg.isVersionAtLeast('6.9') && 
                                         tg.CloudStorage;

            if (supportsCloudStorage) {
                tg.CloudStorage.setItem(key, value, (error, stored) => {
                    if (error) {
                        console.error("CloudStorage Error:", error);
                        // Fallback to local storage on error
                        try {
                            localStorage.setItem(key, value);
                            resolve(true);
                        } catch (e) {
                            resolve(false);
                        }
                    } else {
                        resolve(stored);
                    }
                });
            } else {
                // Fallback LocalStorage for older versions (like 6.0) or web browsers
                try {
                    localStorage.setItem(key, value);
                    resolve(true);
                } catch (e) {
                    console.error("LocalStorage Error:", e);
                    resolve(true); // Treat as success to not block flow
                }
            }
        });
    },

    getItem: async (key: string): Promise<string | null> => {
        return new Promise((resolve) => {
            // CloudStorage is only available in Telegram Web Apps version 6.9+
            const supportsCloudStorage = tg && 
                                         tg.isVersionAtLeast && 
                                         tg.isVersionAtLeast('6.9') && 
                                         tg.CloudStorage;

            if (supportsCloudStorage) {
                tg.CloudStorage.getItem(key, (error, value) => {
                    if (error) {
                        console.error("CloudStorage Error:", error);
                         // Fallback to local storage on error
                        try {
                            const val = localStorage.getItem(key);
                            resolve(val);
                        } catch (e) {
                            resolve(null);
                        }
                    } else {
                        resolve(value);
                    }
                });
            } else {
                // Fallback LocalStorage for older versions (like 6.0) or web browsers
                try {
                    const val = localStorage.getItem(key);
                    resolve(val);
                } catch (e) {
                    console.error("LocalStorage Error:", e);
                    resolve(null);
                }
            }
        });
    }
};