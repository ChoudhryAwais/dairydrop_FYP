import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  // --- Admin Footer: Ultra Compact ---
  if (isAdminPage) {
    return (
      <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <p className="text-xs text-center text-gray-500 font-medium">
            &copy; 2026 DairyDrop Admin.
          </p>
        </div>
      </footer>
    );
  }

  // --- Customer Footer: Compact & Sleek ---
  return (
    <footer className="mt-auto relative text-sm"> {/* Added text-sm base size */}
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600"></div>

        {/* Main Footer Background */}
        <div className="bg-gradient-to-br from-[#064E31] to-[#022c1b] text-green-50">
            {/* Reduced vertical padding from py-12 to py-6 */}
            <div className="container mx-auto px-6 py-6 max-w-7xl">
                
                {/* Grid: Reduced gap from 12 to 8, margin-bottom from 10 to 6 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
                    
                    {/* Brand Column */}
                    <div className="md:col-span-2 flex flex-col justify-center">
                        <h3 className="text-xl font-bold text-white tracking-wide mb-2">
                            DairyDrop
                        </h3>
                        <p className="text-green-100 text-xs leading-relaxed max-w-sm">
                            Farm-fresh goodness delivered to your doorstep. 
                            Sustainable sourcing and the purest dairy for your family.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-base font-semibold text-white mb-2">
                            Explore
                        </h3>
                        {/* Reduced spacing between list items (space-y-1) */}
                        <ul className="space-y-1 text-xs">
                            <li><Link to="/" className="text-green-100 hover:text-green-300 transition-colors">Home</Link></li>
                            <li><Link to="/products" className="text-green-100 hover:text-green-300 transition-colors">Our Products</Link></li>
                            <li><Link to="/about" className="text-green-100 hover:text-green-300 transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-base font-semibold text-white mb-2">
                            Contact
                        </h3>
                        <ul className="space-y-1 text-xs text-green-100">
                            <li><span className="text-green-300">Email:</span> info@dairydrop.com</li>
                            <li><span className="text-green-300">Phone:</span> +1 (555) 123-4567</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar: Reduced top padding and margin */}
                <div className="border-t border-green-800/50 pt-3 mt-2 flex flex-col md:flex-row justify-between items-center text-[10px] text-green-300/80">
                    <p>&copy; 2026 DairyDrop. All rights reserved.</p>
                    <div className="flex gap-4 mt-2 md:mt-0">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  );
};

export default Footer;