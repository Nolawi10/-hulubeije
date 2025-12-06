import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { getTranslation } from '@/lib/i18n';
import { api } from '@/services/api';
import { 
  ArrowLeft, 
  Quote, 
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Copy,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';

export default function SloganCreator() {
  const navigate = useNavigate();
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(language, key);
  
  const [loading, setLoading] =useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [keywords, setKeywords] = useState('');

  const generateSlogans = async () => {
    if (!businessName) {
      setError('Please enter your business name');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const prompt = `Generate 5 catchy business slogans for:
Business: ${businessName}
Type: ${businessType || 'general business'}
Target: ${targetAudience || 'general customers'}
Keywords: ${keywords || 'none'}

Make them memorable, short, and impactful.`;
      
      const response = await api.chatWithGemini(prompt);
      if (response.error) {
        setError(response.error);
      } else {
        const slogans = response.response
          .split('\n')
          .filter(line => line.trim() && (line.includes('.') || line.includes('"') || line.includes("'")))
          .map(line => line.replace(/^\d+\.\s*/, '').replace(/[""]/g, '').trim())
          .filter(slogan => slogan.length > 5 && slogan.length < 100);
        
        setResults(slogans.length > 0 ? slogans : [response.response]);
      }
    } catch (err) {
      setError('Failed to generate slogans');
    } finally {
      setLoading(false);
    }
  };

  const copySlogan = (index: number, slogan: string) => {
    navigator.clipboard.writeText(slogan);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const regenerateSlogans = () => {
    setResults([]);
    generateSlogans();
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
            <h1 className="text-xl font-bold text-foreground font-ethiopic">
              AI Slogan Creator
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
              <Lightbulb className="w- h-5 text-primary" />
              Business Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Business Name *</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g., Hulu Be Ije, Coffee House, Tech Solutions"
                  className="w-full p-3 border rounded-lg bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Business Type</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-background"
                >
                  <option value="">Select type</option>
                  <option value="restaurant">Restaurant & Food</option>
                  <option value="technology">Technology</option>
                  <option value="fashion">Fashion & Apparel</option>
                  <option value="retail">Retail Store</option>
                  <option value="service">Professional Service</option>
                  <option value="education">Education & Training</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="entertainment">Entertainment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g., Young professionals, Families, Students"
                  className="w-full p-3 border rounded-lg bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Keywords (Optional)</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., quality, innovation, affordable, local"
                  className="w-full p-3 border rounded-lg bg-background"
                />
              </div>

              <button
                onClick={generateSlogans}
                disabled={loading || !businessName}
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Slogans...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Slogans
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Generated Slogans
                </h3>
                <button
                  onClick={regenerateSlogans}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {results.map((slogan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl p-4 border flex items-center justify-between group hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Quote className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-sm font-medium">{slogan}</p>
                  </div>
                  <button
                    onClick={() => copySlogan(index, slogan)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    {copiedIndex === index ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
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
