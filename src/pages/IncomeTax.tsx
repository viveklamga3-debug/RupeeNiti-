import React, { useState, useMemo, useRef } from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend, ResponsiveContainer } from 'recharts';
import { Download, AlertCircle, Info, Calculator } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AdPlaceholder } from '@/src/components/AdPlaceholder';
import { SEO } from '@/src/components/SEO';

function formatCurrency(v: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(v));
}

// Income Tax FY 2025-26 rules
const calcOldRegimeTax = (income: number, ageCategory: '<60' | '60-80' | '>80') => {
  let exemption = 250000;
  if (ageCategory === '60-80') exemption = 300000;
  if (ageCategory === '>80') exemption = 500000;

  if (income <= exemption) return 0;
  
  if (income <= 500000) {
    // Eligible for 87A rebate
    return 0; 
  }

  let tax = 0;
  let remaining = income;

  // Slabs:
  // Up to exemption: 0%
  // exemption to 5L: 5%
  // 5L to 10L: 20%
  // Above 10L: 30%
  
  if (remaining > 1000000) {
    tax += (remaining - 1000000) * 0.3;
    remaining = 1000000;
  }
  if (remaining > 500000) {
    tax += (remaining - 500000) * 0.2;
    remaining = 500000;
  }
  if (remaining > exemption) {
    tax += (remaining - exemption) * 0.05;
  }

  // Add 4% Health & Education Cess
  return tax * 1.04;
};

const calcNewRegimeTax = (income: number) => {
  // Budget 2024 (for FY 25-26) New Tax Regime slabs
  // Up to 3L: 0%
  // 3L - 7L: 5%
  // 7L - 10L: 10%
  // 10L - 12L: 15%
  // 12L - 15L: 20%
  // Above 15L: 30%
  
  // 87A Rebate up to 7L
  if (income <= 700000) return 0;

  let tax = 0;
  let remaining = income;

  if (remaining > 1500000) {
    tax += (remaining - 1500000) * 0.30;
    remaining = 1500000;
  }
  if (remaining > 1200000) {
    tax += (remaining - 1200000) * 0.20;
    remaining = 1200000;
  }
  if (remaining > 1000000) {
    tax += (remaining - 1000000) * 0.15;
    remaining = 1000000;
  }
  if (remaining > 700000) {
    tax += (remaining - 700000) * 0.10;
    remaining = 700000;
  }
  if (remaining > 300000) {
    tax += (remaining - 300000) * 0.05;
  }

  return tax * 1.04;
};

export function IncomeTax() {
  const resultRef = useRef<HTMLDivElement>(null);

  const [grossSalary, setGrossSalary] = useState(1500000);
  const [empType, setEmpType] = useState<'Salaried' | 'Self-Employed'>('Salaried');
  const [ageGroup, setAgeGroup] = useState<'<60' | '60-80' | '>80'>('<60');
  
  // Deductions
  const [sec80c, setSec80c] = useState(150000); // Max 1.5L
  const [sec80d, setSec80d] = useState(25000); // Health insurance
  const [hra, setHra] = useState(100000); // HRA Exemption
  const [sec24b, setSec24b] = useState(0); // Home loan interest (max 2L)
  const [sec80ccd1b, setSec80ccd1b] = useState(50000); // NPS additional
  const [sec80ccd2, setSec80ccd2] = useState(50000); // Employer NPS

  const { oldResults, newResults, winner } = useMemo(() => {
    // Old Regime calculation
    const oldStdDed = empType === 'Salaried' ? 50000 : 0;
    const oldDeductions = oldStdDed + Math.min(150000, sec80c) + sec80d + hra + Math.min(200000, sec24b) + Math.min(50000, sec80ccd1b) + sec80ccd2;
    const oldTaxable = Math.max(0, grossSalary - oldDeductions);
    const oldTax = calcOldRegimeTax(oldTaxable, ageGroup);

    // New Regime calculation (FY 25-26)
    const newStdDed = empType === 'Salaried' ? 75000 : 0; // Updated limit
    const newDeductions = newStdDed + sec80ccd2; // Only standard deduction and 80CCD(2) allowed
    const newTaxable = Math.max(0, grossSalary - newDeductions);
    const newTax = calcNewRegimeTax(newTaxable);

    return {
      oldResults: {
        gross: grossSalary,
        deductions: oldDeductions,
        taxable: oldTaxable,
        tax: oldTax,
        takeHome: grossSalary - oldTax
      },
      newResults: {
        gross: grossSalary,
        deductions: newDeductions,
        taxable: newTaxable,
        tax: newTax,
        takeHome: grossSalary - newTax
      },
      winner: newTax < oldTax ? 'NEW' : newTax > oldTax ? 'OLD' : 'TIE'
    };
  }, [grossSalary, empType, ageGroup, sec80c, sec80d, hra, sec24b, sec80ccd1b, sec80ccd2]);

  const chartData = [
    {
      name: 'Gross Income',
      Old: oldResults.gross,
      New: newResults.gross,
    },
    {
      name: 'Deductions',
      Old: oldResults.deductions,
      New: newResults.deductions,
    },
    {
      name: 'Taxable Income',
      Old: oldResults.taxable,
      New: newResults.taxable,
    },
    {
      name: 'Total Tax',
      Old: oldResults.tax,
      New: newResults.tax,
    }
  ];

  const handleDownloadPDF = async () => {
    if (resultRef.current) {
      const canvas = await html2canvas(resultRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('RupeeNiti_Tax_Summary_FY2025-26.pdf');
    }
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Income Tax Calculator 2025-26",
    "url": "https://rupeeniti.in/income-tax",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All"
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO 
        title="Income Tax Calculator FY 2025-26 — Old vs New Regime | RupeeNiti"
        description="Compare Old vs New Regime income tax for FY 2025-26. See which saves you more money. Free, instant, no signup required."
        path="/income-tax"
        schemaList={[appSchema]}
        breadcrumb={[{name: 'Home', item: '/'}, {name: 'Tax Calculator', item: '/income-tax'}]}
      />

      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#14532D]">Income Tax Calculator FY 2025-26</h1>
          <p className="text-gray-600 mt-2">Compare Old vs New tax regimes and maximize your take-home salary.</p>
        </div>
        <button 
          onClick={handleDownloadPDF}
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium hover:bg-gray-50 text-[#14532D]"
        >
          <Download className="w-4 h-4 mr-2" /> Download PDF
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Panel - Inputs */}
        <div className="lg:w-1/2 space-y-6">
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-[#16A34A]" /> Income Details
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gross Annual Income</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 font-medium">₹</span>
                  <input
                    type="number"
                    value={grossSalary}
                    onChange={(e) => setGrossSalary(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#16A34A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                  <select 
                    value={empType} 
                    onChange={(e) => setEmpType(e.target.value as any)}
                    className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  >
                    <option value="Salaried">Salaried</option>
                    <option value="Self-Employed">Self-Employed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                  <select 
                    value={ageGroup} 
                    onChange={(e) => setAgeGroup(e.target.value as any)}
                    className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  >
                    <option value="<60">Below 60</option>
                    <option value="60-80">60 - 80</option>
                    <option value=">80">Above 80</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Deductions</h3>
            <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-md mb-6 border border-green-200 break-words flex items-start">
              <Info className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" /> 
              <span>Most deductions apply <strong>only to the Old Regime</strong>. The New Regime only allows Standard Deduction (₹75k) and Sec 80CCD(2).</span>
            </p>

            <div className="space-y-4">
              {empType === 'Salaried' && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100 opacity-60">
                  <div>
                    <p className="font-medium text-sm text-gray-800">Standard Deduction</p>
                    <p className="text-xs text-gray-500">Auto-applied for Salaried</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">₹50,000 <span className="text-xs text-gray-400 font-normal ml-1">(Old)</span></p>
                    <p className="text-sm font-semibold">₹75,000 <span className="text-xs text-gray-400 font-normal ml-1">(New)</span></p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                  <span>Sec 80C (EPF, PPF, ELSS, LIC)</span>
                  <span className="text-xs text-gray-500">Max ₹1.5L</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 font-medium text-sm">₹</span>
                  <input type="number" value={sec80c} onChange={(e) => setSec80c(Number(e.target.value))} className="w-full pl-8 pr-4 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#16A34A] focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">House Rent Allowance (HRA Exemption)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 font-medium text-sm">₹</span>
                  <input type="number" value={hra} onChange={(e) => setHra(Number(e.target.value))} className="w-full pl-8 pr-4 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#16A34A] focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                  <span>Sec 80D (Health Insurance)</span>
                  <span className="text-xs text-gray-500">Max ₹25k/50k</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 font-medium text-sm">₹</span>
                  <input type="number" value={sec80d} onChange={(e) => setSec80d(Number(e.target.value))} className="w-full pl-8 pr-4 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#16A34A] focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                  <span>Home Loan Interest (Sec 24b)</span>
                  <span className="text-xs text-gray-500">Max ₹2L</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 font-medium text-sm">₹</span>
                  <input type="number" value={sec24b} onChange={(e) => setSec24b(Number(e.target.value))} className="w-full pl-8 pr-4 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#16A34A] focus:outline-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">NPS (Sec 80CCD1B)</label>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-gray-500 font-medium text-sm">₹</span>
                    <input type="number" value={sec80ccd1b} onChange={(e) => setSec80ccd1b(Number(e.target.value))} className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#16A34A]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Employer NPS (80CCD2)</label>
                  <div className="relative border-b-2 border-green-200">
                    <span className="absolute left-2 top-2 text-gray-500 font-medium text-sm">₹</span>
                    <input type="number" value={sec80ccd2} onChange={(e) => setSec80ccd2(Number(e.target.value))} title="Allowed in New Regime too" className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#16A34A] bg-[#F0FDF4]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="lg:w-1/2" ref={resultRef}>
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden p-6 relative">
            
            {/* Winner Banner */}
            <div className={`text-center py-3 mb-6 rounded-lg border-2 ${winner === 'NEW' ? 'border-[#CA8A04] bg-[#FEF9C3]' : winner === 'OLD' ? 'border-[#CA8A04] bg-[#FEF9C3]' : 'border-gray-300 bg-gray-50'}`}>
              <h2 className="text-xl font-bold text-gray-900">
                {winner === 'TIE' 
                  ? 'Both regimes yield the same tax.' 
                  : <span className="flex items-center justify-center gap-2">
                       <span className="bg-[#CA8A04] text-white px-2 py-0.5 rounded text-sm uppercase">Winner</span>
                       {winner} Regime is Better
                    </span>
                }
              </h2>
              {winner !== 'TIE' && (
                <p className="text-lg mt-1 font-semibold text-[#14532D]">
                  You save <span className="text-[#16A34A]">{formatCurrency(Math.abs(newResults.tax - oldResults.tax))}</span> by choosing the {winner} Regime.
                </p>
              )}
            </div>

            {/* Duel Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* Old Regime Card */}
              <div className={`border rounded-xl p-4 ${winner === 'OLD' ? 'border-[#CA8A04] shadow-[0_0_0_1px_#CA8A04]' : 'border-gray-200'}`}>
                <h3 className="text-center font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">OLD REGIME</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Gross</span><span className="font-medium">{formatCurrency(oldResults.gross)}</span></div>
                  <div className="flex justify-between"><span className="text-red-500">- Deductions</span><span className="font-medium text-red-600">{formatCurrency(oldResults.deductions)}</span></div>
                  <div className="flex justify-between border-t border-dashed pt-2"><span className="font-semibold text-gray-700">Taxable</span><span className="font-bold">{formatCurrency(oldResults.taxable)}</span></div>
                  
                  <div className="flex justify-between pt-4"><span className="text-gray-500">Tax (incl. Cess)</span><span className="font-bold text-lg text-[#DC2626]">{formatCurrency(oldResults.tax)}</span></div>
                  <div className="flex justify-between border-t border-gray-100 pt-2"><span className="text-gray-500 text-xs">Marginal Rate</span><span className="text-xs font-semibold">{((oldResults.tax / Math.max(1, oldResults.gross)) * 100).toFixed(1)}%</span></div>
                  <div className="flex justify-between bg-gray-50 p-2 rounded mt-2"><span className="text-xs font-semibold text-gray-600">Net Take Home</span><span className="text-sm font-bold text-[#16A34A]">{formatCurrency(oldResults.takeHome)}</span></div>
                </div>
              </div>

              {/* New Regime Card */}
              <div className={`border rounded-xl p-4 ${winner === 'NEW' ? 'border-[#CA8A04] shadow-[0_0_0_1px_#CA8A04]' : 'border-gray-200'}`}>
                <h3 className="text-center font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">NEW REGIME</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Gross</span><span className="font-medium">{formatCurrency(newResults.gross)}</span></div>
                  <div className="flex justify-between"><span className="text-red-500">- Deductions</span><span className="font-medium text-red-600">{formatCurrency(newResults.deductions)}</span></div>
                  <div className="flex justify-between border-t border-dashed pt-2"><span className="font-semibold text-gray-700">Taxable</span><span className="font-bold">{formatCurrency(newResults.taxable)}</span></div>
                  
                  <div className="flex justify-between pt-4"><span className="text-gray-500">Tax (incl. Cess)</span><span className="font-bold text-lg text-[#DC2626]">{formatCurrency(newResults.tax)}</span></div>
                  <div className="flex justify-between border-t border-gray-100 pt-2"><span className="text-gray-500 text-xs">Marginal Rate</span><span className="text-xs font-semibold">{((newResults.tax / Math.max(1, newResults.gross)) * 100).toFixed(1)}%</span></div>
                  <div className="flex justify-between bg-gray-50 p-2 rounded mt-2"><span className="text-xs font-semibold text-gray-600">Net Take Home</span><span className="text-sm font-bold text-[#16A34A]">{formatCurrency(newResults.takeHome)}</span></div>
                </div>
              </div>
            </div>

            {/* Visualizations */}
            <div className="h-64 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis tickFormatter={(val) => `₹${val/100000}L`} tick={{fontSize: 12}} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="Old" fill="#64748B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="New" fill="#16A34A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* RupeeNiti Watermark for PDF */}
            <div className="mt-8 text-center text-xs text-gray-300 font-mono">Generated by RupeeNiti.in — India's Smart Finance Calculator</div>
          </div>
          
          <div className="mt-6">
            <AdPlaceholder format="banner" className="mx-auto rounded" />
          </div>
        </div>
      </div>
      
      {/* Suggestions Section */}
      <div className="mt-8 bg-[#F0FDF4] border border-[#16A34A]/20 rounded-xl p-6">
        <h3 className="text-lg font-bold text-[#14532D] mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-[#CA8A04]" /> Tax Saving Suggestions
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-1">Old Regime Headroom</h4>
            <p className="text-sm text-gray-600">
              {sec80c < 150000 ? `You have ₹${(150000 - sec80c).toLocaleString('en-IN')} remaining limit under Sec 80C. Invest in ELSS, PPF, or FDR to reduce tax.` : `You have fully utilized Sec 80C. Maximize 80CCD(1B) up to ₹50k.`}
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-1">New Regime Switch</h4>
            <p className="text-sm text-gray-600">
              If your total eligible deductions are less than ₹{(oldResults.gross - newResults.taxable - (empType === 'Salaried' ? 50000 : 0)).toLocaleString('en-IN')}, then New Regime saves you more money without blocking your cash in investments.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
