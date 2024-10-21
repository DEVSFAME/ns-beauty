import React from 'react';

const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold mb-4">Oups ! Une erreur s'est produite.</h1>
      <p className="mb-4">Nous sommes désolés pour ce désagrément. Notre équipe a été notifiée et travaille sur une solution.</p>
      <p className="text-sm text-gray-600 mb-4">Détails de l'erreur : {error.message}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Rafraîchir la page
      </button>
    </div>
  );
};

export default ErrorFallback;