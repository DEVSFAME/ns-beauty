import React, { useState, useEffect } from 'react';
import { Plus, Clock, Calendar, Pause, Play, Trash } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  duration: number;
  paused: boolean;
}

interface Holiday {
  start: string;
  end: string;
}

interface NoShowClient {
  fullName: string;
  email: string;
  date: string;
  service: string;
  count: number;
}

interface TimeSlot {
  start: string;
  end: string;
}

const AdminDashboard: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [newSlotStart, setNewSlotStart] = useState('');
  const [newSlotEnd, setNewSlotEnd] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [newHolidayStart, setNewHolidayStart] = useState('');
  const [newHolidayEnd, setNewHolidayEnd] = useState('');
  const [noShowClients, setNoShowClients] = useState<NoShowClient[]>([]);

  useEffect(() => {
    const savedServices = JSON.parse(localStorage.getItem('services') || '[]');
    setServices(savedServices);
    const savedHolidays = JSON.parse(localStorage.getItem('holidays') || '[]');
    setHolidays(savedHolidays);
    const savedNoShowClients = JSON.parse(localStorage.getItem('noShowClients') || '[]');
    setNoShowClients(savedNoShowClients);
    const savedTimeSlots = JSON.parse(localStorage.getItem('timeSlots') || '[]');
    setTimeSlots(savedTimeSlots);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Beauty_place' && password === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('Identifiants incorrects');
    }
  };

  const addService = (e: React.FormEvent) => {
    e.preventDefault();
    if (newServiceName.trim() && newServiceDuration.trim()) {
      const newService = { 
        id: Date.now(),
        name: newServiceName.trim(), 
        duration: parseInt(newServiceDuration, 10),
        paused: false
      };
      const updatedServices = [...services, newService];
      setServices(updatedServices);
      localStorage.setItem('services', JSON.stringify(updatedServices));
      setNewServiceName('');
      setNewServiceDuration('');
    }
  };

  const toggleServicePause = (id: number) => {
    const updatedServices = services.map(service => 
      service.id === id ? { ...service, paused: !service.paused } : service
    );
    setServices(updatedServices);
    localStorage.setItem('services', JSON.stringify(updatedServices));
  };

  const deleteService = (id: number) => {
    const updatedServices = services.filter(service => service.id !== id);
    setServices(updatedServices);
    localStorage.setItem('services', JSON.stringify(updatedServices));
  };

  const addTimeSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSlotStart && newSlotEnd) {
      const newSlot = { start: newSlotStart, end: newSlotEnd };
      const updatedTimeSlots = [...timeSlots, newSlot];
      setTimeSlots(updatedTimeSlots);
      localStorage.setItem('timeSlots', JSON.stringify(updatedTimeSlots));
      setNewSlotStart('');
      setNewSlotEnd('');
    }
  };

  const addHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHolidayStart && newHolidayEnd) {
      const newHoliday = { start: newHolidayStart, end: newHolidayEnd };
      const updatedHolidays = [...holidays, newHoliday];
      setHolidays(updatedHolidays);
      localStorage.setItem('holidays', JSON.stringify(updatedHolidays));
      setNewHolidayStart('');
      setNewHolidayEnd('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Connexion Admin</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-2 font-medium text-gray-700">Identifiant</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-800"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-800"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
            Se connecter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Tableau de bord administrateur</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Gestion des prestations</h2>
          <form onSubmit={addService} className="space-y-4 mb-6">
            <input
              type="text"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder="Nom de la prestation"
              className="w-full p-2 border rounded bg-gray-50 text-gray-800"
            />
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-blue-600" />
              <input
                type="number"
                value={newServiceDuration}
                onChange={(e) => setNewServiceDuration(e.target.value)}
                placeholder="Durée (minutes)"
                className="w-full p-2 border rounded bg-gray-50 text-gray-800"
                min="1"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 flex items-center justify-center">
              <Plus size={20} className="mr-2" />
              Ajouter la prestation
            </button>
          </form>
          <ul className="space-y-2">
            {services.map((service) => (
              <li key={service.id} className="bg-gray-100 p-3 rounded flex justify-between items-center">
                <span className={`text-gray-800 ${service.paused ? 'line-through' : ''}`}>{service.name} ({service.duration} min)</span>
                <div className="flex space-x-2">
                  <button onClick={() => toggleServicePause(service.id)} className="text-blue-600 hover:text-blue-800 p-1 rounded">
                    {service.paused ? <Play size={20} /> : <Pause size={20} />}
                  </button>
                  <button onClick={() => deleteService(service.id)} className="text-red-600 hover:text-red-800 p-1 rounded">
                    <Trash size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Plages horaires</h2>
          <form onSubmit={addTimeSlot} className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="time"
                value={newSlotStart}
                onChange={(e) => setNewSlotStart(e.target.value)}
                className="w-full p-2 border rounded bg-gray-50 text-gray-800"
                required
              />
              <input
                type="time"
                value={newSlotEnd}
                onChange={(e) => setNewSlotEnd(e.target.value)}
                className="w-full p-2 border rounded bg-gray-50 text-gray-800"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 flex items-center justify-center">
              <Plus size={20} className="mr-2" />
              Ajouter la plage horaire
            </button>
          </form>
          <ul className="space-y-2">
            {timeSlots.map((slot, index) => (
              <li key={index} className="bg-gray-100 p-3 rounded flex justify-between items-center">
                <span className="text-gray-800">{slot.start} - {slot.end}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Périodes de vacances</h2>
          <form onSubmit={addHoliday} className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="holidayStart" className="block mb-1 text-sm font-medium text-gray-700">Début</label>
                <input
                  type="date"
                  id="holidayStart"
                  value={newHolidayStart}
                  onChange={(e) => setNewHolidayStart(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-50 text-gray-800"
                  required
                />
              </div>
              <div>
                <label htmlFor="holidayEnd" className="block mb-1 text-sm font-medium text-gray-700">Fin</label>
                <input
                  type="date"
                  id="holidayEnd"
                  value={newHolidayEnd}
                  onChange={(e) => setNewHolidayEnd(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-50 text-gray-800"
                  required
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 flex items-center justify-center">
              <Calendar size={20} className="mr-2" />
              Ajouter la période de vacances
            </button>
          </form>
          <ul className="space-y-2">
            {holidays.map((holiday, index) => (
              <li key={index} className="bg-gray-100 p-3 rounded flex justify-between items-center">
                <span className="text-gray-800">Du {new Date(holiday.start).toLocaleDateString()} au {new Date(holiday.end).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Clients absents</h2>
          <ul className="space-y-2">
            {noShowClients.map((client, index) => (
              <li key={index} className="bg-gray-100 p-3 rounded">
                <p className="font-medium text-gray-800">{client.fullName}</p>
                <p className="text-sm text-gray-600">{client.email}</p>
                <p className="text-sm text-gray-600">Date: {client.date}</p>
                <p className="text-sm text-gray-600">Service: {client.service}</p>
                <p className="text-sm text-red-600">Absences: {client.count}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;