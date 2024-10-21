import React, { useEffect, useState } from 'react';

interface Booking {
  service: string;
  date: string;
  slot: string;
  email: string;
  fullName: string;
}

interface NoShowClient {
  email: string;
  count: number;
}

const Dashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [noShowClients, setNoShowClients] = useState<NoShowClient[]>([]);

  useEffect(() => {
    const loadedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(loadedBookings);
    const loadedNoShowClients = JSON.parse(localStorage.getItem('noShowClients') || '[]');
    setNoShowClients(loadedNoShowClients);
  }, []);

  const handleAttendance = (index: number, attended: boolean) => {
    const updatedBookings = [...bookings];
    const noShowClient = updatedBookings[index];
    
    if (!attended) {
      const updatedNoShowClients = [...noShowClients];
      const existingClientIndex = updatedNoShowClients.findIndex(client => client.email === noShowClient.email);
      
      if (existingClientIndex !== -1) {
        updatedNoShowClients[existingClientIndex].count += 1;
      } else {
        updatedNoShowClients.push({ email: noShowClient.email, count: 1 });
      }
      
      setNoShowClients(updatedNoShowClients);
      localStorage.setItem('noShowClients', JSON.stringify(updatedNoShowClients));
    }
    
    updatedBookings.splice(index, 1);
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Tableau de bord</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom et prénom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">{booking.service}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">{booking.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">{booking.slot}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">{booking.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">{booking.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleAttendance(index, true)}
                    className="text-green-600 hover:text-green-900 mr-2"
                  >
                    Honoré
                  </button>
                  <button
                    onClick={() => handleAttendance(index, false)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Non honoré
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;