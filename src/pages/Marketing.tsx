import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { getTranslation } from '@/lib/i18n';
import { 
  ArrowLeft, 
  Megaphone, 
  Image, 
  FileText, 
  Hash, 
  Quote, 
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';

const tools = [
  { id: 'caption', icon: Megaphone, path: '/marketing/caption', colorClass: 'icon-container-primary' },
  { id: 'poster', icon: Image, path: '/marketing/poster', colorClass: 'icon-container-secondary' },
  { id: 'ad', icon: FileText, path: '/marketing/ad', colorClass: 'icon-container-accent' },
  { id: 'hashtag', icon: Hash, path: '/marketing/hashtag', colorClass: 'icon-container-primary' },
  { id: 'slogan', icon: Quote, path: '/marketing/slogan', colorClass: 'icon-container-secondary' },
  { id: 'calendar', icon: Calendar, path: '/marketing/calendar', colorClass: 'icon-container-accent' },
];

const toolKeys: Record<string, string> = {
  caption: 'captionGenerator',
  poster: 'posterGenerator',
  ad: 'adCopyWriter',
  hashtag: 'hashtagGenerator',
  slogan: 'sloganCreator',
  calendar: 'contentCalendar',
};

export default function Marketing() {
  const navigate = useNavigate();
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(language, key);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="safe-top bg-card border-b border-border px-6 pt-4 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground font-ethiopic">{t('aiMarketing')}</h1>
            <p className="text-sm text-muted-foreground">Create content that sells</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Featured Tool */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to="/marketing/caption"
            className="block bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-5 shadow-glow mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-primary-foreground font-ethiopic">
                  AI {t('captionGenerator')}
                </h3>
                <p className="text-sm text-primary-foreground/80">
                  Generate captions in all 7 languages instantly
                </p>
              </div>
              <ChevronRight className="w-6 h-6 text-primary-foreground" />
            </div>
          </Link>
        </motion.div>

        {/* Tools Grid */}
        <h2 className="text-lg font-semibold text-foreground mb-4 font-ethiopic">
          All Marketing Tools
        </h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={tool.path}
                className="card-elevated flex flex-col items-center gap-3 py-5"
              >
                <div className={`icon-container ${tool.colorClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-foreground text-center font-ethiopic">
                  {t(toolKeys[tool.id])}
                </span>
              </Link>
            );
          })}
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
