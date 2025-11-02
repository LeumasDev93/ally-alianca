"use client";

import { MailOpen, MessageSquare } from "lucide-react";

interface FooterMenuProps {
  activeMenu: 'messages' | 'home';
  onMenuChange: (menu: 'messages' | 'home') => void;
}

export default function FooterMenu({ activeMenu, onMenuChange }: FooterMenuProps) {
  return (
    <div className={`border-t ${activeMenu === 'home' ? 'border-white/20' : 'border-gray-200 dark:border-gray-700'} ${activeMenu === 'messages' ? 'bg-white dark:bg-gray-800' : ''}`}>
      <div className="flex items-center justify-around p-3 sm:p-4">
        {/* Home Menu */}
        <button
          onClick={() => onMenuChange('home')}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all duration-300 ${
            activeMenu === 'home'
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          } ${activeMenu === 'home' && 'text-white'}`}
        >
          <MailOpen strokeWidth={3} />
          <span className="text-xs sm:text-sm font-medium">Inicio</span>
        </button>

        {/* Messages Menu */}
        <button
          onClick={() => onMenuChange('messages')}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all duration-300 ${
            activeMenu === 'messages'
              ? 'bg-gradient-to-r from-blue-800 to-red-800 text-white shadow-lg'
              : activeMenu === 'home'
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <MessageSquare strokeWidth={3} />
          <span className="text-xs sm:text-sm font-medium">Mensagens</span>
        </button>
      </div>
    </div>
  );
}

