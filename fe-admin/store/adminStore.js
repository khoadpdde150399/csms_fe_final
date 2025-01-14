import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const useAdminStore = create(persist(
    (set) => ({
        isLoggedIn: false,
        adminInfo: null,
        role_id: null,  // Lưu role_id riêng
        admin_id:null,
        setAdminLogin: (adminInfo) => set({ 
            isLoggedIn: true, 
            adminInfo: adminInfo,
            role_id: adminInfo.role_id,  // Lưu role_id từ adminInfo
            admin_id: adminInfo.admin_id
        }),
        setAdminLogout: () => set({ 
            isLoggedIn: false, 
            adminInfo: null, 
            role_id: null,  // Reset role_id khi đăng xuất
            admin_id: null
        })
    }),
    {
        name: 'admin-storage',
        storage: createJSONStorage(() => localStorage),
    }
));

export default useAdminStore;