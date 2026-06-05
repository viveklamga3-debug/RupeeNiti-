import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { SEO } from '@/src/components/SEO';

export const BLOG_POSTS = [
  {
    slug: 'home-loan-emi-guide',
    title: 'How to Calculate Home Loan EMI in India — Complete 2026 Guide',
    excerpt: 'Learn the exact mathematical formula banks use to calculate your home loan EMI, how reducing balance works, and tips to save lakhs in interest.',
    date: 'May 1, 2026',
    author: 'RupeeNiti Editorial'
  },
  {
    slug: 'new-vs-old-tax-regime',
    title: 'New vs Old Tax Regime 2026 — Which is Better for You?',
    excerpt: 'With the recent budget updates, the New Tax Regime is looking attractive. But if you have home loans and 80C investments, should you switch?',
    date: 'May 8, 2026',
    author: 'RupeeNiti Editorial'
  },
  {
    slug: 'how-to-save-income-tax',
    title: '10 Legal Ways to Save Income Tax in India (2026 Edition)',
    excerpt: 'From ELSS and PPF to lesser-known deductions like 80CCD(1B) and 80GGA. How to legally minimize your tax outgo.',
    date: 'May 15, 2026',
    author: 'RupeeNiti Editorial'
  },
  {
    slug: 'amortization-explained',
    title: 'What is Loan Amortization? Beginner Guide with Calculator',
    excerpt: 'Why does most of your EMI go toward interest in the early years? Understanding your amortization schedule is key to paying off loans faster.',
    date: 'May 22, 2026',
    author: 'RupeeNiti Editorial'
  }
];

export function BlogIndex() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO 
        title="Finance Blog | RupeeNiti"
        description="Guides on how to save income tax, calculate EMIs, and understand your finances better in India."
        path="/blog"
        breadcrumb={[{name: 'Home', item: '/'}, {name: 'Blog', item: '/blog'}]}
      />

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#14532D]">Money Wisdom</h1>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">Expert guides and simple explanations for Indian taxpayers and borrowers.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {BLOG_POSTS.map((post) => (
          <div key={post.slug} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="p-8 flex-grow">
              <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> {post.date}</span>
                <span className="flex items-center"><User className="w-4 h-4 mr-1"/> {post.author}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{post.excerpt}</p>
            </div>
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 mt-auto">
              <Link to={`/blog/${post.slug}`} className="inline-flex items-center text-[#16A34A] font-medium hover:text-green-700">
                Read full article <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
