import React from 'react';
import { SEO } from '@/src/components/SEO';

export function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SEO 
        title="Privacy Policy | RupeeNiti"
        description="Privacy policy for RupeeNiti. Learn how we protect your data while using our EMI and Tax calculators."
        path="/privacy-policy"
        breadcrumb={[{name: 'Home', item: '/'}, {name: 'Privacy Policy', item: '/privacy-policy'}]}
      />
      <h1 className="text-3xl font-bold text-[#14532D] mb-6">Privacy Policy</h1>
      <div className="prose prose-green max-w-none text-gray-700">
        <p>Last updated: May 2026</p>
        
        <h2>1. Information Collection</h2>
        <p>RupeeNiti operates mostly entirely entirely client-side. We do not require you to create an account, log in, or provide personal identifiable information (PII) to use our tools.</p>
        <p>When you enter financial data (such as your salary or loan amount) into our calculators, that data is processed locally within your web browser. We do not transmit, save, or store this data on our servers.</p>
        
        <h2>2. Cookies and Analytics</h2>
        <p>We use Google Analytics (GA4) to understand basic website traffic (e.g., how many people visit the site, which pages are most popular). This service may use cookies to track user interactions anonymously.</p>
        
        <h2>3. Third-Party Advertising</h2>
        <p>We use Google AdSense to display advertisements. Google uses cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting Google Ads Settings.</p>
        
        <h2>4. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page.</p>
      </div>
    </div>
  );
}
