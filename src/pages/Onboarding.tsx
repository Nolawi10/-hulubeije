import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { languages, getTranslation, Language } from '@/lib/i18n';
import { useAppStore } from '@/store/appStore';
import { Check, ChevronRight, Store, UtensilsCrossed, ShoppingBag, Wrench, Factory, Wheat, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const businessTypes = [
  { id: 'retail', icon: Store, color: 'from-primary/20 to-primary/5' },
  { id: 'restaurant', icon: UtensilsCrossed, color: 'from-secondary/30 to-secondary/10' },
  { id: 'online', icon: ShoppingBag, color: 'from-accent/20 to-accent/5' },
  { id: 'service', icon: Wrench, color: 'from-primary/20 to-primary/5' },
  { id: 'manufacturer', icon: Factory, color: 'from-secondary/30 to-secondary/10' },
  { id: 'agriculture', icon: Wheat, color: 'from-accent/20 to-accent/5' },
];

const businessTypeKeys: Record<string, string> = {
  retail: 'retailShop',
  restaurant: 'restaurant',
  online: 'onlineSeller',
  service: 'serviceProvider',
  manufacturer: 'manufacturer',
  agriculture: 'agriculture',
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { language, setLanguage, setBusinessType, setOnboarded } = useAppStore();
  const [step, setStep] = useState(0);
  const [selectedBusiness, setSelectedBusiness] = useState('');

  const t = (key: string) => getTranslation(language, key);

  const handleComplete = () => {
    setBusinessType(selectedBusiness);
    setOnboarded(true);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="safe-top px-6 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">TenaBiz AI</h1>
            <p className="text-sm text-muted-foreground font-ethiopic">{t('appTagline')}</p>
          </div>
        </motion.div>
      </div>

      {/* Progress indicator */}
      <div className="px-6 py-4">
        <div className="flex gap-2">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className={`h-1.5 rounded-full flex-1 ${
                i <= step ? 'bg-primary' : 'bg-muted'
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="language"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center pt-4">
                <h2 className="text-2xl font-bold text-foreground mb-2">{t('welcome')}</h2>
                <p className="text-muted-foreground">{t('selectLanguage')}</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {languages.map((lang, index) => (
                  <motion.button
                    key={lang.code}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full p-4 rounded-lg flex items-center justify-between transition-all ${
                      language === lang.code
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-card border-2 border-transparent shadow-soft hover:shadow-medium'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{lang.flag}</span>
                      <div className="text-left">
                        <p className="font-semibold text-foreground">{lang.name}</p>
                        <p className="text-sm text-muted-foreground font-ethiopic">{lang.nativeName}</p>
                      </div>
                    </div>
                    {language === lang.code && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="business"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center pt-4">
                <h2 className="text-2xl font-bold text-foreground mb-2 font-ethiopic">
                  {t('selectBusinessType')}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {businessTypes.map((type, index) => {
                  const Icon = type.icon;
                  return (
                    <motion.button
                      key={type.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedBusiness(type.id)}
                      className={`p-5 rounded-lg flex flex-col items-center gap-3 transition-all ${
                        selectedBusiness === type.id
                          ? 'bg-primary/10 border-2 border-primary'
                          : 'bg-card border-2 border-transparent shadow-soft hover:shadow-medium'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                        <Icon className={`w-7 h-7 ${
                          selectedBusiness === type.id ? 'text-primary' : 'text-foreground/70'
                        }`} />
                      </div>
                      <span className={`text-sm font-medium text-center font-ethiopic ${
                        selectedBusiness === type.id ? 'text-primary' : 'text-foreground'
                      }`}>
                        {t(businessTypeKeys[type.id])}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer buttons */}
      <div className="p-6 safe-bottom bg-background border-t border-border">
        <div className="flex gap-3">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1 h-14 text-base font-semibold rounded-xl"
            >
              {t('back')}
            </Button>
          )}
          <Button
            onClick={() => (step === 1 ? handleComplete() : setStep(step + 1))}
            disabled={step === 1 && !selectedBusiness}
            className="flex-1 h-14 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90"
          >
            {step === 1 ? t('getStarted') : t('next')}
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
