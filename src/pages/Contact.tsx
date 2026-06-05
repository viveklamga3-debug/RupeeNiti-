import React from 'react';
import { Mail, MessageSquare } from 'lucide-react';
import { AdPlaceholder } from '@/src/components/AdPlaceholder';
import { SEO } from '@/src/components/SEO';

export function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SEO 
        title="Contact Us | RupeeNiti"
        description="Get in touch with the RupeeNiti team. We'd love to hear your feedback or answer any questions about our calculators."
        path="/contact"
        breadcrumb={[{name: 'Home', item: '/'}, {name: 'Contact', item: '/contact'}]}
      />
      
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#14532D]">Get in Touch</h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Have a question about our calculators, found a bug, or want to suggest a new feature? We'd love to hear from you.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center">
          <div className="bg-green-50 p-4 rounded-full text-[#16A34A] mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Email Us</h3>
          <p className="text-gray-600 mb-4">Send us an email and we'll get back to you within 24-48 hours.</p>
          <a href="mailto:support@rupeeniti.in" className="text-[#16A34A] font-medium hover:underline">support@rupeeniti.in</a>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center">
          <div className="bg-green-50 p-4 rounded-full text-[#16A34A] mb-4">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Social Media</h3>
          <p className="text-gray-600 mb-4">Follow us on social media for finance tips and updates.</p>
          <div className="flex space-x-4">
            <span className="text-[#16A34A] cursor-pointer hover:underline font-medium">Twitter</span>
            <span className="text-[#16A34A] cursor-pointer hover:underline font-medium">LinkedIn</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Send a Message</h3>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#16A34A] focus:outline-none" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
            <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#16A34A] focus:outline-none" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#16A34A] focus:outline-none" placeholder="How can we help you?"></textarea>
          </div>
          <button className="w-full bg-[#16A34A] text-white font-medium px-4 py-3 rounded hover:bg-green-600 transition-colors">
            Send Message
          </button>
        </form>
      </div>

    </div>
  );
}
