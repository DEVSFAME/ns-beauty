import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Settings } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center text-xl font-bold text-blue-600">
          <Calendar className="mr-2" />
          Beautyplace_booking
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="text-gray-600 hover:text-blue-600">Accueil</Link></li>
            <li><Link to="/services" className="text-gray-600 hover:text-blue-600">Services</Link></li>
            <li><Link to="/booking" className="text-gray-600 hover:text-blue-600">Réserver</Link></li>
            <li><Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Tableau de bord</Link></li>
            <li><Link to="/admin" className="text-gray-600 hover:text-blue-600 flex items-center"><Settings size={18} className="mr-1" /> Admin</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;