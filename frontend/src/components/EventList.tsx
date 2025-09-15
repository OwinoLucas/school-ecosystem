"use client";
import { useState, useEffect } from 'react';
// import api from '@/services/api';

interface Event {
  id: number;
  title: string;
  description: string;
  startTime: Date;
}

const EventList = ({ dateParam }: { dateParam: string | undefined }) => {
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // TODO: Implement API call to fetch events from Django backend
        // const date = dateParam ? new Date(dateParam) : new Date();
        // const response = await api.get(`/events/?date=${date.toISOString()}`);
        // setData(response.data);
        
        // Mock data for now
        const mockEvents: Event[] = [
          {
            id: 1,
            title: "Math Competition",
            description: "Annual mathematics competition for all grades.",
            startTime: new Date(2024, 0, 15, 10, 0),
          },
          {
            id: 2,
            title: "Science Fair",
            description: "Student science projects exhibition.",
            startTime: new Date(2024, 0, 15, 14, 0),
          },
        ];
        setData(mockEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [dateParam]);
  
  if (loading) {
    return <div>Loading events...</div>;
  }

  return data.map((event) => (
    <div
      className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
      key={event.id}
    >
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-gray-600">{event.title}</h1>
        <span className="text-gray-300 text-xs">
          {event.startTime.toLocaleTimeString("en-UK", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>
      </div>
      <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
    </div>
  ));
};

export default EventList;
