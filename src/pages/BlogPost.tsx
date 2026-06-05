import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { BLOG_POSTS } from './BlogIndex';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { AdPlaceholder } from '@/src/components/AdPlaceholder';
import { SEO } from '@/src/components/SEO';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const postSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "author": { "@type": "Organization", "name": post.author },
    "datePublished": new Date(post.date).toISOString()
  };

  return (
    <article className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO 
        title={`${post.title} | RupeeNiti`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
        schemaList={[postSchema]}
        breadcrumb={[
          {name: 'Home', item: '/'}, 
          {name: 'Blog', item: '/blog'},
          {name: post.title, item: `/blog/${post.slug}`}
        ]}
      />

      <div className="mb-8">
        <Link to="/blog" className="inline-flex items-center text-gray-500 hover:text-[#16A34A] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to all articles
        </Link>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#14532D] leading-tight mb-6">
          {post.title}
        </h1>
        <div className="flex items-center text-sm text-gray-500 border-b border-gray-200 pb-8">
          <span className="flex items-center mr-6"><Calendar className="w-4 h-4 mr-2"/> {post.date}</span>
          <span className="flex items-center"><User className="w-4 h-4 mr-2"/> {post.author}</span>
        </div>
      </div>

      {/* Mid-article Ad */}
      <div className="my-8 flex justify-center">
        <AdPlaceholder format="responsive" className="w-full rounded bg-gray-50" />
      </div>

      <div className="prose prose-lg prose-green max-w-none text-gray-700">
        <p className="lead text-xl text-gray-600 mb-8">{post.excerpt}</p>
        
        {/* Placeholder Content since full article content is not provided in PRD */}
        <h2>Introduction</h2>
        <p>This is a comprehensive guide to understanding <strong>{post.title}</strong>. For Indian taxpayers and borrowers, navigating the complexities of finance can seem daunting, but it boils down to simple mathematics and knowing the rules.</p>
        
        <h2>The Core Strategy</h2>
        <p>Whether you are trying to minimize the interest on a 30-year home loan or deciding whether the new tax regime (with its revised standard deduction) makes sense for your salary bracket, the key is running the numbers side by side.</p>
        <ul>
          <li>Always calculate the <em>Total Interest Payable</em>, not just the EMI amount.</li>
          <li>For taxes, project your gross income minus guaranteed deductions (like HRA, 80C, 80D, 24b).</li>
          <li>Consider inflation when deciding to prepay a loan versus investing the surplus cash.</li>
        </ul>

        <div className="bg-[#F0FDF4] border border-[#16A34A]/20 rounded-lg p-6 my-8">
          <h3 className="text-[#14532D] mt-0">Try the Calculator</h3>
          <p className="mb-0">Don't guess the numbers. Use our free tools to instantly calculate your exact requirements.</p>
          <div className="mt-4 flex gap-4">
            <Link to="/emi-calculator" className="text-[#16A34A] font-bold hover:underline">EMI Calculator &rarr;</Link>
            <Link to="/income-tax" className="text-[#16A34A] font-bold hover:underline">Tax Calculator &rarr;</Link>
          </div>
        </div>

        <h2>Conclusion</h2>
        <p>Make financial decisions based on hard data. Bookmark our tools to stay updated with the latest changes in RBI repo rates and Union Budget tax slab revisions.</p>
      </div>

      {/* Bottom Ad */}
      <div className="mt-12 pt-8 border-t border-gray-200 flex justify-center">
        <AdPlaceholder format="banner" className="w-full rounded bg-gray-50" />
      </div>
    </article>
  );
}
