import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { getTranslation, languages } from '@/lib/i18n';
import { 
  ArrowLeft, 
  Hash, 
  Copy, 
  Bookmark, 
  Share2,
  Check,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Sample AI-generated hashtags for demo
const sampleHashtags: Record<string, string[][]> = {
  am: [
    ['#የእኔ፣ #ስራዬ', '#አዲስነት', '#የእርስዎምርዛት'],
    ['#ስራዬ', '#አዲስነት', '#የእርስዎምርዛት', '#ልዩነት', '#ስራዬ'],
    ['#ስራዬ', '#አዲስነት', '#የእርስዎምርዛት', '#ልዩነት', '#ስራዬ']
  ],
  en: [
    ['#MyWork', '#Innovation', '#YourBrand', '#Excellence', '#MyWork'],
    ['#Branding', '#Creative', '#Marketing', '#Business', '#Success'],
    ['#Trending', '#Viral', '#SocialMedia', '#MarketingTips', '#DigitalMarketing']
  ],
};

export default function HashtagGenerator() {
  const navigate = useNavigate();
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(language, key);

  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [generatedHashtags, setGeneratedHashtags] = useState<string[][]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!content.trim()) {
      toast.error(t('contentRequired'));
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Get sample hashtags based on language
    const hashtags = sampleHashtags[language] || sampleHashtags.en;
    setGeneratedHashtags(hashtags);
    setIsGenerating(false);
  };

  const handleCopy = async (hashtagSet: string[], index: number) => {
    await navigator.clipboard.writeText(hashtagSet.join(' '));
    setCopiedIndex(index);
    toast.success(t('copied'));
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSave = (hashtagSet: string[]) => {
    // Add to saved hashtags in the future
    toast.success(t('saved'));
  };

  const handleShare = async (hashtagSet: string[]) => {
    if (navigator.share) {
      await navigator.share({ text: hashtagSet.join(' ') });
    } else {
      await navigator.clipboard.writeText(hashtagSet.join(' '));
      toast.success(t('copiedToClipboard'));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="safe-top bg-card border-b border-border px-6 pt-4 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground font-ethiopic">{t('hashtagGenerator')}</h1>
            <p className="text-sm text-muted-foreground">
              {language === 'am' ? 'ውጤታማ ሃሽታጎችን ይፍጠሩ' : 'Generate effective hashtags'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-foreground mb-2 font-ethiopic">
              {language === 'am' ? 'የእርስዎ ይዘት' : 'Your Content'}
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                language === 'am' 
                  ? 'ለምሳሌ: አዲስ የቡና ሻንቃ ለቡና ፍቅርኞች...' 
                  : 'E.g., New coffee mug for coffee lovers...'
              }
              className="min-h-[120px] rounded-xl text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2 font-ethiopic">
              {language === 'am' ? 'መድረክ' : 'Platform'}
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
            >
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
              <option value="twitter">Twitter</option>
            </select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full h-14 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {language === 'am' ? 'በመፍጠር ላይ...' : 'Generating...'}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                {t('generateHashtags')}
              </>
            )}
          </Button>
        </motion.div>

        {/* Results */}
        {generatedHashtags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold text-foreground font-ethiopic">
              {language === 'am' ? 'የተፈጠሩ ሃሽታጎች' : 'Generated Hashtags'}
            </h2>

            {generatedHashtags.map((hashtagSet, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated"
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  {hashtagSet.map((tag, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(hashtagSet, index)}
                    className="flex-1 rounded-lg"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 mr-1 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 mr-1" />
                    )}
                    {t('copy')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSave(hashtagSet)}
                    className="flex-1 rounded-lg"
                  >
                    <Bookmark className="w-4 h-4 mr-1" />
                    {t('save')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(hashtagSet)}
                    className="flex-1 rounded-lg"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    {t('share')}
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
