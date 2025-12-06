import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { getTranslation } from '@/lib/i18n';
import { api } from '@/services/api';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Palette, 
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Download,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';

export default function PosterGenerator() {
  const navigate = useNavigate();
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(language, key);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  
  const [businessType, setBusinessType] = useState('');
  const [product, setProduct] = useState('');
  const [theme, setTheme] = useState('modern');
  const [targetAudience, setTargetAudience] = useState('');

  const generatePoster = async () => {
    if (!businessType || !product) {
      setError('Please fill in business type and product');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.generatePoster(businessType, product, theme);
      if (response.error) {
        setError(response.error);
      } else {
        setResult(response);
      }
    } catch (err) {
      setError('Failed to generate poster design');
    } finally {
      setLoading(false);
    }
  };

  const regeneratePoster = () => {
    setResult(null);
    generatePoster();
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
              AI Poster Generator
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
              <Palette className="w-5 h-5 text-primary" />
              Design Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Business Type</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-background"
                >
                  <option value="">Select business type</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="tech">Technology</option>
                  <option value="fashion">Fashion</option>
                  <option value="retail">Retail</option>
                  <option value="service">Service</option>
                  <option value="education">Education</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Product/Service</label>
                <input
                  type="text"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="e.g., Coffee, Mobile App, Clothing"
                  className="w-full p-3 border rounded-lg bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Design Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-background"
                >
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="minimalist">Minimalist</option>
                  <option value="bold">Bold</option>
                  <option value="elegant">Elegant</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target Audience (Optional)</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g., Young adults, Families, Professionals"
                  className="w-full p-3 border rounded-lg bg-background"
                />
              </div>

              <button
                onClick={generatePoster}
                disabled={loading || !businessType || !product}
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Design...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Poster Design
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl p-6 border"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold">Poster Design Generated</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={regeneratePoster}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm">{result.poster_design}</pre>
              </div>
              
              <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Next Steps:</strong> Use this design brief with a graphic designer or design tool to create your poster.
                </p>
              </div>
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
