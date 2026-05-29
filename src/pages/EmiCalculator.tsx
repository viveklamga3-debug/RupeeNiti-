import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend } from 'recharts';
import { Link, Copy } from 'lucide-react';
import { AdPlaceholder } from '@/src/components/AdPlaceholder';

const TABS = [
  { id: 'home', title: 'Home Loan', defaults: { amount: 5000000, rate: 8.5, tenure: 20 }, range: { amount: [500000, 50000000], rate: [6, 15], tenure: [1, 30] } },
  { id: 'car', title: 'Car Loan', defaults: { amount: 800000, downPayment: 20, rate: 9.5, tenure: 5 }, range: { amount: [300000, 5000000], downPayment: [10, 50], rate: [7, 18], tenure: [1, 7] } },
  { id: 'personal', title: 'Personal Loan', defaults: { amount: 500000, rate: 14, tenure: 3 }, range: { amount: [50000, 5000000], rate: [10, 36], tenure: [1, 5] } }
];

const COLORS = ['#16A34A', '#DC2626']; // Green for Principal, Red for Interest

function formatCurrency(v: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(v));
}

export function EmiCalculator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initTab = searchParams.get('tab') || 'home';
  const initAmount = Number(searchParams.get('amount'));
  const initRate = Number(searchParams.get('rate'));
  const initTenure = Number(searchParams.get('tenure'));
  const initDp = Number(searchParams.get('dp'));

  const [activeTab, setActiveTab] = useState(initTab);
  
  const currentTabDef = TABS.find(t => t.id === activeTab) || TABS[0];
  
  const [amount, setAmount] = useState(initAmount || currentTabDef.defaults.amount);
  const [rate, setRate] = useState(initRate || currentTabDef.defaults.rate);
  const [tenure, setTenure] = useState(initTenure || currentTabDef.defaults.tenure); // in years
  const [downPayment, setDownPayment] = useState(initDp || currentTabDef.defaults.downPayment || 0); // %

  const [schedulePage, setSchedulePage] = useState(0);

  // When tab changes, reset to distinct defaults if not initialized by URL
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const def = TABS.find(t => t.id === tabId)!;
    setAmount(def.defaults.amount);
    setRate(def.defaults.rate);
    setTenure(def.defaults.tenure);
    if(def.defaults.downPayment) setDownPayment(def.defaults.downPayment);
  };

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('tab', activeTab);
    params.set('amount', amount.toString());
    params.set('rate', rate.toString());
    params.set('tenure', tenure.toString());
    if (activeTab === 'car') params.set('dp', downPayment.toString());
    setSearchParams(params, { replace: true });
  }, [activeTab, amount, rate, tenure, downPayment]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Shareable link copied to clipboard!');
  };

  const { p, e, totalInterest, totalPayable, schedule, yearlyData } = useMemo(() => {
    let principal = amount;
    if (activeTab === 'car') {
      principal = amount - (amount * (downPayment / 100));
    }
    
    // P x R x (1+R)^N / [(1+R)^N-1]
    const r = rate / 12 / 100;
    const n = tenure * 12;
    let emi = 0;
    
    if (r > 0 && n > 0 && principal > 0) {
      emi = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    }

    const tPbl = emi * n;
    const tInt = tPbl - principal;

    // Amortization Schedule
    let bal = principal;
    const sched = [];
    const yrData = [];
    let curYrInt = 0;
    let curYrPrin = 0;

    for (let i = 1; i <= n; i++) {
      const interestForMonth = bal * r;
      const principalForMonth = emi - interestForMonth;
      bal -= principalForMonth;
      
      sched.push({
        month: i,
        emi: emi,
        principal: principalForMonth,
        interest: interestForMonth,
        balance: Math.max(0, bal)
      });

      curYrInt += interestForMonth;
      curYrPrin += principalForMonth;

      if (i % 12 === 0 || i === n) {
        yrData.push({
          year: `Yr ${Math.ceil(i/12)}`,
          Principal: Math.round(curYrPrin),
          Interest: Math.round(curYrInt),
          Balance: Math.max(0, Math.round(bal))
        });
        curYrInt = 0;
        curYrPrin = 0;
      }
    }

    return { p: principal, e: emi, totalInterest: tInt, totalPayable: tPbl, schedule: sched, yearlyData: yrData };
  }, [amount, rate, tenure, downPayment, activeTab]);

  const pieData = [
    { name: 'Principal Loan', value: p },
    { name: 'Total Interest', value: totalInterest }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Helmet>
        <title>EMI Calculator India 2026 — Home, Car and Personal Loan | RupeeNiti</title>
        <meta name="description" content="Calculate your monthly EMI instantly. Home loan, car loan, personal loan EMI calculator with amortization schedule. Free, no login." />
      </Helmet>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#14532D]">EMI Calculator</h1>
        <p className="text-gray-600 mt-2">Calculate EMI for Home, Car, and Personal loans instantly.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Panel - Inputs */}
        <div className="lg:w-3/5 bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 min-w-[120px] py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id 
                  ? 'border-[#16A34A] text-[#14532D] bg-[#F0FDF4]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-8">
            {/* Input: Amount */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-medium text-gray-700">{activeTab === 'car' ? 'Car Price' : 'Loan Amount'}</label>
                <div className="flex items-center text-lg font-semibold bg-gray-50 border border-gray-300 rounded px-3 py-1 w-32 md:w-40">
                  <span className="text-gray-500 mr-1">₹</span>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>
              <input 
                type="range" min={currentTabDef.range.amount[0]} max={currentTabDef.range.amount[1]} step="10000"
                value={amount} onChange={e => setAmount(Number(e.target.value))}
                className="w-full accent-[#16A34A]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{formatCurrency(currentTabDef.range.amount[0])}</span>
                <span>{formatCurrency(currentTabDef.range.amount[1])}</span>
              </div>
            </div>

            {/* Input: Down Payment (Only for Car) */}
            {activeTab === 'car' && (
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-medium text-gray-700">Down Payment</label>
                  <div className="flex items-center text-lg font-semibold bg-gray-50 border border-gray-300 rounded px-3 py-1 w-32 md:w-40">
                    <input 
                      type="number" 
                      value={downPayment} 
                      onChange={e => setDownPayment(Number(e.target.value))}
                      className="w-full bg-transparent focus:outline-none text-right"
                    />
                    <span className="text-gray-500 ml-1">%</span>
                  </div>
                </div>
                <input 
                  type="range" min="0" max="80" step="5"
                  value={downPayment} onChange={e => setDownPayment(Number(e.target.value))}
                  className="w-full accent-[#16A34A]"
                />
                <div className="flex justify-between text-xs text-[#16A34A] font-medium mt-1">
                  <span>Down payment amount: {formatCurrency(amount * (downPayment / 100))}</span>
                  <span>Required Loan: {formatCurrency(p)}</span>
                </div>
              </div>
            )}

            {/* Input: Interest Rate */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-medium text-gray-700">Interest Rate</label>
                <div className="flex items-center text-lg font-semibold bg-gray-50 border border-gray-300 rounded px-3 py-1 w-32 md:w-40">
                  <input 
                    type="number" 
                    value={rate} 
                    onChange={e => setRate(Number(e.target.value))}
                    step="0.1"
                    className="w-full bg-transparent focus:outline-none text-right"
                  />
                  <span className="text-gray-500 ml-1">% p.a.</span>
                </div>
              </div>
              <input 
                type="range" min={currentTabDef.range.rate[0]} max={currentTabDef.range.rate[1]} step="0.1"
                value={rate} onChange={e => setRate(Number(e.target.value))}
                className="w-full accent-[#16A34A]"
              />
            </div>

            {/* Input: Tenure */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-medium text-gray-700">Loan Tenure</label>
                <div className="flex items-center text-lg font-semibold bg-gray-50 border border-gray-300 rounded px-3 py-1 w-32 md:w-40">
                  <input 
                    type="number" 
                    value={tenure} 
                    onChange={e => setTenure(Number(e.target.value))}
                    className="w-full bg-transparent focus:outline-none text-right"
                  />
                  <span className="text-gray-500 ml-2">Years</span>
                </div>
              </div>
              <input 
                type="range" min={currentTabDef.range.tenure[0]} max={currentTabDef.range.tenure[1]} step="1"
                value={tenure} onChange={e => setTenure(Number(e.target.value))}
                className="w-full accent-[#16A34A]"
              />
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
              <button onClick={copyLink} className="flex items-center text-sm text-[#16A34A] font-medium hover:text-green-700">
                <Copy className="w-4 h-4 mr-1" /> Copy Shareable Link
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="lg:w-2/5 space-y-6">
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-[#14532D] mb-4">Loan Breakdown</h3>
            
            <div className="text-center bg-[#F0FDF4] border border-[#16A34A]/30 rounded-lg p-6 mb-6">
              <p className="text-sm font-semibold text-gray-600 mb-1">Monthly EMI</p>
              <p className="text-4xl sm:text-5xl font-extrabold text-[#16A34A]">{formatCurrency(e)}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-[#16A34A] mr-2"></div><span className="text-gray-600">Principal Amount</span></div>
                <span className="font-semibold">{formatCurrency(p)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-[#DC2626] mr-2"></div><span className="text-gray-600">Total Interest</span></div>
                <span className="font-semibold text-[#DC2626]">{formatCurrency(totalInterest)}</span>
              </div>
              <div className="flex justify-between items-center py-2 bg-gray-50 px-2 rounded">
                <span className="font-semibold text-gray-800">Total Payable</span>
                <span className="font-bold text-gray-900">{formatCurrency(totalPayable)}</span>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="h-64 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ad Placeholder sidebar desktop */}
          <div className="hidden lg:flex justify-center">
             <AdPlaceholder format="rectangle" className="bg-white rounded-lg p-0" />
          </div>
        </div>

      </div>
      
      {/* Mid-page Responsive Ad */}
      <div className="my-10 w-full flex justify-center">
        <AdPlaceholder format="responsive" className="bg-white w-full rounded" />
      </div>

      {/* Year-wise Graph */}
      <div className="mt-12 bg-white shadow-sm border border-gray-200 rounded-xl p-4 sm:p-6 overflow-hidden">
        <h3 className="text-xl sm:text-2xl font-bold text-[#14532D] mb-6">Year-wise Principal & Interest Breakdown</h3>
        <div className="w-full">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} minTickGap={15} />
                <YAxis tickFormatter={(val) => `₹${val/100000}L`} width={60} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="Principal" stackId="a" fill="#16A34A" />
                <Bar dataKey="Interest" stackId="a" fill="#DC2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Table */}
      <div className="mt-12 bg-white shadow-sm border border-gray-200 rounded-xl p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-[#14532D]">Full Amortization Schedule</h3>
          <div className="text-sm font-medium border border-gray-300 rounded overflow-hidden flex cursor-pointer">
             <span className="px-3 py-1 bg-[#16A34A] text-white">Monthly</span>
             {/* Note: Year-wise toggle functionality could be added here */}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Month</th>
                <th className="px-6 py-4 font-semibold">Principal Paid</th>
                <th className="px-6 py-4 font-semibold">Interest Paid</th>
                <th className="px-6 py-4 font-semibold">Total Payment (EMI)</th>
                <th className="px-6 py-4 font-semibold">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schedule.slice(schedulePage * 12, (schedulePage + 1) * 12).map((row, idx) => (
                <tr key={idx} className={row.principal > row.interest ? "bg-green-50/30" : "hover:bg-gray-50"}>
                  <td className="px-6 py-4">{row.month}</td>
                  <td className="px-6 py-4">{formatCurrency(row.principal)}</td>
                  <td className="px-6 py-4 text-red-600">{formatCurrency(row.interest)}</td>
                  <td className="px-6 py-4 font-medium">{formatCurrency(row.emi)}</td>
                  <td className="px-6 py-4">{formatCurrency(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
          <button 
            onClick={() => setSchedulePage(Math.max(0, schedulePage - 1))}
            disabled={schedulePage === 0}
            className="px-4 py-2 border border-gray-300 rounded bg-white disabled:opacity-50 hover:bg-gray-50"
          >
            Prev Year
          </button>
          <span className="text-sm font-medium text-gray-600">Year {schedulePage + 1} of {Math.ceil(schedule.length / 12)}</span>
          <button 
            onClick={() => setSchedulePage(Math.min(Math.ceil(schedule.length / 12) - 1, schedulePage + 1))}
            disabled={schedulePage === Math.ceil(schedule.length / 12) - 1}
            className="px-4 py-2 border border-gray-300 rounded bg-white disabled:opacity-50 hover:bg-gray-50"
          >
            Next Year
          </button>
        </div>
      </div>

    </div>
  );
}
