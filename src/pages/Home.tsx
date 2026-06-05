import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, Landmark, Zap, Shield, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AdPlaceholder } from '@/src/components/AdPlaceholder';
import { SEO } from '@/src/components/SEO';

export function Home() {
  const [ctc, setCtc] = useState<number>(1200000);
  
  // Basic calculation for mini widget - simplified
  const calculateMiniTax = (income: number) => {
    // Old Regime (simplified for widget)
    let oldTax = 0;
    let oldTaxable = Math.max(0, income - 50000 - 150000); // Std Ded + 80C
    if (oldTaxable > 500000) {
      if (oldTaxable <= 1000000) oldTax = 12500 + (oldTaxable - 500000) * 0.2;
      else oldTax = 112500 + (oldTaxable - 1000000) * 0.3;
      oldTax += oldTax * 0.04;
    }
    
    // New Regime (simplified for widget FY 25-26)
    let newTax = 0;
    let newTaxable = Math.max(0, income - 75000); // Std Ded only
    if (newTaxable > 700000) {
      if (newTaxable <= 700000) newTax = 0; // Rebate
      else if (newTaxable <= 1000000) newTax = 15000 + (newTaxable - 700000) * 0.1;
      else if (newTaxable <= 1200000) newTax = 45000 + (newTaxable - 1000000) * 0.15;
      else if (newTaxable <= 1500000) newTax = 75000 + (newTaxable - 1200000) * 0.2;
      else newTax = 135000 + (newTaxable - 1500000) * 0.3;
      newTax += newTax * 0.04;
    }

    return { old: Math.round(oldTax), new: Math.round(newTax) };
  };

  const widgetTax = calculateMiniTax(ctc);

  const faqs = [
    { q: "Is RupeeNiti really free?", a: "Yes, 100% free forever. We cover our costs through non-intrusive ads. There are no premium features hidden behind a paywall." },
    { q: "Do I need to sign up or log in?", a: "No. You don't need to create an account, provide your email, or log in to use our calculators. We believe in instant access." },
    { q: "Is my financial data saved anywhere?", a: "No. All calculations happen directly in your browser. We do not have a server database, and your salary or loan details are never transmitted or stored." },
    { q: "Are the tax slabs updated for FY 2025-26?", a: "Yes, the Income Tax calculator reflects the latest union budget updates, including the revised Rs. 75,000 standard deduction for the New Tax Regime." },
    { q: "Can I use the EMI calculator for personal loans?", a: "Absolutely. Our EMI Calculator Suite includes dedicated tabs for Home Loans, Car Loans, and Personal Loans, with adjustable interest rates up to 36%." },
    { q: "How accurate are the tax calculations?", a: "Our calculations are highly accurate and align with the official Income Tax Department rules. However, we always recommend consulting a CA for final filings." },
    { q: "Can I download my tax computation?", a: "Yes, our Income Tax Calculator allows you to download a clean, water-mark free PDF summary of both regimes." },
    { q: "Does the app work well on mobile?", a: "Yes, RupeeNiti is a mobile-first app designed specifically to work smoothly on Android and iOS smartphones without zooming or side-scrolling." }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a }
    }))
  };

  return (
    <div className="w-full">
      <SEO 
        title="RupeeNiti — Free EMI and Income Tax Calculator India"
        description="Calculate home loan, car loan, personal loan EMIs and compare Old vs New income tax regime for FY 2025-26. Free, instant, no login."
        path="/"
        schemaList={[faqSchema]}
      />

      {/* Hero Section */}
      <section className="bg-[#14532D] text-white py-16 sm:py-24 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            India's Smart <span className="text-[#16A34A]">Finance</span> Calculator
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-green-100 max-w-3xl mx-auto mb-10">
             Instantly calculate your Home Loan EMI or Income Tax liability. <br className="hidden sm:block"/> No login. No limits. 100% Free.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/emi-calculator" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-[#14532D] bg-white hover:bg-gray-50 md:text-lg transition-colors">
              <Landmark className="mr-2 h-5 w-5" />
              EMI Calculator
            </Link>
            <Link to="/income-tax" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-[#16A34A] hover:bg-green-600 md:text-lg transition-colors shadow-lg shadow-green-900/20">
              <Calculator className="mr-2 h-5 w-5" />
              Tax Calculator
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#F0FDF4] p-4 rounded-full text-[#16A34A] mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-gray-900">No Login Required</h3>
              <p className="text-sm text-gray-500 mt-1">Start calculating instantly</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#F0FDF4] p-4 rounded-full text-[#16A34A] mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-gray-900">Always Free</h3>
              <p className="text-sm text-gray-500 mt-1">No hidden paywalls</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#F0FDF4] p-4 rounded-full text-[#16A34A] mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-gray-900">Instant Results</h3>
              <p className="text-sm text-gray-500 mt-1">Lightning fast in browser</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#F0FDF4] p-4 rounded-full text-[#16A34A] mb-4">
                <Smartphone className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-gray-900">Mobile Friendly</h3>
              <p className="text-sm text-gray-500 mt-1">Perfect on your phone</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mini Tax Widget & Tool Previews */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Widget */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="p-6 bg-[#14532D] text-white">
                <h3 className="text-xl font-bold flex items-center">
                  <Calculator className="mr-2 h-5 w-5 text-[#16A34A]" />
                  Quick Tax Estimator (FY 25-26)
                </h3>
                <p className="text-green-100 text-sm mt-1">See your tax liability in seconds.</p>
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Salary (CTC)</label>
                <div className="relative mb-6">
                  <span className="absolute left-4 top-3 text-gray-500 font-medium">₹</span>
                  <input 
                    type="number" 
                    value={ctc} 
                    onChange={(e) => setCtc(Number(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16A34A] focus:outline-none text-lg font-semibold"
                  />
                  <input 
                    type="range" min="500000" max="5000000" step="100000"
                    value={ctc} onChange={(e) => setCtc(Number(e.target.value))}
                    className="w-full mt-4 accent-[#16A34A]"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                    <p className="text-xs text-gray-500 font-semibold mb-1">OLD REGIME (Est.)</p>
                    <p className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-2">₹{widgetTax.old.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-400">Assumes basic 80C</p>
                  </div>
                  <div className="bg-[#F0FDF4] rounded-lg p-4 border border-[#16A34A]/30 text-center relative overflow-hidden">
                    {widgetTax.new < widgetTax.old && <div className="absolute top-0 inset-x-0 h-1 bg-[#16A34A]"></div>}
                    <p className="text-xs text-green-700 font-bold mb-1">NEW REGIME (Est.)</p>
                    <p className="text-lg font-bold text-gray-900 border-b border-green-200 pb-2 mb-2">₹{widgetTax.new.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-green-600">Standard ded. applied</p>
                  </div>
                </div>

                <Link to="/income-tax" className="mt-6 w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-[#16A34A] hover:bg-green-600 font-medium transition-colors">
                  Get Detailed Calculation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Ad Placeholder mid-page */}
            <div className="flex justify-center">
              <AdPlaceholder format="responsive" className="bg-white rounded-lg p-8 w-full max-w-sm shadow-sm" />
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#14532D] mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#14532D]">Latest Finance Guides</h2>
              <p className="mt-2 text-gray-600">Learn how to save tax and manage your loans.</p>
            </div>
            <Link to="/blog" className="hidden sm:flex items-center text-[#16A34A] font-medium hover:text-green-700">
              View all articles <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[ 
              { title: "How to Calculate Home Loan EMI in India", slug: "home-loan-emi-guide" },
              { title: "New vs Old Tax Regime 2026 — Which is Better?", slug: "new-vs-old-tax-regime" },
              { title: "10 Legal Ways to Save Income Tax in India", slug: "how-to-save-income-tax" }
            ].map((post, i) => (
              <Link key={i} to={`/blog/${post.slug}`} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
                <div className="h-48 bg-[#14532D] flex items-center justify-center p-6 text-center">
                  <h3 className="text-xl font-bold text-white leading-tight group-hover:text-green-200 transition-colors">{post.title}</h3>
                </div>
                <div className="p-5">
                  <p className="text-[#16A34A] font-medium text-sm mb-2">Finance Guides</p>
                  <span className="text-sm text-gray-500 flex items-center">Read article <ArrowRight className="ml-1 w-3 h-3"/></span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 sm:hidden flex justify-center">
             <Link to="/blog" className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
              View all articles <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
