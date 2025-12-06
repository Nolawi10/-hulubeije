import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { getTranslation } from '@/lib/i18n';
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
  ChevronRight
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
            <div className="w-11 h-11 rounded-xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary-foreground">TenaBiz AI</h1>
              <p className="text-sm text-primary-foreground/80 font-ethiopic">
                {businessName || t('appTagline')}
              </p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <button className="w-10 h-10 rounded-xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary-foreground" />
            </button>
            <Link to="/settings" className="w-10 h-10 rounded-xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center">
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
