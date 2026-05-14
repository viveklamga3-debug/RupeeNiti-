import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/src/components/layout/Navbar';
import { Footer } from '@/src/components/layout/Footer';
import { AdPlaceholder } from '@/src/components/AdPlaceholder';
import { Home } from '@/src/pages/Home';
import { EmiCalculator } from '@/src/pages/EmiCalculator';
import { IncomeTax } from '@/src/pages/IncomeTax';
import { BlogIndex } from '@/src/pages/BlogIndex';
import { BlogPost } from '@/src/pages/BlogPost';
import { About } from '@/src/pages/About';
import { PrivacyPolicy } from '@/src/pages/PrivacyPolicy';
import { Contact } from '@/src/pages/Contact';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-slate-800 font-sans">
      <Helmet>
        <title>RupeeNiti — Free EMI and Income Tax Calculator India</title>
      </Helmet>
      
      <Navbar />
      
      <div className="w-full flex justify-center border-b border-gray-200 bg-white">
        <AdPlaceholder format="leaderboard" className="my-2 border-0 bg-gray-100" />
      </div>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/emi-calculator" element={<EmiCalculator />} />
          <Route path="/income-tax" element={<IncomeTax />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <div className="w-full flex justify-center bg-gray-50 text-slate-800">
        <AdPlaceholder format="leaderboard" className="my-6 border-0 bg-gray-200" />
      </div>

      <Footer />
    </div>
  );
}
