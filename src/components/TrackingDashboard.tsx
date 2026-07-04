import React, { useState, useEffect } from 'react';
import { X, Users, Clock, Eye, Target, TrendingUp, Sparkles, Phone, Shield, Search, ChevronRight, Activity } from 'lucide-react';
import { UserStats } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { getApiUrl } from '../lib/api';

export function TrackingDashboard({ adminPhone, onClose }: { adminPhone: string, onClose: () => void }) {
  const [stats, setStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserStats | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(getApiUrl(`/api/tracking/stats?adminPhone=${adminPhone}`));
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch tracking stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStats = stats.filter(s => 
    s.name.includes(searchTerm) || 
    s.userPhone.includes(searchTerm) || 
    s.userIdCode.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl h-[90vh] bg-[#0E0E0E] border border-neutral-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">نظام تتبع أهداف واهتمامات العملاء</h2>
              <p className="text-[10px] text-neutral-400 font-bold">تحليل سلوكيات الشركاء والنشاط الميداني لعام ٢٠٢٦</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-full text-neutral-500 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - User List */}
          <div className="w-1/3 border-l border-neutral-800 flex flex-col bg-neutral-900/30">
            <div className="p-4 border-b border-neutral-800">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input 
                  type="text"
                  placeholder="ابحث بالاسم، الهاتف، أو الكود..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 pr-10 pl-4 text-xs text-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {loading ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-[10px] text-neutral-500">جاري تحليل بيانات السلوك...</p>
                </div>
              ) : filteredStats.length === 0 ? (
                <p className="text-center py-10 text-[10px] text-neutral-600">لا يوجد بيانات نشطة لهذا البحث</p>
              ) : (
                filteredStats.map((user) => (
                  <button
                    key={user.userPhone}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full text-right p-3 rounded-xl transition-all flex items-center justify-between group ${
                      selectedUser?.userPhone === user.userPhone 
                        ? 'bg-indigo-500/10 border border-indigo-500/20' 
                        : 'hover:bg-neutral-800 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${
                        selectedUser?.userPhone === user.userPhone ? 'bg-indigo-500 text-white' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {user.name.charAt(0)}
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-black text-white">{user.name}</p>
                        <p className="text-[9px] text-neutral-450 font-mono tracking-tighter">{user.userIdCode}</p>
                      </div>
                    </div>
                    <div className="text-left">
                       <p className="text-[9px] font-bold text-indigo-400">{user.totalTimeSpent} د</p>
                       <p className="text-[8px] text-neutral-600">نشط: {new Date(user.lastActive).toLocaleTimeString('ar-EG')}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Main View - Analytics Detail */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0B0B0B] p-6">
            <AnimatePresence mode="wait">
              {!selectedUser ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50"
                >
                  <Users className="w-16 h-16 text-neutral-800" />
                  <div>
                    <h3 className="text-sm font-black text-neutral-500">اختر شريكاً من القائمة الجانبية</h3>
                    <p className="text-xs text-neutral-600">سيتم عرض رحلة العميل وتفضيلاته وأهدافه بنظام شوجر بيزنس</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key={selectedUser.userPhone}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* User Profile Overview */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white">{selectedUser.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-[10px] text-neutral-400">
                            <Phone className="w-3 h-3" />
                            {selectedUser.userPhone}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-neutral-700" />
                          <span className="flex items-center gap-1 text-[10px] text-indigo-400 font-black">
                            <Sparkles className="w-3 h-3" />
                            كود: {selectedUser.userIdCode}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Tracking Live</span>
                    </div>
                  </div>

                  {/* Top Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl space-y-1">
                      <div className="flex items-center justify-between text-neutral-400 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-[10px] font-bold">وقت الاستخدام</span>
                      </div>
                      <p className="text-xl font-black text-white">{selectedUser.totalTimeSpent} دقيقة</p>
                      <p className="text-[10px] text-neutral-500">إجمالي التفاعل بالمنصة</p>
                    </div>

                    <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl space-y-1">
                      <div className="flex items-center justify-between text-neutral-400 mb-2">
                        <Eye className="w-4 h-4" />
                        <span className="text-[10px] font-bold">القسم الأكثر زيارة</span>
                      </div>
                      <p className="text-xl font-black text-indigo-400">{selectedUser.mostViewedCategory === 'N/A' ? 'غير محدد' : selectedUser.mostViewedCategory}</p>
                      <p className="text-[10px] text-neutral-500">الاهتمام الاستراتيجي الأكبر</p>
                    </div>

                    <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl space-y-1">
                      <div className="flex items-center justify-between text-neutral-400 mb-2">
                        <Activity className="w-4 h-4" />
                        <span className="text-[10px] font-bold">آخر ظهور نشط</span>
                      </div>
                      <p className="text-xl font-black text-white">{new Date(selectedUser.lastActive).toLocaleTimeString('ar-EG')}</p>
                      <p className="text-[10px] text-neutral-500">توقيت آخر حركة بالمنظومة</p>
                    </div>
                  </div>

                  {/* Most Interested Items */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
                      <Target className="w-5 h-5 text-rose-500" />
                      <h4 className="text-sm font-black text-white">أهداف العميل واهتماماته المفضلة (Most Viewed)</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {selectedUser.mostInterestedItems.length === 0 ? (
                        <p className="text-center py-6 text-xs text-neutral-600 bg-neutral-900/20 rounded-xl border border-dashed border-neutral-800">لا توجد منتجات محددة في سجل الاهتمامات بعد</p>
                      ) : (
                        selectedUser.mostInterestedItems.map((item, idx) => (
                          <div key={item.id} className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-xs font-black text-neutral-400">
                                #{idx + 1}
                              </div>
                              <span className="text-xs font-bold text-white">{item.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-indigo-400">{item.count} مشاهدة</span>
                              <div className="w-24 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(100, (item.count / 10) * 100)}%` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  className="h-full bg-indigo-500 rounded-full" 
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Path History / Journey */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
                      <Users className="w-5 h-5 text-indigo-500" />
                      <h4 className="text-sm font-black text-white">رحلة العميل الأخيرة (User Journey)</h4>
                    </div>
                    
                    <div className="space-y-3 relative">
                      <div className="absolute top-0 bottom-0 right-4 w-px bg-neutral-800" />
                      {selectedUser.pathHistory.slice().reverse().map((path, idx) => (
                        <div key={idx} className="relative pr-10 flex flex-col">
                          <div className={`absolute right-2.5 top-1 w-3 h-3 rounded-full border-2 border-[#0B0B0B] z-10 ${
                            path.type === 'page_view' ? 'bg-indigo-500' : 'bg-emerald-500'
                          }`} />
                          <div className="flex items-baseline justify-between mb-1">
                            <span className="text-[11px] font-black text-white">{path.title}</span>
                            <span className="text-[9px] text-neutral-600 font-mono">{new Date(path.timestamp).toLocaleTimeString('ar-EG')}</span>
                          </div>
                          <span className="text-[9px] text-neutral-500 font-medium">
                            {path.type === 'page_view' ? 'زيارة صفحة رئيسية' : 'تفاعل مع عنصر محدد'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-neutral-900 border-t border-neutral-800 text-[9px] text-neutral-500 flex items-center justify-between font-bold">
           <span>نظام الحماية والذكاء للصناعات السكرية © ٢٠٢٦</span>
           <div className="flex items-center gap-3">
             <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> متصل بالنظام المركزي</span>
             <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> مزامنة حية</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
