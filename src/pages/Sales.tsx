import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { getTranslation } from '@/lib/i18n';
import { 
  ArrowLeft, 
  Plus, 
  Package,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';

export default function Sales() {
  const navigate = useNavigate();
  const { language, sales, inventory } = useAppStore();
  const t = (key: string) => getTranslation(language, key);

  // Calculate stats
  const thisMonthSales = sales.filter((s) => {
    const saleDate = new Date(s.date);
    const now = new Date();
    return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
  });
  
  const totalRevenue = thisMonthSales.reduce((acc, s) => acc + s.price * s.quantity, 0);
  const totalProfit = thisMonthSales.reduce((acc, s) => acc + s.profit, 0);
  
  const lowStockItems = inventory.filter((item) => item.quantity <= item.lowStockThreshold);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="safe-top bg-card border-b border-border px-6 pt-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground font-ethiopic">{t('salesInventory')}</h1>
              <p className="text-sm text-muted-foreground">Track your business</p>
            </div>
          </div>
          <Link
            to="/sales/add"
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-primary-foreground" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="card-elevated">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-secondary" />
              </div>
              <span className="text-sm text-muted-foreground font-ethiopic">{t('thisMonth')}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">ETB Revenue</p>
          </div>

          <div className="card-elevated">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-muted-foreground">Profit</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {totalProfit.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">ETB {t('thisMonth')}</p>
          </div>
        </motion.div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Low Stock Alert</h3>
                <p className="text-sm text-muted-foreground">
                  {lowStockItems.length} items need restocking
                </p>
              </div>
              <Link to="/sales/inventory">
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="text-lg font-semibold text-foreground font-ethiopic">
            Quick Actions
          </h2>

          <Link
            to="/sales/add"
            className="card-elevated flex items-center gap-4"
          >
            <div className="icon-container icon-container-primary">
              <Plus className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Log New Sale</h3>
              <p className="text-sm text-muted-foreground">Record a sale quickly</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>

          <Link
            to="/sales/inventory"
            className="card-elevated flex items-center gap-4"
          >
            <div className="icon-container icon-container-secondary">
              <Package className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Manage Inventory</h3>
              <p className="text-sm text-muted-foreground">View and update stock</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>
        </motion.div>

        {/* Recent Sales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground font-ethiopic">
              Recent Sales
            </h2>
            <Link to="/sales/history" className="text-sm text-primary font-medium">
              View All
            </Link>
          </div>

          {sales.length === 0 ? (
            <div className="card-elevated text-center py-8">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No sales recorded yet</p>
              <Button 
                onClick={() => navigate('/sales/add')}
                className="mt-4 rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Sale
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {sales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="card-elevated flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{sale.item}</h4>
                    <p className="text-sm text-muted-foreground">
                      {sale.quantity} × {sale.price.toLocaleString()} ETB
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {(sale.price * sale.quantity).toLocaleString()} ETB
                    </p>
                    <p className="text-xs text-green-600">
                      +{sale.profit.toLocaleString()} profit
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
