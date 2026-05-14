import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AdPlaceholder } from '@/src/components/AdPlaceholder';

export function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>About Us | RupeeNiti</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-[#14532D] mb-6">About RupeeNiti</h1>
      <div className="prose prose-green max-w-none text-gray-700">
        <p><strong>RupeeNiti</strong> (meaning Money Wisdom in Hindi) is a free, no-login financial calculator web application built specifically for Indian users.</p>
        <p>Our mission is simple: to provide the most accurate, fastest, and cleanest calculators for EMIs and Income Tax in India. We noticed that most existing tools are cluttered with intrusive ads, require forced logins, or suffer from outdated data.</p>
        <p>We built RupeeNiti to solve that. All calculations happen instantly in your browser, maintaining your complete privacy.</p>
        
        <h2 className="mt-8 mb-4 text-xl font-bold text-gray-900">Why Choose Us?</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>100% Free:</strong> No hidden charges, no trial periods.</li>
          <li><strong>No Login:</strong> We don't ask for your phone number or email just to show results.</li>
          <li><strong>Privacy First:</strong> No database. We don't store your salary or loan details.</li>
          <li><strong>Updated for 2026:</strong> Our tax calculator stays updated with the latest Union Budget.</li>
        </ul>
      </div>
      <div className="mt-12">
        <AdPlaceholder format="responsive" />
      </div>
    </div>
  );
}
