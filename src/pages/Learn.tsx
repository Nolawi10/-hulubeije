import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { getTranslation } from '@/lib/i18n';
import { 
  ArrowLeft, 
  Play, 
  BookOpen,
  Clock,
  ChevronRight,
  Award,
  Flame,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Video {
  id: string;
  title: string | { am: string; en: string };
  duration: string;
  watched: boolean;
  url?: string;
}

interface Lesson {
  id: string;
  title: { am: string; en: string };
  description: { am: string; en: string };
  duration: string;
  videos: Video[];
  color: string;
  iconColor: string;
  completed: boolean;
}

const initialLessons: Lesson[] = [
  {
    id: 'digital-marketing-basics',
    title: {
      am: 'የዲጂታል ማርኬቲንግ መሰረታዊ ነገሮች',
      en: 'Digital Marketing Basics'
    },
    description: {
      am: 'የዲጂታል ማርኬቲንግ መሰረታዊ ነገሮችን ይማሩ',
      en: 'Learn the fundamentals of digital marketing'
    },
    videos: [
      {
        id: 'h95cQkEWBx0',
        title: {
          am: 'የዲጂታል ማርኬቲንግ ምንድን ነው?',
          en: 'What is Digital Marketing?'
        },
        duration: '15:30',
        watched: false
      }
    ],
    color: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary',
    completed: false
  },
  {
    id: 'social-media-marketing',
    title: {
      am: 'በማህበራት ሚዲያ የማስታወቂያ ስልቶች',
      en: 'Social Media Marketing Strategies'
    },
    description: {
      am: 'በማህበራት ሚዲያ ውጤታማ የማስታወቂያ ስልቶችን ይማሩ',
      en: 'Learn effective social media advertising strategies'
    },
    videos: [
      {
        id: 'Dkwwhn7fe0E',
        title: {
          am: 'በማህበራት ሚዲያ ውጤታማ ማስታወቂያ እንዴት ማድረግ እንደሚቻል',
          en: 'How to Advertise Effectively on Social Media'
        },
        duration: '18:45',
        watched: false
      }
    ],
    duration: '18:45',
    color: 'from-secondary/30 to-secondary/10',
    iconColor: 'text-secondary',
    completed: false
  },
  {
    id: 'money-management',
    title: {
      am: 'ገንዘብ አስተዳደር ስልቶች',
      en: 'Money Management Strategies'
    },
    description: {
      am: 'የገንዘብ አስተዳደር ውጤታማ ስልቶችን ይማሩ',
      en: 'Learn effective money management strategies'
    },
    videos: [
      {
        id: '1w1OgmhupNk',
        title: {
          am: 'ገንዘብዎን እንዴት በትክክል እንደሚያስተዳድሩ',
          en: 'How to Manage Your Money Effectively'
        },
        duration: '22:15',
        watched: false
      }
    ],
    duration: '22:15',
    color: 'from-accent/20 to-accent/5',
    iconColor: 'text-accent',
    completed: false
  },
  {
    id: 'branding',
    title: {
      am: 'የደንበኛ ታማኝነት መገንበር',
      en: 'Building Customer Loyalty'
    },
    description: {
      am: 'የደንበኛ ታማኝነት እንዴት እንደሚገነባ',
      en: 'How to build customer loyalty for your brand'
    },
    videos: [
      {
        id: 'LwrGSKnShmk',
        title: {
          am: 'የደንበኛ ታማኝነት ለመገንባት 5 ዋና ዋና ስልቶች',
          en: '5 Key Strategies to Build Customer Loyalty'
        },
        duration: '12:30',
        watched: false
      }
    ],
    duration: '12:30',
    color: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary',
    completed: false
  }
];

// Get or initialize learning progress from localStorage
const getInitialProgress = () => {
  if (typeof window === 'undefined') return { lessons: initialLessons, streak: 0, lastActive: null };
  
  const saved = localStorage.getItem('learningProgress');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse learning progress', e);
    }
  }
  return { 
    lessons: initialLessons, 
    streak: 0, 
    lastActive: null,
    completedLessons: 0,
    totalLessons: initialLessons.length
  };
};

export default function Learn() {
  const navigate = useNavigate();
  const { language } = useAppStore();
  const [progress, setProgress] = useState(getInitialProgress);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<{lessonId: string, videoId: string} | null>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  
  const t = (key: string) => getTranslation(language, key);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('learningProgress', JSON.stringify(progress));
  }, [progress]);

  // Check and update streak
  useEffect(() => {
    const today = new Date().toDateString();
    const lastActive = progress.lastActive ? new Date(progress.lastActive).toDateString() : null;
    
    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActive === yesterday.toDateString()) {
        // Increment streak if they were active yesterday
        setProgress(prev => ({
          ...prev,
          streak: (prev.streak || 0) + 1,
          lastActive: new Date().toISOString()
        }));
      } else if (lastActive !== today) {
        // Reset streak if they missed a day
        setProgress(prev => ({
          ...prev,
          streak: 1,
          lastActive: new Date().toISOString()
        }));
      }
    }
  }, []);

  const toggleLesson = (lessonId: string) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  const markVideoAsWatched = (lessonId: string, videoId: string) => {
    setProgress(prev => {
      const updatedLessons = prev.lessons.map(lesson => {
        if (lesson.id === lessonId) {
          const updatedVideos = lesson.videos.map(video => 
            video.id === videoId ? { ...video, watched: true } : video
          );
          
          // Check if all videos in the lesson are watched
          const allVideosWatched = updatedVideos.every(v => v.watched);
          
          return {
            ...lesson,
            videos: updatedVideos,
            completed: allVideosWatched
          };
        }
        return lesson;
      });

      // Count completed lessons
      const completedLessons = updatedLessons.filter(l => l.completed).length;
      
      return {
        ...prev,
        lessons: updatedLessons,
        completedLessons,
        lastActive: new Date().toISOString()
      };
    });
  };

  const openVideo = (lessonId: string, videoId: string) => {
    setCurrentVideo({ lessonId, videoId });
    setShowVideoPlayer(true);
    
    // Mark as watched after 30 seconds of watching
    setTimeout(() => {
      markVideoAsWatched(lessonId, videoId);
    }, 30000);
  };

  const closeVideoPlayer = () => {
    setShowVideoPlayer(false);
    setCurrentVideo(null);
  };

  const getProgressPercentage = () => {
    if (progress.lessons.length === 0) return 0;
    const completed = progress.lessons.filter(l => l.completed).length;
    return Math.round((completed / progress.lessons.length) * 100);
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
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 rounded-xl bg-accent-foreground/20 flex items-center justify-center flex-shrink-0">
                <Award className="w-7 h-7 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-accent-foreground font-ethiopic">
                  {language === 'am' ? 'የመማሪያ ግስጋሴ' : 'Learning Progress'}
                </h3>
                <p className="text-sm text-accent-foreground/80 line-clamp-1">
                  {language === 'am' 
                    ? 'ትምህርቶችን አጠናቅቀው ሰርተፍኬቶችን ያግኙ'
                    : 'Complete lessons to earn certificates'}
                </p>
                
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-accent-foreground/80">
                      {progress.completedLessons || 0} {language === 'am' ? 'ከ' : 'of'} {progress.totalLessons || 0} {language === 'am' ? 'ተጠናቅቀዋል' : 'completed'}
                    </span>
                    <span className="text-accent-foreground font-medium">{getProgressPercentage()}%</span>
                  </div>
                  <Progress 
                    value={getProgressPercentage()} 
                    className="h-2 bg-accent-foreground/20"
                  />
                </div>
              </div>
            </div>
            
            {/* Streak Counter */}
            <div className="flex flex-col items-center bg-accent-foreground/20 rounded-lg p-2 min-w-[60px]">
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-accent-foreground" />
                <span className="text-sm font-bold text-accent-foreground">{progress.streak || 0}</span>
              </div>
              <span className="text-[10px] text-accent-foreground/80 mt-0.5">
                {language === 'am' ? 'ቀናት' : 'Days'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Lessons */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground font-ethiopic">
            {language === 'am' ? 'ኮርሶች' : 'Courses'}
          </h2>

          {progress.lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "card-elevated overflow-hidden transition-all duration-200",
                expandedLesson === lesson.id ? "ring-2 ring-primary/20" : ""
              )}
            >
              <button
                onClick={() => toggleLesson(lesson.id)}
                className="w-full flex items-start gap-4 p-4 text-left"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${lesson.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  {lesson.completed ? (
                    <CheckCircle2 className={`w-5 h-5 ${lesson.iconColor} fill-current`} />
                  ) : (
                    <BookOpen className={`w-5 h-5 ${lesson.iconColor}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-foreground font-ethiopic">
                      {lesson.title[language === 'am' ? 'am' : 'en']}
                    </h3>
                    {expandedLesson === lesson.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2 mt-0.5" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2 mt-0.5" />
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {lesson.description[language === 'am' ? 'am' : 'en']}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{lesson.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Play className="w-3.5 h-3.5" />
                      <span>
                        {lesson.videos.filter(v => v.watched).length}/{lesson.videos.length} {language === 'am' ? 'ተጠናቅቀዋል' : 'completed'}
                      </span>
                    </div>
                    {lesson.completed && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        {language === 'am' ? 'ተጠናቅቋል' : 'Completed'}
                      </span>
                    )}
                  </div>
                </div>
              </button>

              {/* Collapsible Content */}
              <AnimatePresence>
                {expandedLesson === lesson.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0">
                      <div className="border-t border-border pt-4">
                        <h4 className="text-sm font-medium text-foreground mb-3">
                          {language === 'am' ? 'ትምህርቶች' : 'Lessons'}
                        </h4>
                        
                        <div className="space-y-2">
                          {lesson.videos.map((video, vIndex) => (
                            <button
                              key={vIndex}
                              onClick={() => openVideo(lesson.id, video.id)}
                              className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left",
                                video.watched 
                                  ? "bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/40"
                                  : "bg-muted hover:bg-muted/80"
                              )}
                            >
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                                video.watched 
                                  ? "bg-green-100 text-green-600 dark:bg-green-800/50 dark:text-green-400"
                                  : "bg-primary/10 text-primary"
                              )}>
                                {video.watched ? (
                                  <CheckCircle2 className="w-4 h-4 fill-current" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-foreground">
                                  {typeof video.title === 'object' 
                                    ? (video.title[language] || video.title.en)
                                    : video.title}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-muted-foreground">
                                    {video.duration}
                                  </span>
                                  {video.watched && (
                                    <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded">
                                      {language === 'am' ? 'ተመልሷል' : 'Watched'}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          
          {/* Video Player Modal */}
          <AnimatePresence>
            {showVideoPlayer && currentVideo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col"
              >
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <button
                    onClick={closeVideoPlayer}
                    className="p-2 rounded-full hover:bg-muted"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h3 className="font-medium">
                    {(() => {
                      const video = progress.lessons
                        .find(l => l.id === currentVideo.lessonId)
                        ?.videos.find(v => v.id === currentVideo.videoId);
                      if (video) {
                        return typeof video.title === 'object' 
                          ? (video.title[language] || video.title.en)
                          : video.title;
                      }
                      return '';
                    })()}
                  </h3>
                  <div className="w-9"></div> {/* For alignment */}
                </div>
                
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className="w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1`}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Video player"
                    />
                  </div>
                </div>
                
                <div className="p-4 border-t border-border">
                  <Button 
                    onClick={closeVideoPlayer}
                    className="w-full"
                  >
                    {language === 'am' ? 'መዝጋት' : 'Close'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
