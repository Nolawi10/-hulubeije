import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { getTranslation } from '@/lib/i18n';
import { api } from '@/services/api';
import { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Megaphone, 
  BarChart3, 
  Camera, 
  Mic, 
  GraduationCap, 
  TrendingUp,
  Lightbulb,
  Bell,
  Settings,
  ChevronRight,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import LanguageSelector from '@/components/LanguageSelector';

const features = [
  { id: 'marketing', icon: Megaphone, colorClass: 'icon-container-primary', path: '/marketing' },
  { id: 'sales', icon: BarChart3, colorClass: 'icon-container-secondary', path: '/sales' },
  { id: 'visual', icon: Camera, colorClass: 'icon-container-accent', path: '/visual' },
  { id: 'voice', icon: Mic, colorClass: 'icon-container-primary', path: '/voice' },
  { id: 'learn', icon: GraduationCap, colorClass: 'icon-container-secondary', path: '/learn' },
  { id: 'price', icon: TrendingUp, colorClass: 'icon-container-accent', path: '/price' },
];

const featureKeys: Record<string, string> = {
  marketing: 'aiMarketing',
  sales: 'salesInventory',
  visual: 'visualStudio',
  voice: 'voiceMode',
  learn: 'learningHub',
  price: 'priceChecker',
};

export default function Dashboard() {
  const { language, businessName, sales } = useAppStore();
  const t = (key: string) => getTranslation(language, key);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkApi = async () => {
      try {
        await api.health();
        setApiStatus('online');
      } catch {
        setApiStatus('offline');
      }
    };
    checkApi();
  }, []);

  const todaySales = sales.filter(
    (s) => new Date(s.date).toDateString() === new Date().toDateString()
  );
  const todayTotal = todaySales.reduce((acc, s) => acc + s.price * s.quantity, 0);
  const todayProfit = todaySales.reduce((acc, s) => acc + s.profit, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="safe-top bg-gradient-to-br from-primary via-primary to-secondary px-6 pt-6 pb-8 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 backdrop-blur flex items-center justify-center overflow-hidden border border-primary-foreground/20">
                <img 
                  src="/logo.png" 
                  alt="Hulu Be Ije Logo" 
                  className="w-10 h-10 object-contain p-0.5"
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-10 h-10 flex items-center justify-center';
                    fallback.innerHTML = '<span class="text-primary-foreground font-bold">HB</span>';
                    target.parentNode?.insertBefore(fallback, target.nextSibling);
                  }}
                />
              </div>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-primary-foreground">Hulu Be Ije</h1>
              <p className="text-sm text-primary-foreground/80 font-ethiopic">
                ሁሉ በእጄ | {businessName || t('appTagline')}
              </p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary-foreground/20 backdrop-blur">
              {apiStatus === 'checking' && (
                <>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-primary-foreground">Checking...</span>
                </>
              )}
              {apiStatus === 'online' && (
                <>
                  <Wifi className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-primary-foreground">Online</span>
                </>
              )}
              {apiStatus === 'offline' && (
                <>
                  <WifiOff className="w-3 h-3 text-red-400" />
                  <span className="text-xs text-primary-foreground">Offline</span>
                </>
              )}
            </div>
            <LanguageSelector />
            <Link to="/notifications" className="w-10 h-10 rounded-xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center hover:bg-primary-foreground/30 transition-colors">
              <Bell className="w-5 h-5 text-primary-foreground" />
            </Link>
            <Link to="/settings" className="w-10 h-10 rounded-xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center hover:bg-primary-foreground/30 transition-colors">
              <Settings className="w-5 h-5 text-primary-foreground" />
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="bg-primary-foreground/20 backdrop-blur rounded-2xl p-4">
            <p className="text-sm text-primary-foreground/80 font-ethiopic">{t('today')} {t('sales')}</p>
            <p className="text-2xl font-bold text-primary-foreground mt-1">
              {todayTotal.toLocaleString()} <span className="text-sm font-normal">ETB</span>
            </p>
          </div>
          <div className="bg-primary-foreground/20 backdrop-blur rounded-2xl p-4">
            <p className="text-sm text-primary-foreground/80 font-ethiopic">{t('today')} Profit</p>
            <p className="text-2xl font-bold text-primary-foreground mt-1">
              {todayProfit.toLocaleString()} <span className="text-sm font-normal">ETB</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-4">
        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 stagger-animation"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.id}
                to={feature.path}
                className="feature-tile"
              >
                <div className={`icon-container ${feature.colorClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-foreground text-center font-ethiopic leading-tight">
                  {t(featureKeys[feature.id])}
                </span>
              </Link>
            );
          })}
        </motion.div>

        {/* Business Ideas Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Link
            to="/ideas"
            className="block bg-gradient-to-r from-accent to-accent/80 rounded-2xl p-5 shadow-medium"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-foreground/20 flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-accent-foreground font-ethiopic">
                    {t('businessIdeas')}
                  </h3>
                  <p className="text-sm text-accent-foreground/80">
                    Get AI-powered business ideas
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-accent-foreground" />
            </div>
          </Link>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-3 font-ethiopic">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              to="/marketing/caption"
              className="card-elevated flex items-center gap-4"
            >
              <div className="icon-container icon-container-primary">
                <Megaphone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground font-ethiopic">
                  {t('captionGenerator')}
                </h3>
                <p className="text-sm text-muted-foreground">Create engaging captions for your posts</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>

            <Link
              to="/sales/add"
              className="card-elevated flex items-center gap-4"
            >
              <div className="icon-container icon-container-secondary">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground font-ethiopic">
                  Log Sale
                </h3>
                <p className="text-sm text-muted-foreground">Record a new sale quickly</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
