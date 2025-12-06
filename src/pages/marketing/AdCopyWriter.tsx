import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { getTranslation, languages } from '@/lib/i18n';
import { 
  ArrowLeft, 
  Sparkles, 
  Copy, 
  Bookmark, 
  Share2,
  Check,
  Loader2,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Sample AI-generated ad copies for demo
const sampleAds: Record<string, string[]> = {
  am: [
    '🚀 ልዩ ቅናሽ! አሁን ብቻ! የሚገርም ዕድል ለማግኘት አይተው! ዛሬ ይዘዙ!',
    '🔥 የሚያስደንቅ አማራጭ! የእርስዎን ንግድ ወደ ላቀ ደረጃ ያሳድጉ። ውስን ጊዜያዊ ቅናሽ!',
    '💎 የልዩ ደንበኞች ብቻ! ይህን ልዩ ቅናሽ አያመልጡ። አሁን ይግዙ!',
  ],
  en: [
    '🚀 Special offer! Only now! Don\'t miss this amazing opportunity. Order today!',
    '🔥 Amazing choice! Take your business to the next level. Limited time discount!',
    '💎 Exclusive for our valued customers! Don\'t miss this special offer. Buy now!',
  ],
};

export default function AdCopyWriter() {
  const navigate = useNavigate();
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(language, key);

  const [productDetails, setProductDetails] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [generatedAds, setGeneratedAds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!productDetails.trim()) {
      toast.error(t('productDetailsRequired'));
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Get sample ads based on language
    const ads = sampleAds[language] || sampleAds.en;
    setGeneratedAds(ads);
    setIsGenerating(false);
  };

  const handleCopy = async (ad: string, index: number) => {
    await navigator.clipboard.writeText(ad);
    setCopiedIndex(index);
    toast.success(t('copied'));
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSave = (ad: string) => {
    // Add to saved ads in the future
    toast.success(t('saved'));
  };

  const handleShare = async (ad: string) => {
    if (navigator.share) {
      await navigator.share({ text: ad });
    } else {
      await navigator.clipboard.writeText(ad);
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
            <h1 className="text-xl font-bold text-foreground font-ethiopic">{t('adCopyWriter')}</h1>
            <p className="text-sm text-muted-foreground">
              {language === 'am' ? 'ውጤታማ የማስታወቂያ ጽሑፍ ይፍጠሩ' : 'Create effective ad copy'}
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
              {language === 'am' ? 'ስለ ምርትዎ ዝርዝሮች' : 'Product/Service Details'}
            </label>
            <Textarea
              value={productDetails}
              onChange={(e) => setProductDetails(e.target.value)}
              placeholder={
                language === 'am' 
                  ? 'ለምሳሌ: የቤት ውስጥ የተሰራ ኬክ፣ በተለያዩ ጣዕሞች የሚገኝ...' 
                  : 'E.g., Homemade cake, available in various flavors...'
              }
              className="min-h-[120px] rounded-xl text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2 font-ethiopic">
              {language === 'am' ? 'የደንበኞች ቡድን' : 'Target Audience'}
            </label>
            <Textarea
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder={
                language === 'am' 
                  ? 'ለምሳሌ: ወጣቶች፣ የቤት ሰራተኞች፣ ተማሪዎች...' 
                  : 'E.g., Young adults, homemakers, students...'
              }
              className="min-h-[80px] rounded-xl text-base"
            />
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
                {t('generate')}
              </>
            )}
          </Button>
        </motion.div>

        {/* Results */}
        {generatedAds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold text-foreground font-ethiopic">
              {language === 'am' ? 'የተፈጠሩ የማስታወቂያ ጽሑፎች' : 'Generated Ad Copies'}
            </h2>

            {generatedAds.map((ad, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated"
              >
                <p className="text-foreground font-ethiopic leading-relaxed mb-4">
                  {ad}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(ad, index)}
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
                    onClick={() => handleSave(ad)}
                    className="flex-1 rounded-lg"
                  >
                    <Bookmark className="w-4 h-4 mr-1" />
                    {t('save')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(ad)}
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
