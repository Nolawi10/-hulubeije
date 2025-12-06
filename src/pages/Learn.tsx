import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { getTranslation } from '@/lib/i18n';
import { 
  ArrowLeft, 
  Play, 
  BookOpen,
  Clock,
  ChevronRight,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';

const lessons = [
  {
    id: 'marketing',
    title: { am: 'ገበያ እና ማስታወቂያ', en: 'Marketing & Advertising' },
    duration: '15 min',
    videos: [
      { title: 'Digital Marketing Basics', url: 'https://www.youtube.com/watch?v=2g8kPzXmyro' },
      { title: 'Social Media Marketing', url: 'https://www.youtube.com/watch?v=O5H4EstdJHc' },
    ],
    color: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary',
  },
  {
    id: 'finance',
    title: { am: 'የገንዘብ አስተዳደር', en: 'Business Finance' },
    duration: '20 min',
    videos: [
      { title: 'Financial Management', url: 'https://www.youtube.com/watch?v=d7cH8nAx2KQ' },
    ],
    color: 'from-secondary/30 to-secondary/10',
    iconColor: 'text-secondary',
  },
  {
    id: 'branding',
    title: { am: 'ብራንዲንግ', en: 'Branding' },
    duration: '12 min',
    videos: [
      { title: 'Building Your Brand', url: 'https://www.youtube.com/watch?v=i8z4F5FqVWg' },
    ],
    color: 'from-accent/20 to-accent/5',
    iconColor: 'text-accent',
  },
  {
    id: 'photography',
    title: { am: 'የምርት ፎቶግራፊ', en: 'Product Photography' },
    duration: '18 min',
    videos: [
      { title: 'Photography for Products', url: 'https://www.youtube.com/watch?v=x2q3TX4wjks' },
    ],
    color: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary',
  },
  {
    id: 'selling',
    title: { am: 'ኦንላይን ሽያጭ', en: 'Selling Online' },
    duration: '22 min',
    videos: [
      { title: 'Selling on Facebook/Telegram', url: 'https://www.youtube.com/watch?v=Y8mHeZUFf8o' },
    ],
    color: 'from-secondary/30 to-secondary/10',
    iconColor: 'text-secondary',
  },
];

export default function Learn() {
  const navigate = useNavigate();
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(language, key);

  const openVideo = (url: string) => {
    window.open(url, '_blank');
  };

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
            <h1 className="text-xl font-bold text-foreground font-ethiopic">{t('learningHub')}</h1>
            <p className="text-sm text-muted-foreground">Grow your business skills</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Progress Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-accent to-accent/80 rounded-2xl p-5"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent-foreground/20 flex items-center justify-center">
              <Award className="w-7 h-7 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-accent-foreground">
                {language === 'am' ? 'የመማሪያ ግስጋሴ' : 'Learning Progress'}
              </h3>
              <p className="text-sm text-accent-foreground/80">
                Complete lessons to earn certificates
              </p>
            </div>
          </div>
          <div className="mt-4 bg-accent-foreground/20 rounded-full h-2 overflow-hidden">
            <div className="bg-accent-foreground h-full w-1/4 rounded-full" />
          </div>
          <p className="text-xs text-accent-foreground/70 mt-2">1 of 5 courses completed</p>
        </motion.div>

        {/* Lessons */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground font-ethiopic">
            {language === 'am' ? 'ኮርሶች' : 'Courses'}
          </h2>

          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-elevated"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${lesson.color} flex items-center justify-center flex-shrink-0`}>
                  <BookOpen className={`w-5 h-5 ${lesson.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground font-ethiopic">
                    {lesson.title[language === 'am' ? 'am' : 'en']}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {lesson.videos.length} {language === 'am' ? 'ቪዲዮዎች' : 'videos'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Videos */}
              <div className="mt-4 space-y-2">
                {lesson.videos.map((video, vIndex) => (
                  <button
                    key={vIndex}
                    onClick={() => openVideo(video.url)}
                    className="w-full flex items-center gap-3 p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Play className="w-4 h-4 text-primary" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-foreground text-left">
                      {video.title}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
