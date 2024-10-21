import React from 'react';

const services = [
  { id: 1, name: 'Soins esthétiques', description: 'Profitez de nos soins esthétiques professionnels.' },
  { id: 2, name: 'Consultations médicales', description: 'Consultez nos médecins qualifiés pour tous vos besoins de santé.' },
  { id: 3, name: 'Coaching personnel', description: 'Atteignez vos objectifs avec un suivi personalisé.' },
];

const Services: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Nos Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;