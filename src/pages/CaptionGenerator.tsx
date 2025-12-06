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
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Sample AI-generated captions for demo
const sampleCaptions: Record<string, string[]> = {
  am: [
    '✨ ለእርስዎ ልዩ ምርጫ! 🛍️ የተመረጠ ጥራት ያለው ምርት በተመጣጣኝ ዋጋ። ዛሬ ይዘዙ! 📞',
    '🔥 ትኩስ ቅናሽ! ይህንን አምዎ አያመልጡ። ውስን ቁጥር ብቻ ይቀራል! ⏰',
    '💯 100% እርካታ ዋስትና! የእኛን ምርቶች ይሞክሩ እና ልዩነቱን ይመልከቱ ✅',
  ],
  en: [
    '✨ Special offer just for you! 🛍️ Premium quality at unbeatable prices. Order today! 📞',
    '🔥 Hot deal alert! Don\'t miss this amazing offer. Limited stock available! ⏰',
    '💯 100% satisfaction guaranteed! Try our products and see the difference ✅',
  ],
  om: [
    '✨ Kennaa addaa siif qophaa\'e! 🛍️ Qulqullina ol\'aanaa gatii gaarii. Har\'a ajaji! 📞',
    '🔥 Carraa ho\'aa! Carraa ajaa\'ibaa kana hin dhiiniin. Kuusni daangeffame! ⏰',
    '💯 Itti quufinsa 100%! Oomisha keenya yaali garaagarummaa argi ✅',
  ],
};

export default function CaptionGenerator() {
  const navigate = useNavigate();
  const { language, addCaption } = useAppStore();
  const t = (key: string) => getTranslation(language, key);

  const [productDescription, setProductDescription] = useState('');
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!productDescription.trim()) {
      toast.error('Please describe your product or service');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Get sample captions based on language
    const captions = sampleCaptions[language] || sampleCaptions.en;
    setGeneratedCaptions(captions);
    setIsGenerating(false);
  };

  const handleCopy = async (caption: string, index: number) => {
    await navigator.clipboard.writeText(caption);
    setCopiedIndex(index);
    toast.success(language === 'am' ? 'ተቀድቷል!' : 'Copied!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSave = (caption: string) => {
    addCaption(caption);
    toast.success(language === 'am' ? 'ተቀምጧል!' : 'Saved!');
  };

  const handleShare = async (caption: string) => {
    if (navigator.share) {
      await navigator.share({ text: caption });
    } else {
      await navigator.clipboard.writeText(caption);
      toast.success('Copied to clipboard for sharing!');
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
            <h1 className="text-xl font-bold text-foreground font-ethiopic">{t('captionGenerator')}</h1>
            <p className="text-sm text-muted-foreground">AI-powered captions in 7 languages</p>
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
              {language === 'am' ? 'ስለ ምርትዎ ይንገሩን' : 'Tell us about your product'}
            </label>
            <Textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder={
                language === 'am' 
                  ? 'ለምሳሌ: ሙሉ እህል ዳቦ፣ በቅቤ እና በፍራፍሬ...' 
                  : 'E.g., Whole grain bread with butter and fruits...'
              }
              className="min-h-[120px] rounded-xl text-base"
            />
          </div>

          {/* Language indicator */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Generating in:</span>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg font-medium">
              {languages.find(l => l.code === language)?.nativeName}
            </span>
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
        {generatedCaptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold text-foreground font-ethiopic">
              {language === 'am' ? 'የተፈጠሩ መግለጫዎች' : 'Generated Captions'}
            </h2>

            {generatedCaptions.map((caption, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated"
              >
                <p className="text-foreground font-ethiopic leading-relaxed mb-4">
                  {caption}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(caption, index)}
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
                    onClick={() => handleSave(caption)}
                    className="flex-1 rounded-lg"
                  >
                    <Bookmark className="w-4 h-4 mr-1" />
                    {t('save')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(caption)}
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
