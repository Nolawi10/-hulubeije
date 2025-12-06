import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { getTranslation, languages } from '@/lib/i18n';
import { 
  ArrowLeft, 
  User,
  Settings,
  ChevronRight,
  LogOut,
  Bell,
  Globe,
  Shield,
  HelpCircle,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';

const menuItems = [
  { id: 'notifications', icon: Bell, label: { am: 'ማሳወቂያዎች', en: 'Notifications' } },
  { id: 'language', icon: Globe, label: { am: 'ቋንቋ', en: 'Language' } },
  { id: 'privacy', icon: Shield, label: { am: 'ግላዊነት', en: 'Privacy' } },
  { id: 'help', icon: HelpCircle, label: { am: 'እገዛ', en: 'Help & Support' } },
  { id: 'rate', icon: Star, label: { am: 'ደረጃ ስጡ', en: 'Rate Us' } },
];

export default function Profile() {
  const navigate = useNavigate();
  const { language, businessName, businessType, setOnboarded } = useAppStore();
  const t = (key: string) => getTranslation(language, key);

  const currentLang = languages.find((l) => l.code === language);

  const handleLogout = () => {
    setOnboarded(false);
    navigate('/');
  };

  const businessTypeLabels: Record<string, string> = {
    retail: language === 'am' ? 'ችርቻሮ ሱቅ' : 'Retail Shop',
    restaurant: language === 'am' ? 'ምግብ ቤት' : 'Restaurant',
    online: language === 'am' ? 'የመስመር ላይ ሻጭ' : 'Online Seller',
    service: language === 'am' ? 'አገልግሎት ሰጪ' : 'Service Provider',
    manufacturer: language === 'am' ? 'አምራች' : 'Manufacturer',
    agriculture: language === 'am' ? 'ግብርና' : 'Agriculture',
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="safe-top bg-gradient-to-br from-primary to-primary/90 px-6 pt-6 pb-10 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </button>
          <button className="w-10 h-10 rounded-xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center">
            <User className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary-foreground">
              {businessName || 'My Business'}
            </h1>
            <p className="text-sm text-primary-foreground/80">
              {businessTypeLabels[businessType] || 'Business Owner'}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg">{currentLang?.flag}</span>
              <span className="text-sm text-primary-foreground/80">{currentLang?.nativeName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 -mt-4 space-y-4">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated grid grid-cols-3 gap-4"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">0</p>
            <p className="text-xs text-muted-foreground">
              {language === 'am' ? 'ሽያጮች' : 'Sales'}
            </p>
          </div>
          <div className="text-center border-x border-border">
            <p className="text-2xl font-bold text-foreground">0</p>
            <p className="text-xs text-muted-foreground">
              {language === 'am' ? 'እቃዎች' : 'Items'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">1</p>
            <p className="text-xs text-muted-foreground">
              {language === 'am' ? 'ኮርስ' : 'Course'}
            </p>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-0 overflow-hidden"
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="flex-1 text-left font-medium text-foreground font-ethiopic">
                  {item.label[language === 'am' ? 'am' : 'en']}
                </span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            );
          })}
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handleLogout}
          className="w-full card-elevated flex items-center gap-4 text-destructive"
        >
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="flex-1 text-left font-medium font-ethiopic">
            {language === 'am' ? 'ውጣ' : 'Log Out'}
          </span>
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}
