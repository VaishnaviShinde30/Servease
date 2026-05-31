import { Hexagon, Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 mt-auto border-t border-slate-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6 group inline-flex">
              <div className="bg-primary-600 text-white p-2 rounded-xl group-hover:scale-105 transition-all duration-300 shadow-md">
                <Compass className="h-5 w-5 stroke-2" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-bold text-white tracking-tight leading-none">
                  Servease
                </span>
                <span className="text-[8px] font-semibold text-slate-400 tracking-wider uppercase mt-1">
                  We Recommend, You Decide
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Smart service recommendation platform. Connecting students and locals with the best-rated shops based on price, distance, and reviews.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/user" className="hover:text-primary-400 transition-colors">Find Services</Link></li>
              <li><Link to="/shopkeeper" className="hover:text-primary-400 transition-colors">List Your Shop</Link></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Disclaimer</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-500 shrink-0" />
                <span>123 University Road, Tech Park,<br/>Pune, MH 411001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-500 shrink-0" />
                <span>support@servease.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Servease Inc. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed for Final Year Demonstration</p>
        </div>
      </div>
    </footer>
  );
}
