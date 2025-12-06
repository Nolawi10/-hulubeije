import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { getTranslation } from '@/lib/i18n';
import { api } from '@/services/api';
import { 
  ArrowLeft, 
  Calendar, 
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';

interface ContentIdea {
  id: string;
  title: string;
  description: string;
  platform: string;
  bestTime: string;
  hashtags: string[];
}

export default function ContentCalendar() {
  const navigate = useNavigate();
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(language, key);
  
  const [loading, setLoading] = useState(false);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [error, setError] = useState('');
  
  const [businessType, setBusinessType] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [platforms, setPlatforms] = useState('');
  const [contentGoals, setContentGoals] = useState('');

  const generateContentCalendar = async () => {
    if (!businessType) {
      setError('Please enter your business type');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const prompt = `Generate a 7-day content calendar for:
Business Type: ${businessType}
Target Audience: ${targetAudience || 'general customers'}
Platforms: ${platforms || 'Instagram, Facebook, Twitter'}
Goals: ${contentGoals || 'engagement and sales'}

For each day, provide: title, description, platform, best posting time, and 3-5 hashtags.
Format as JSON array.`;
      
      const response = await api.chatWithGemini(prompt);
      if (response.error) {
        setError(response.error);
      } else {
        // Mock content ideas for now
        const mockIdeas: ContentIdea[] = [
          {
            id: '1',
            title: 'Monday Motivation',
            description: 'Share an inspiring quote related to your industry to start the week strong',
            platform: 'Instagram',
            bestTime: '9:00 AM',
            hashtags: ['#MondayMotivation', '#Inspiration', '#BusinessTips']
          },
          {
            id: '2',
            title: 'Product Spotlight',
            description: 'Feature your best-selling product with customer testimonials',
            platform: 'Facebook',
            bestTime: '2:00 PM',
            hashtags: ['#ProductOfTheDay', '#CustomerLove', '#Quality']
          },
          {
            id: '3',
            title: 'Behind the Scenes',
            description: 'Show how your products are made or your team in action',
            platform: 'Instagram Stories',
            bestTime: '6:00 PM',
            hashtags: ['#BehindTheScenes', '#MakingOf', '#TeamWork']
          },
          {
            id: '4',
            title: 'Industry Tips',
            description: 'Share valuable tips and insights from your expertise',
            platform: 'LinkedIn',
            bestTime: '12:00 PM',
            hashtags: ['#ExpertTips', '#IndustryInsights', '#Professional']
          },
          {
            id: '5',
            title: 'Customer Friday',
            description: 'Feature customer photos and reviews with their permission',
            platform: 'Instagram',
            bestTime: '5:00 PM',
            hashtags: ['#CustomerFriday', '#Testimonials', '#SocialProof']
          },
          {
            id: '6',
            title: 'Weekend Special',
            description: 'Announce a weekend promotion or special offer',
            platform: 'Twitter',
            bestTime: '10:00 AM',
            hashtags: ['#WeekendDeal', '#SpecialOffer', '#LimitedTime']
          },
          {
            id: '7',
            title: 'Sunday Planning',
            description: 'Share tips for planning the week ahead in your industry',
            platform: 'Facebook',
            bestTime: '8:00 PM',
            hashtags: ['#SundayPlanning', '#WeekPrep', '#Organization']
          }
        ];
        
        setContentIdeas(mockIdeas);
      }
    } catch (err) {
      setError('Failed to generate content calendar');
    } finally {
      setLoading(false);
    }
  };

  const regenerateCalendar = () => {
    setContentIdeas([]);
    generateContentCalendar();
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
            <h1 className="text-xl font-bold text-foreground font-ethiopic">
              AI Content Calendar
            </h1>
            <p className="text-sm text-muted-foreground">
              Powered by Google Gemini AI
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Input Form */}
          <div className="bg-card rounded-xl p-6 border">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Content Strategy
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Business Type *</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-background"
                >
                  <option value="">Select business type</option>
                  <option value="restaurant">Restaurant & Food</option>
                  <option value="retail">Retail Store</option>
                  <option value="service">Professional Service</option>
                  <option value="technology">Technology</option>
                  <option value="fashion">Fashion & Beauty</option>
                  <option value="education">Education</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g., Young adults, Local community, Professionals"
                  className="w-full p-3 border rounded-lg bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Social Platforms</label>
                <input
                  type="text"
                  value={platforms}
                  onChange={(e) => setPlatforms(e.target.value)}
                  placeholder="e.g., Instagram, Facebook, Twitter, LinkedIn"
                  className="w-full p-3 border rounded-lg bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content Goals</label>
                <input
                  type="text"
                  value={contentGoals}
                  onChange={(e) => setContentGoals(e.target.value)}
                  placeholder="e.g., Increase engagement, Drive sales, Build community"
                  className="w-full p-3 border rounded-lg bg-background"
                />
              </div>

              <button
                onClick={generateContentCalendar}
                disabled={loading || !businessType}
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Calendar...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate 7-Day Calendar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          {contentIdeas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Your Content Calendar
                </h3>
                <button
                  onClick={regenerateCalendar}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>

              {contentIdeas.map((idea, index) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl p-4 border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-muted-foreground">
                          {days[index]}
                        </span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {idea.platform}
                        </span>
                      </div>
                      <h4 className="font-semibold">{idea.title}</h4>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {idea.bestTime}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {idea.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {idea.hashtags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs bg-muted px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/10 border border-destructive/20 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
