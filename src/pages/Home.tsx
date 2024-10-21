import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="text-center flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Bienvenue sur Beautyplace_booking</h1>
      <p className="text-xl mb-8">Simplifiez vos prises de rendez-vous pour tous types de prestations</p>
      <Link to="/booking" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition duration-300">
        Prendre rendez-vous
      </Link>
    </div>
  )
};

export default Home;