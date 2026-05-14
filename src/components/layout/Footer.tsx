import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-[#14532D]">
                Rupee<span className="text-[#16A34A]">Niti</span>
              </span>
            </Link>
            <p className="mt-4 text-gray-500 text-sm max-w-md">
              India's Smart Finance Calculator. Instantly calculate your EMIs and Income Tax liability under the Old and New regime for free. No login, no limits.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Tools</h3>
            <ul className="mt-4 space-y-4 text-sm text-gray-600">
              <li>
                <Link to="/emi-calculator" className="hover:text-[#16A34A]">EMI Calculator</Link>
              </li>
              <li>
                <Link to="/income-tax" className="hover:text-[#16A34A]">Income Tax Calculator</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#16A34A]">Finance Blog</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal & Contact</h3>
            <ul className="mt-4 space-y-4 text-sm text-gray-600">
              <li>
                <Link to="/about" className="hover:text-[#16A34A]">About Us</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#16A34A]">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#16A34A]">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} RupeeNiti. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built for Indian users.</p>
        </div>
      </div>
    </footer>
  );
}
