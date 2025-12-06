import { Link, useLocation } from 'react-router-dom';
import { Home, Megaphone, BarChart3, GraduationCap, User } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { getTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/dashboard', icon: Home, labelKey: 'home' },
  { path: '/marketing', icon: Megaphone, labelKey: 'marketing' },
  { path: '/sales', icon: BarChart3, labelKey: 'sales' },
  { path: '/learn', icon: GraduationCap, labelKey: 'learn' },
  { path: '/profile', icon: User, labelKey: 'profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(language, key);

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 py-2 px-3 min-w-[64px] relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-2 w-12 h-1 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon 
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`} 
              />
              <span 
                className={`text-xs font-medium font-ethiopic transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
