import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { getTranslation } from '@/lib/i18n';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AddSale() {
  const navigate = useNavigate();
  const { language, addSale } = useAppStore();
  const t = (key: string) => getTranslation(language, key);

  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!item || !quantity || !price) {
      toast.error('Please fill in all required fields');
      return;
    }

    const qty = parseInt(quantity);
    const priceNum = parseFloat(price);
    const costNum = parseFloat(cost) || 0;
    const profit = (priceNum - costNum) * qty;

    addSale({
      date: new Date().toISOString(),
      item,
      quantity: qty,
      price: priceNum,
      profit,
    });

    toast.success(language === 'am' ? 'ሽያጭ ተመዝግቧል!' : 'Sale recorded!');
    navigate('/sales');
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
            <h1 className="text-xl font-bold text-foreground">Log Sale</h1>
            <p className="text-sm text-muted-foreground">Record a new sale</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="item" className="font-ethiopic">
              {language === 'am' ? 'የእቃ ስም' : 'Item Name'} *
            </Label>
            <Input
              id="item"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder={language === 'am' ? 'ለምሳሌ: ዳቦ' : 'E.g., Bread'}
              className="h-12 rounded-xl text-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="font-ethiopic">
                {language === 'am' ? 'ብዛት' : 'Quantity'} *
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1"
                className="h-12 rounded-xl text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="font-ethiopic">
                {language === 'am' ? 'ዋጋ (ETB)' : 'Price (ETB)'} *
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="100"
                className="h-12 rounded-xl text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost" className="font-ethiopic">
              {language === 'am' ? 'የግዢ ዋጋ (ETB)' : 'Cost Price (ETB)'} (optional)
            </Label>
            <Input
              id="cost"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="50"
              className="h-12 rounded-xl text-base"
            />
            <p className="text-xs text-muted-foreground">
              Enter cost price to calculate profit
            </p>
          </div>

          {/* Profit Preview */}
          {price && quantity && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500/20 rounded-xl p-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Sale</span>
                <span className="font-semibold text-foreground">
                  {(parseFloat(price) * parseInt(quantity)).toLocaleString()} ETB
                </span>
              </div>
              {cost && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">Profit</span>
                  <span className="font-semibold text-green-600">
                    +{((parseFloat(price) - parseFloat(cost)) * parseInt(quantity)).toLocaleString()} ETB
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        <Button
          type="submit"
          className="w-full h-14 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 mt-8"
        >
          <Check className="w-5 h-5 mr-2" />
          {language === 'am' ? 'ሽያጭ አስቀምጥ' : 'Save Sale'}
        </Button>
      </form>
    </div>
  );
}
