import React, { useState, useEffect } from 'react';
import { format, isWeekend, isWithinInterval, parse, addMinutes, isSunday, setHours, setMinutes, isAfter, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Service {
  id: number;
  name: string;
  duration: number;
  paused: boolean;
}

interface Holiday {
  start: Date;
  end: Date;
}

interface Booking {
  service: string;
  date: string;
  slot: string;
  email: string;
  fullName: string;
}

interface TimeSlot {
  start: string;
  end: string;
}

const Booking: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [noShowClients, setNoShowClients] = useState<{ email: string; count: number }[]>([]);

  useEffect(() => {
    const loadedServices = JSON.parse(localStorage.getItem('services') || '[]');
    setServices(loadedServices.filter((service: Service) => !service.paused));
    const loadedHolidays = JSON.parse(localStorage.getItem('holidays') || '[]');
    setHolidays(loadedHolidays.map((holiday: any) => ({
      start: new Date(holiday.start),
      end: new Date(holiday.end)
    })));
    const loadedTimeSlots = JSON.parse(localStorage.getItem('timeSlots') || '[]');
    setTimeSlots(loadedTimeSlots);
    const loadedNoShowClients = JSON.parse(localStorage.getItem('noShowClients') || '[]');
    setNoShowClients(loadedNoShowClients);
  }, []);

  const isSlotAvailable = (slot: string, bookedSlots: Booking[], serviceDuration: number) => {
    const [slotStart, slotEnd] = slot.split('-').map(time => parse(time, 'HH:mm', new Date()));
    return !bookedSlots.some(booking => {
      const [bookedStart, bookedEnd] = booking.slot.split('-').map(time => parse(time, 'HH:mm', new Date()));
      return (
        (slotStart < bookedEnd && bookedStart < addMinutes(slotEnd, 1)) ||
        (bookedStart < addMinutes(slotEnd, 1) && slotStart < bookedEnd)
      );
    });
  };

  const generateTimeSlots = (startTime: string, endTime: string, duration: number, bookedSlots: Booking[]) => {
    const slots = [];
    let currentTime = parse(startTime, 'HH:mm', new Date());
    const end = parse(endTime, 'HH:mm', new Date());

    while (currentTime < end) {
      const slotEnd = addMinutes(currentTime, duration);
      if (slotEnd <= end) {
        const slot = `${format(currentTime, 'HH:mm')}-${format(slotEnd, 'HH:mm')}`;
        if (isSlotAvailable(slot, bookedSlots, duration)) {
          slots.push(slot);
        }
      }
      currentTime = addMinutes(currentTime, 15); // Incrémente de 15 minutes pour plus de flexibilité
    }

    return slots;
  };

  const isDateAvailable = (date: Date) => {
    return !isWeekend(date) && !isSunday(date) && !holidays.some(holiday => 
      isWithinInterval(date, { start: holiday.start, end: holiday.end })
    );
  };

  useEffect(() => {
    if (selectedService && selectedDate) {
      const service = services.find(s => s.name === selectedService);
      if (service) {
        const bookedSlots: Booking[] = JSON.parse(localStorage.getItem('bookings') || '[]')
          .filter((booking: Booking) => booking.date === selectedDate);
        
        // Trier les créneaux réservés par heure de début
        bookedSlots.sort((a, b) => {
          const timeA = parse(a.slot.split('-')[0], 'HH:mm', new Date());
          const timeB = parse(b.slot.split('-')[0], 'HH:mm', new Date());
          return timeA.getTime() - timeB.getTime();
        });

        let availableSlots: string[] = [];

        timeSlots.forEach((timeSlot) => {
          const slotsInRange = generateTimeSlots(
            timeSlot.start,
            timeSlot.end,
            service.duration,
            bookedSlots
          );
          availableSlots = availableSlots.concat(slotsInRange);
        });

        setAvailableSlots(availableSlots);
      }
    }
  }, [selectedService, selectedDate, services, timeSlots]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const noShowClient = noShowClients.find(client => client.email === email);
    if (noShowClient && noShowClient.count >= 3) {
      alert("Vous n'avez pas honoré vos rendez-vous à 3 reprises. Par conséquent, en accord avec nos règles, vous n'êtes pas autorisé à reprendre rendez-vous.");
      return;
    }

    const booking = {
      service: selectedService,
      date: selectedDate,
      slot: selectedSlot,
      email,
      fullName
    };
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...existingBookings, booking]));
    alert('Rendez-vous réservé avec succès ! Un email de confirmation vous sera envoyé.');
    // Réinitialiser le formulaire
    setSelectedService('');
    setSelectedDate('');
    setSelectedSlot('');
    setEmail('');
    setFullName('');
    
    // Envoyer un email de confirmation (simulation)
    console.log(`Email de confirmation envoyé à ${email} pour le rendez-vous du ${selectedDate} à ${selectedSlot}`);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Réserver un rendez-vous</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="service" className="block mb-2 font-medium text-gray-700">Service</label>
          <select
            id="service"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full p-2 border rounded bg-white text-gray-800"
            required
          >
            <option value="">Sélectionnez un service</option>
            {services.map((service) => (
              <option key={service.id} value={service.name}>{service.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="block mb-2 font-medium text-gray-700">Date</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border rounded bg-white text-gray-800"
            required
            min={new Date().toISOString().split('T')[0]}
            max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label htmlFor="slot" className="block mb-2 font-medium text-gray-700">Créneau horaire</label>
          <select
            id="slot"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            className="w-full p-2 border rounded bg-white text-gray-800"
            required
            disabled={!selectedDate || !isDateAvailable(new Date(selectedDate))}
          >
            <option value="">Sélectionnez un créneau</option>
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
          {selectedDate && !isDateAvailable(new Date(selectedDate)) && (
            <p className="text-red-500 text-sm mt-1">Cette date n'est pas disponible pour les réservations.</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded bg-white text-gray-800"
            required
          />
        </div>
        <div>
          <label htmlFor="fullName" className="block mb-2 font-medium text-gray-700">Nom et prénom</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border rounded bg-white text-gray-800"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
          Réserver
        </button>
      </form>
    </div>
  );
};

export default Booking;