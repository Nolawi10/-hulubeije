import { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/services/api';
import { useAppStore } from '@/store/appStore';
import { getTranslation } from '@/lib/i18n';
import GeminiChat from '@/components/GeminiChat';
import { 
  Upload, 
  Image as ImageIcon, 
  Palette, 
  MapPin, 
  Route, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Camera,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AIStudio() {
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(language, key);
  
  const [activeTab, setActiveTab] = useState<'caption' | 'poster' | 'maps'>('caption');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Caption Generation State
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [captionPrompt, setCaptionPrompt] = useState('');

  // Poster Generation State
  const [businessType, setBusinessType] = useState('');
  const [product, setProduct] = useState('');
  const [posterTheme, setPosterTheme] = useState('modern');

  // Maps State
  const [searchQuery, setSearchQuery] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCaption = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.generateCaption(selectedImage, captionPrompt);
      if (response.error) {
        setError(response.error);
      } else {
        setResult(response);
      }
    } catch (err) {
      setError('Failed to generate caption');
    } finally {
      setLoading(false);
    }
  };

  const generatePoster = async () => {
    if (!businessType || !product) {
      setError('Please fill in business type and product');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.generatePoster(businessType, product, posterTheme);
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

  const searchPlaces = async () => {
    if (!searchQuery) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.searchPlaces(searchQuery);
      if (response.error) {
        setError(response.error);
      } else {
        setResult(response);
      }
    } catch (err) {
      setError('Failed to search places');
    } finally {
      setLoading(false);
    }
  };

  const getDirections = async () => {
    if (!origin || !destination) {
      setError('Please enter both origin and destination');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.getDirections(origin, destination);
      if (response.error) {
        setError(response.error);
      } else {
        setResult(response);
      }
    } catch (err) {
      setError('Failed to get directions');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="safe-top bg-gradient-to-br from-primary via-primary to-secondary px-6 pt-6 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="text-primary-foreground">
            <Sparkles className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-primary-foreground">AI Studio</h1>
            <p className="text-sm text-primary-foreground/80">
              Powered by Google Gemini & Maps
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 bg-primary-foreground/10 p-1 rounded-xl">
          <button
            onClick={() => { setActiveTab('caption'); clearResults(); }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'caption'
                ? 'bg-primary-foreground text-primary'
                : 'text-primary-foreground/70 hover:text-primary-foreground'
            }`}
          >
            <Camera className="w-4 h-4 inline mr-2" />
            Caption
          </button>
          <button
            onClick={() => { setActiveTab('poster'); clearResults(); }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'poster'
                ? 'bg-primary-foreground text-primary'
                : 'text-primary-foreground/70 hover:text-primary-foreground'
            }`}
          >
            <Palette className="w-4 h-4 inline mr-2" />
            Poster
          </button>
          <button
            onClick={() => { setActiveTab('maps'); clearResults(); }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'maps'
                ? 'bg-primary-foreground text-primary'
                : 'text-primary-foreground/70 hover:text-primary-foreground'
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            Maps
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Caption Generation */}
        {activeTab === 'caption' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-xl p-6 border">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Image Caption Generator
              </h2>

              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Upload Image</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center relative">
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="max-w-full h-48 mx-auto object-cover rounded-lg"
                      />
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Click to upload an image</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Custom Prompt */}
                <div>
                  <label className="block text-sm font-medium mb-2">Custom Prompt (Optional)</label>
                  <textarea
                    value={captionPrompt}
                    onChange={(e) => setCaptionPrompt(e.target.value)}
                    placeholder="Generate a catchy social media caption for this image..."
                    className="w-full p-3 border rounded-lg resize-none h-20"
                  />
                </div>

                <button
                  onClick={generateCaption}
                  disabled={loading || !selectedImage}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Caption
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Poster Generation */}
        {activeTab === 'poster' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-xl p-6 border">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Poster Design Generator
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Business Type</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full p-3 border rounded-lg"
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
                    className="w-full p-3 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Theme</label>
                  <select
                    value={posterTheme}
                    onChange={(e) => setPosterTheme(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>

                <button
                  onClick={generatePoster}
                  disabled={loading || !businessType || !product}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
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
          </motion.div>
        )}

        {/* Maps Features */}
        {activeTab === 'maps' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Place Search */}
            <div className="bg-card rounded-xl p-6 border">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Search Places
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for places near you..."
                  className="w-full p-3 border rounded-lg"
                />

                <button
                  onClick={searchPlaces}
                  disabled={loading || !searchQuery}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4" />
                      Search Places
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Directions */}
            <div className="bg-card rounded-xl p-6 border">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Route className="w-5 h-5 text-primary" />
                Get Directions
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Starting point..."
                  className="w-full p-3 border rounded-lg"
                />

                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Destination..."
                  className="w-full p-3 border rounded-lg"
                />

                <button
                  onClick={getDirections}
                  disabled={loading || !origin || !destination}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Getting directions...
                    </>
                  ) : (
                    <>
                      <Route className="w-4 h-4" />
                      Get Directions
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl p-6 border"
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold">Result</h3>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(result, null, 2)}</pre>
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
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-40"
      >
        <MessageCircle className="w-6 h-6 text-primary-foreground" />
      </button>

      {/* Chat Component */}
      <GeminiChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
}
