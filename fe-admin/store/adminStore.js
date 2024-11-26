import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const useAdminStore = create(persist(
    (set) => ({
        isLoggedIn: false,
        adminInfo: null,
        role_id: null,  // Lưu role_id riêng
        setAdminLogin: (adminInfo) => set({ 
            isLoggedIn: true, 
            adminInfo: adminInfo,
            role_id: adminInfo.role_id  // Lưu role_id từ adminInfo
        }),
        setAdminLogout: () => set({ 
            isLoggedIn: false, 
            adminInfo: null, 
            role_id: null  // Reset role_id khi đăng xuất
        })
    }),
    {
        name: 'admin-storage',
        storage: createJSONStorage(() => localStorage),
    }
));

export default useAdminStore;