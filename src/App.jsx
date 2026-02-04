import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LogIn, TrendingUp, TrendingDown, Users, Target, BarChart3, PlusCircle, Trash2, Eye, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const DEPTS = ['Lowquotes Life', 'Lowquotes Mortgages', 'Lowquotes Financial Planning', 'True Wealth', 'Low', 'Lowquotes Health'];
const SOURCES = ['Meta', 'TikTok', 'Social Organic'];

const EuroIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10h12M4 14h12M6 6a8 8 0 1 1 0 12"/>
  </svg>
);

const DatePicker = ({ dateRange, setDateRange, compareRange, setCompareRange, compareEnabled, setCompareEnabled, onClose }) => {
  const [viewMonth, setViewMonth] = useState(new Date());
  const [selecting, setSelecting] = useState('start');
  const [isCompare, setIsCompare] = useState(false);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;
    const arr = [];
    for (let i = 0; i < startDay; i++) arr.push(null);
    for (let i = 1; i <= daysInMonth; i++) arr.push(new Date(year, month, i));
    return arr;
  };

  const formatInput = (d) => d ? `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}` : '';

  const isInRange = (day, range) => {
    if (!day || !range.start || !range.end) return false;
    return day >= range.start && day <= range.end;
  };

  const isStart = (day, range) => day && range.start && day.toDateString() === range.start.toDateString();
  const isEnd = (day, range) => day && range.end && day.toDateString() === range.end.toDateString();

  const handleDayClick = (day) => {
    if (!day) return;
    const targetRange = isCompare ? compareRange : dateRange;
    const setTargetRange = isCompare ? setCompareRange : setDateRange;
    
    if (selecting === 'start') {
      setTargetRange({ start: day, end: targetRange.end && day <= targetRange.end ? targetRange.end : day });
      setSelecting('end');
    } else {
      if (day >= targetRange.start) {
        setTargetRange({ ...targetRange, end: day });
      } else {
        setTargetRange({ start: day, end: targetRange.start });
      }
      setSelecting('start');
    }
  };

  const prevMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1));
  const nextMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1));

  const renderMonth = (offset = 0) => {
    const monthDate = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + offset);
    const daysArr = getDaysInMonth(monthDate);
    
    return (
      <div style={{ width: '200px' }}>
        <div style={{ textAlign: 'center', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
          {monthNames[monthDate.getMonth()]} {monthDate.getFullYear()}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
          {dayNames.map((d, i) => (
            <div key={i} style={{ textAlign: 'center', color: '#64748b', fontSize: '11px', padding: '4px 0' }}>{d}</div>
          ))}
          {daysArr.map((day, i) => {
            const inMain = isInRange(day, dateRange);
            const inComp = compareEnabled && isInRange(day, compareRange);
            const isMainStart = isStart(day, dateRange);
            const isMainEnd = isEnd(day, dateRange);
            const isCompStart = compareEnabled && isStart(day, compareRange);
            const isCompEnd = compareEnabled && isEnd(day, compareRange);
            
            let bg = 'transparent';
            let color = '#fff';
            if (inMain) bg = 'rgba(59, 130, 246, 0.3)';
            if (inComp) bg = 'rgba(245, 158, 11, 0.3)';
            if (isMainStart || isMainEnd) { bg = '#3b82f6'; color = '#fff'; }
            if (isCompStart || isCompEnd) { bg = '#f59e0b'; color = '#fff'; }
            
            return (
              <div 
                key={i} 
                onClick={() => handleDayClick(day)}
                style={{
                  textAlign: 'center',
                  padding: '6px 0',
                  fontSize: '13px',
                  cursor: day ? 'pointer' : 'default',
                  borderRadius: (isMainStart || isMainEnd || isCompStart || isCompEnd) ? '50%' : '4px',
                  backgroundColor: bg,
                  color: day ? color : 'transparent',
                }}
              >
                {day ? day.getDate() : ''}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      position: 'absolute',
      top: '100%',
      left: '0',
      marginTop: '8px',
      backgroundColor: '#1e293b',
      border: '1px solid #475569',
      borderRadius: '12px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      zIndex: 50,
      padding: '16px',
    }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Start date</label>
            <div 
              onClick={() => { setIsCompare(false); setSelecting('start'); }}
              style={{
                backgroundColor: '#334155',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '14px',
                cursor: 'pointer',
                border: !isCompare && selecting === 'start' ? '2px solid #3b82f6' : '2px solid transparent',
              }}
            >
              {formatInput(dateRange.start)}
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>End date</label>
            <div 
              onClick={() => { setIsCompare(false); setSelecting('end'); }}
              style={{
                backgroundColor: '#334155',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '14px',
                cursor: 'pointer',
                border: !isCompare && selecting === 'end' ? '2px solid #3b82f6' : '2px solid transparent',
              }}
            >
              {formatInput(dateRange.end)}
            </div>
          </div>
          <div style={{ borderTop: '1px solid #475569', paddingTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px' }}>Compare</span>
              <button 
                onClick={() => setCompareEnabled(!compareEnabled)} 
                style={{
                  width: '40px',
                  height: '20px',
                  borderRadius: '10px',
                  backgroundColor: compareEnabled ? '#3b82f6' : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: compareEnabled ? '22px' : '2px',
                  transition: 'left 0.2s',
                }}/>
              </button>
            </div>
            {compareEnabled && (
              <>
                <div style={{ marginTop: '8px' }}>
                  <label style={{ fontSize: '12px', color: '#f59e0b', display: 'block', marginBottom: '4px' }}>Compare start</label>
                  <div 
                    onClick={() => { setIsCompare(true); setSelecting('start'); }}
                    style={{
                      backgroundColor: '#334155',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      border: isCompare && selecting === 'start' ? '2px solid #f59e0b' : '2px solid rgba(245, 158, 11, 0.5)',
                    }}
                  >
                    {formatInput(compareRange.start)}
                  </div>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <label style={{ fontSize: '12px', color: '#f59e0b', display: 'block', marginBottom: '4px' }}>Compare end</label>
                  <div 
                    onClick={() => { setIsCompare(true); setSelecting('end'); }}
                    style={{
                      backgroundColor: '#334155',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      border: isCompare && selecting === 'end' ? '2px solid #f59e0b' : '2px solid rgba(245, 158, 11, 0.5)',
                    }}
                  >
                    {formatInput(compareRange.end)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <button onClick={prevMonth} style={{ padding: '4px', cursor: 'pointer', background: 'none', border: 'none', color: '#fff' }}>
              <ChevronLeft style={{ width: '16px', height: '16px' }}/>
            </button>
            <button onClick={nextMonth} style={{ padding: '4px', cursor: 'pointer', background: 'none', border: 'none', color: '#fff' }}>
              <ChevronRight style={{ width: '16px', height: '16px' }}/>
            </button>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {renderMonth(0)}
            {renderMonth(1)}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #475569' }}>
        <button onClick={onClose} style={{ padding: '6px 16px', fontSize: '14px', cursor: 'pointer', background: 'none', border: 'none', color: '#fff', borderRadius: '6px' }}>Cancel</button>
        <button onClick={onClose} style={{ padding: '6px 16px', fontSize: '14px', cursor: 'pointer', backgroundColor: '#3b82f6', border: 'none', color: '#fff', borderRadius: '6px' }}>Apply</button>
      </div>
    </div>
  );
};

const KpiCard = ({ icon: Icon, label, value, prefix = '', compareValue, gradient }) => {
  const change = compareValue !== null && compareValue !== 0 ? ((value - compareValue) / compareValue * 100) : null;
  const isUp = change > 0;
  return (
    <div className={`${gradient} rounded-xl p-4`}>
      {Icon ? <Icon className="w-6 h-6 mb-2 opacity-80"/> : <EuroIcon className="w-6 h-6 mb-2 opacity-80"/>}
      <p className="text-2xl font-bold">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}</p>
      <p className="text-sm opacity-80">{label}</p>
      {change !== null && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${isUp ? 'text-emerald-300' : 'text-red-300'}`}>
          {isUp ? <TrendingUp className="w-4 h-4"/> : <TrendingDown className="w-4 h-4"/>}
          <span>{isUp ? '+' : ''}{change.toFixed(1)}%</span>
          <span className="opacity-70">vs compare</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [authErr, setAuthErr] = useState('');
  const [tab, setTab] = useState('dashboard');
  const [subTab, setSubTab] = useState('overview');
  const [leads, setLeads] = useState([]);
  const [sales, setSales] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({ start: new Date(2025, 0, 1), end: new Date() });
  const [compareRange, setCompareRange] = useState({ start: new Date(2024, 0, 1), end: new Date(2024, 11, 31) });
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [filter, setFilter] = useState({ dept: 'all', campaign: 'all', source: 'all' });
  const datePickerRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) setShowDatePicker(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const loadData = () => {
    try {
      const l = localStorage.getItem('mkt_leads');
      const s = localStorage.getItem('mkt_sales');
      const m = localStorage.getItem('mkt_monthly');
      if (l) setLeads(JSON.parse(l));
      if (s) setSales(JSON.parse(s));
      if (m) setMonthly(JSON.parse(m));
    } catch (e) {}
    setLoading(false);
  };

  const saveData = (type, data) => {
    try { localStorage.setItem(`mkt_${type}`, JSON.stringify(data)); } catch (e) {}
  };

  const login = () => {
    if (email === 'marketing@lowquotes.ie' && pass === '!Audia6me!2026') { setAuth(true); setAuthErr(''); }
    else setAuthErr('Invalid credentials');
  };

  const addLead = () => { const n = [...leads, { id: Date.now(), weekStart: '', campaign: '', dept: DEPTS[0], metaLeads: 0, crmLeads: 0, source: 'Meta', spend: 0 }]; setLeads(n); saveData('leads', n); };
  const updateLead = (id, f, v) => { const n = leads.map(l => l.id === id ? { ...l, [f]: v } : l); setLeads(n); saveData('leads', n); };
  const delLead = (id) => { const n = leads.filter(l => l.id !== id); setLeads(n); saveData('leads', n); };
  const addSale = () => { const n = [...sales, { id: Date.now(), date: '', campaign: '', dept: DEPTS[0], source: 'Meta', commission: 0 }]; setSales(n); saveData('sales', n); };
  const updateSale = (id, f, v) => { const n = sales.map(s => s.id === id ? { ...s, [f]: v } : s); setSales(n); saveData('sales', n); };
  const delSale = (id) => { const n = sales.filter(s => s.id !== id); setSales(n); saveData('sales', n); };
  const addMonthly = () => { const n = [...monthly, { id: Date.now(), month: '', campaign: '', dept: DEPTS[0], leads: 0 }]; setMonthly(n); saveData('monthly', n); };
  const updateMonthly = (id, f, v) => { const n = monthly.map(m => m.id === id ? { ...m, [f]: v } : m); setMonthly(n); saveData('monthly', n); };
  const delMonthly = (id) => { const n = monthly.filter(m => m.id !== id); setMonthly(n); saveData('monthly', n); };

  const isInDateRange = (dateStr, range) => {
    if (!dateStr || !range.start || !range.end) return false;
    const d = new Date(dateStr);
    return d >= range.start && d <= range.end;
  };

  const filterByDate = (items, dateField, range) => items.filter(i => isInDateRange(i[dateField], range));
  const filterByFilters = (items) => items.filter(i => {
    if (filter.dept !== 'all' && i.dept !== filter.dept) return false;
    if (filter.campaign !== 'all' && i.campaign !== filter.campaign) return false;
    if (filter.source !== 'all' && i.source !== filter.source) return false;
    return true;
  });

  const currentLeads = filterByFilters(filterByDate(leads, 'weekStart', dateRange));
  const currentSales = filterByFilters(filterByDate(sales, 'date', dateRange));
  const compareLeads = compareEnabled ? filterByFilters(filterByDate(leads, 'weekStart', compareRange)) : [];
  const compareSales = compareEnabled ? filterByFilters(filterByDate(sales, 'date', compareRange)) : [];

  const campaigns = [...new Set([...leads.map(l => l.campaign), ...sales.map(s => s.campaign)].filter(Boolean))];

  const calc = (l, s) => ({
    leads: l.reduce((a, x) => a + (parseInt(x.crmLeads) || 0), 0),
    sales: s.length,
    commission: s.reduce((a, x) => a + (parseFloat(x.commission) || 0), 0),
    spend: l.reduce((a, x) => a + (parseFloat(x.spend) || 0), 0),
    unpaidLeads: l.filter(x => x.source !== 'Meta').reduce((a, x) => a + (parseInt(x.crmLeads) || 0), 0),
    unpaidSales: s.filter(x => x.source !== 'Meta').length,
    unpaidComm: s.filter(x => x.source !== 'Meta').reduce((a, x) => a + (parseFloat(x.commission) || 0), 0),
  });

  const curr = calc(currentLeads, currentSales);
  const comp = calc(compareLeads, compareSales);
  const leadToSale = curr.leads > 0 ? (curr.sales / curr.leads * 100).toFixed(1) : 0;
  const cpl = curr.leads > 0 ? (curr.spend / curr.leads).toFixed(2) : 0;
  const avgComm = curr.sales > 0 ? (curr.commission / curr.sales).toFixed(2) : 0;

  const deptData = DEPTS.map(d => ({
    name: d.replace('Lowquotes ', 'LQ '),
    leads: currentLeads.filter(l => l.dept === d).reduce((a, l) => a + (parseInt(l.crmLeads) || 0), 0),
    sales: currentSales.filter(s => s.dept === d).length,
    commission: currentSales.filter(s => s.dept === d).reduce((a, s) => a + (parseFloat(s.commission) || 0), 0),
    compLeads: compareLeads.filter(l => l.dept === d).reduce((a, l) => a + (parseInt(l.crmLeads) || 0), 0),
    compSales: compareSales.filter(s => s.dept === d).length,
  }));

  const sourceData = SOURCES.map(s => ({
    name: s,
    leads: currentLeads.filter(l => l.source === s).reduce((a, l) => a + (parseInt(l.crmLeads) || 0), 0),
    sales: currentSales.filter(sl => sl.source === s).length,
    commission: currentSales.filter(sl => sl.source === s).reduce((a, sl) => a + (parseFloat(sl.commission) || 0), 0)
  }));

  const getMonthsInRange = (range) => {
    if (!range.start || !range.end) return [];
    const months = [];
    let d = new Date(range.start.getFullYear(), range.start.getMonth(), 1);
    while (d <= range.end) {
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
      d = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    }
    return months;
  };

  const currentMonths = getMonthsInRange(dateRange);
  const compareMonths = compareEnabled ? getMonthsInRange(compareRange) : [];

  const trendData = currentMonths.map((m, i) => ({
    month: m.substring(5),
    leads: leads.filter(l => l.weekStart?.startsWith(m)).reduce((a, l) => a + (parseInt(l.crmLeads) || 0), 0),
    sales: sales.filter(s => s.date?.startsWith(m)).length,
    commission: sales.filter(s => s.date?.startsWith(m)).reduce((a, s) => a + (parseFloat(s.commission) || 0), 0),
    compLeads: compareMonths[i] ? leads.filter(l => l.weekStart?.startsWith(compareMonths[i])).reduce((a, l) => a + (parseInt(l.crmLeads) || 0), 0) : null,
    compSales: compareMonths[i] ? sales.filter(s => s.date?.startsWith(compareMonths[i])).length : null,
    compCommission: compareMonths[i] ? sales.filter(s => s.date?.startsWith(compareMonths[i])).reduce((a, s) => a + (parseFloat(s.commission) || 0), 0) : null,
  }));

  const formatDateRange = (r) => {
    if (!r.start || !r.end) return 'Select dates';
    const f = (d) => `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
    return `${f(r.start)} - ${f(r.end)}`;
  };

  if (!auth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Marketing Analytics</h1>
            <p className="text-blue-200 text-sm mt-1">True Financial Ltd.</p>
          </div>
          <div className="space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {authErr && <p className="text-red-400 text-sm">{authErr}</p>}
            <button onClick={login} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition">
              <LogIn className="w-5 h-5" /> Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <span className="font-bold">Marketing Analytics</span>
          </div>
          <div className="flex gap-1">
            {['dashboard', 'leads', 'sales', 'monthly'].map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t ? 'bg-blue-500' : 'hover:bg-slate-700'}`}>
                {t === 'dashboard' ? 'Dashboard' : t === 'leads' ? 'Lead Data' : t === 'sales' ? 'Sales Data' : 'Monthly'}
              </button>
            ))}
          </div>
          <button onClick={() => setAuth(false)} className="text-slate-400 hover:text-white text-sm">Logout</button>
        </div>
      </nav>

      <div className="p-6">
        {tab === 'dashboard' && (
          <>
            <div className="flex gap-2 mb-6">
              <button onClick={() => setSubTab('overview')} className={`px-4 py-2 rounded-lg font-medium ${subTab === 'overview' ? 'bg-blue-500' : 'bg-slate-800 hover:bg-slate-700'}`}>
                <Eye className="w-4 h-4 inline mr-2" />Overview
              </button>
              <button onClick={() => setSubTab('visuals')} className={`px-4 py-2 rounded-lg font-medium ${subTab === 'visuals' ? 'bg-blue-500' : 'bg-slate-800 hover:bg-slate-700'}`}>
                <BarChart3 className="w-4 h-4 inline mr-2" />Visuals
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mb-6 p-4 bg-slate-800 rounded-xl items-start">
              <div className="relative" ref={datePickerRef}>
                <button onClick={() => setShowDatePicker(!showDatePicker)} className="bg-slate-700 hover:bg-slate-600 rounded-lg px-4 py-2 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDateRange(dateRange)}
                  {compareEnabled && <span className="text-amber-400 ml-2">vs {formatDateRange(compareRange)}</span>}
                </button>
                {showDatePicker && (
                  <DatePicker dateRange={dateRange} setDateRange={setDateRange} compareRange={compareRange} setCompareRange={setCompareRange} compareEnabled={compareEnabled} setCompareEnabled={setCompareEnabled} onClose={() => setShowDatePicker(false)} />
                )}
              </div>
              <select value={filter.dept} onChange={e => setFilter({ ...filter, dept: e.target.value })} className="bg-slate-700 border-0 rounded-lg px-3 py-2 text-sm">
                <option value="all">All Departments</option>
                {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={filter.campaign} onChange={e => setFilter({ ...filter, campaign: e.target.value })} className="bg-slate-700 border-0 rounded-lg px-3 py-2 text-sm">
                <option value="all">All Campaigns</option>
                {campaigns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={filter.source} onChange={e => setFilter({ ...filter, source: e.target.value })} className="bg-slate-700 border-0 rounded-lg px-3 py-2 text-sm">
                <option value="all">All Sources</option>
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {subTab === 'overview' && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <KpiCard icon={Users} label="CRM Leads" value={curr.leads} compareValue={compareEnabled ? comp.leads : null} gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
                  <KpiCard icon={Target} label="Sales" value={curr.sales} compareValue={compareEnabled ? comp.sales : null} gradient="bg-gradient-to-br from-emerald-500 to-emerald-600" />
                  <KpiCard icon={null} label="Commission" value={curr.commission} prefix="€" compareValue={compareEnabled ? comp.commission : null} gradient="bg-gradient-to-br from-amber-500 to-amber-600" />
                  <KpiCard icon={TrendingUp} label="Lead to Sale" value={`${leadToSale}%`} compareValue={null} gradient="bg-gradient-to-br from-purple-500 to-purple-600" />
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-800 rounded-xl p-4">
                    <p className="text-slate-400 text-sm">Ad Spend</p>
                    <p className="text-xl font-bold">€{curr.spend.toLocaleString()}</p>
                    {compareEnabled && comp.spend > 0 && <p className={`text-sm ${curr.spend > comp.spend ? 'text-red-400' : 'text-emerald-400'}`}>{curr.spend > comp.spend ? '↑' : '↓'} {((curr.spend - comp.spend) / comp.spend * 100).toFixed(1)}%</p>}
                  </div>
                  <div className="bg-slate-800 rounded-xl p-4">
                    <p className="text-slate-400 text-sm">Cost per Lead</p>
                    <p className="text-xl font-bold">€{cpl}</p>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-4">
                    <p className="text-slate-400 text-sm">Avg Commission</p>
                    <p className="text-xl font-bold">€{avgComm}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 rounded-xl p-5 mb-6 border border-emerald-700/50">
                  <h3 className="font-semibold text-emerald-400 mb-3">📱 Unpaid Social Performance</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-2xl font-bold">{curr.unpaidLeads}</p>
                      <p className="text-sm text-slate-400">Leads</p>
                      {compareEnabled && comp.unpaidLeads > 0 && <p className={`text-xs ${curr.unpaidLeads > comp.unpaidLeads ? 'text-emerald-400' : 'text-red-400'}`}>{curr.unpaidLeads > comp.unpaidLeads ? '↑' : '↓'}{((curr.unpaidLeads - comp.unpaidLeads) / comp.unpaidLeads * 100).toFixed(0)}%</p>}
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{curr.unpaidSales}</p>
                      <p className="text-sm text-slate-400">Sales</p>
                      {compareEnabled && comp.unpaidSales > 0 && <p className={`text-xs ${curr.unpaidSales > comp.unpaidSales ? 'text-emerald-400' : 'text-red-400'}`}>{curr.unpaidSales > comp.unpaidSales ? '↑' : '↓'}{((curr.unpaidSales - comp.unpaidSales) / comp.unpaidSales * 100).toFixed(0)}%</p>}
                    </div>
                    <div>
                      <p className="text-2xl font-bold">€{curr.unpaidComm.toLocaleString()}</p>
                      <p className="text-sm text-slate-400">Commission</p>
                      {compareEnabled && comp.unpaidComm > 0 && <p className={`text-xs ${curr.unpaidComm > comp.unpaidComm ? 'text-emerald-400' : 'text-red-400'}`}>{curr.unpaidComm > comp.unpaidComm ? '↑' : '↓'}{((curr.unpaidComm - comp.unpaidComm) / comp.unpaidComm * 100).toFixed(0)}%</p>}
                    </div>
                  </div>
                  <p className="text-sm text-emerald-300 mt-3">{curr.sales > 0 ? ((curr.unpaidSales / curr.sales) * 100).toFixed(1) : 0}% of total sales from organic</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-800 rounded-xl p-4">
                    <h3 className="font-semibold mb-4">By Department</h3>
                    <div className="space-y-2">
                      {deptData.map((d, i) => (
                        <div key={d.name} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></span>
                            {d.name}
                          </span>
                          <span>{d.leads} leads / {d.sales} sales / €{d.commission.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-4">
                    <h3 className="font-semibold mb-4">By Source</h3>
                    <div className="space-y-2">
                      {sourceData.map((s) => (
                        <div key={s.name} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs ${s.name === 'Meta' ? 'bg-blue-500' : 'bg-emerald-500'}`}>{s.name === 'Meta' ? 'Paid' : 'Organic'}</span>
                            {s.name}
                          </span>
                          <span>{s.leads} leads / {s.sales} sales / €{s.commission.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {subTab === 'visuals' && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-xl p-5">
                  <h3 className="font-semibold mb-4">Leads & Sales Over Time {compareEnabled && <span className="text-sm font-normal text-slate-400">(dotted = comparison period)</span>}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }} />
                      <Legend />
                      <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} name="Leads" />
                      <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} name="Sales" />
                      {compareEnabled && <Line type="monotone" dataKey="compLeads" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Leads (compare)" />}
                      {compareEnabled && <Line type="monotone" dataKey="compSales" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Sales (compare)" />}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-slate-800 rounded-xl p-5">
                  <h3 className="font-semibold mb-4">Commission Over Time (€)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }} formatter={(v) => `€${v?.toLocaleString() || 0}`} />
                      <Legend />
                      <Bar dataKey="commission" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Commission" />
                      {compareEnabled && <Bar dataKey="compCommission" fill="#f59e0b" fillOpacity={0.4} radius={[4, 4, 0, 0]} name="Commission (compare)" />}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-800 rounded-xl p-5">
                    <h3 className="font-semibold mb-4">Leads by Department</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={deptData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis type="number" stroke="#94a3b8" />
                        <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }} />
                        <Legend />
                        <Bar dataKey="leads" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Current" />
                        {compareEnabled && <Bar dataKey="compLeads" fill="#3b82f6" fillOpacity={0.4} radius={[0, 4, 4, 0]} name="Compare" />}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-5">
                    <h3 className="font-semibold mb-4">Sales by Source</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={sourceData.filter(s => s.sales > 0)} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="sales" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'leads' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Lead Data (Weekly)</h2>
              <button onClick={addLead} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"><PlusCircle className="w-4 h-4" /> Add Entry</button>
            </div>
            <div className="bg-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-3 py-3 text-left">Week Start</th>
                      <th className="px-3 py-3 text-left">Campaign</th>
                      <th className="px-3 py-3 text-left">Department</th>
                      <th className="px-3 py-3 text-left">Meta Leads</th>
                      <th className="px-3 py-3 text-left">CRM Leads</th>
                      <th className="px-3 py-3 text-left">Source</th>
                      <th className="px-3 py-3 text-left">Spend €</th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(l => (
                      <tr key={l.id} className="border-t border-slate-700">
                        <td className="px-3 py-2"><input type="date" value={l.weekStart} onChange={e => updateLead(l.id, 'weekStart', e.target.value)} className="bg-slate-700 rounded px-2 py-1 w-36" /></td>
                        <td className="px-3 py-2"><input type="text" value={l.campaign} onChange={e => updateLead(l.id, 'campaign', e.target.value)} placeholder="Campaign name" className="bg-slate-700 rounded px-2 py-1 w-40" /></td>
                        <td className="px-3 py-2"><select value={l.dept} onChange={e => updateLead(l.id, 'dept', e.target.value)} className="bg-slate-700 rounded px-2 py-1">{DEPTS.map(d => <option key={d}>{d}</option>)}</select></td>
                        <td className="px-3 py-2"><input type="number" value={l.metaLeads} onChange={e => updateLead(l.id, 'metaLeads', e.target.value)} className="bg-slate-700 rounded px-2 py-1 w-20" /></td>
                        <td className="px-3 py-2"><input type="number" value={l.crmLeads} onChange={e => updateLead(l.id, 'crmLeads', e.target.value)} className="bg-slate-700 rounded px-2 py-1 w-20" /></td>
                        <td className="px-3 py-2"><select value={l.source} onChange={e => updateLead(l.id, 'source', e.target.value)} className="bg-slate-700 rounded px-2 py-1">{SOURCES.map(s => <option key={s}>{s}</option>)}</select></td>
                        <td className="px-3 py-2"><input type="number" value={l.spend} onChange={e => updateLead(l.id, 'spend', e.target.value)} className="bg-slate-700 rounded px-2 py-1 w-24" /></td>
                        <td className="px-3 py-2"><button onClick={() => delLead(l.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {leads.length === 0 && <p className="text-center py-8 text-slate-400">No lead data yet. Click "Add Entry" to start.</p>}
            </div>
          </div>
        )}

        {tab === 'sales' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Sales Data</h2>
              <button onClick={addSale} className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"><PlusCircle className="w-4 h-4" /> Add Sale</button>
            </div>
            <div className="bg-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-3 py-3 text-left">Date of Sale</th>
                      <th className="px-3 py-3 text-left">Campaign</th>
                      <th className="px-3 py-3 text-left">Department</th>
                      <th className="px-3 py-3 text-left">Source</th>
                      <th className="px-3 py-3 text-left">Commission €</th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map(s => (
                      <tr key={s.id} className="border-t border-slate-700">
                        <td className="px-3 py-2"><input type="date" value={s.date} onChange={e => updateSale(s.id, 'date', e.target.value)} className="bg-slate-700 rounded px-2 py-1 w-36" /></td>
                        <td className="px-3 py-2"><input type="text" value={s.campaign} onChange={e => updateSale(s.id, 'campaign', e.target.value)} placeholder="Campaign name" className="bg-slate-700 rounded px-2 py-1 w-40" /></td>
                        <td className="px-3 py-2"><select value={s.dept} onChange={e => updateSale(s.id, 'dept', e.target.value)} className="bg-slate-700 rounded px-2 py-1">{DEPTS.map(d => <option key={d}>{d}</option>)}</select></td>
                        <td className="px-3 py-2"><select value={s.source} onChange={e => updateSale(s.id, 'source', e.target.value)} className="bg-slate-700 rounded px-2 py-1">{SOURCES.map(s => <option key={s}>{s}</option>)}</select></td>
                        <td className="px-3 py-2"><input type="number" value={s.commission} onChange={e => updateSale(s.id, 'commission', e.target.value)} className="bg-slate-700 rounded px-2 py-1 w-28" /></td>
                        <td className="px-3 py-2"><button onClick={() => delSale(s.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {sales.length === 0 && <p className="text-center py-8 text-slate-400">No sales data yet. Click "Add Sale" to start.</p>}
            </div>
          </div>
        )}

        {tab === 'monthly' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Monthly Overrides</h2>
                <p className="text-sm text-slate-400">Use at end of month to override weekly lead totals</p>
              </div>
              <button onClick={addMonthly} className="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"><PlusCircle className="w-4 h-4" /> Add Override</button>
            </div>
            <div className="bg-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-3 py-3 text-left">Month</th>
                      <th className="px-3 py-3 text-left">Campaign</th>
                      <th className="px-3 py-3 text-left">Department</th>
                      <th className="px-3 py-3 text-left">Monthly Lead Count</th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthly.map(m => (
                      <tr key={m.id} className="border-t border-slate-700">
                        <td className="px-3 py-2"><input type="month" value={m.month} onChange={e => updateMonthly(m.id, 'month', e.target.value)} className="bg-slate-700 rounded px-2 py-1 w-36" /></td>
                        <td className="px-3 py-2"><input type="text" value={m.campaign} onChange={e => updateMonthly(m.id, 'campaign', e.target.value)} placeholder="Campaign name" className="bg-slate-700 rounded px-2 py-1 w-40" /></td>
                        <td className="px-3 py-2"><select value={m.dept} onChange={e => updateMonthly(m.id, 'dept', e.target.value)} className="bg-slate-700 rounded px-2 py-1">{DEPTS.map(d => <option key={d}>{d}</option>)}</select></td>
                        <td className="px-3 py-2"><input type="number" value={m.leads} onChange={e => updateMonthly(m.id, 'leads', e.target.value)} className="bg-slate-700 rounded px-2 py-1 w-28" /></td>
                        <td className="px-3 py-2"><button onClick={() => delMonthly(m.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {monthly.length === 0 && <p className="text-center py-8 text-slate-400">No monthly overrides yet.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
