"use client";
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
// import api from '@/services/api';

interface Announcement {
  id: number;
  title: string;
  description: string;
  date: string;
}

const Announcements = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        // TODO: Implement API call to fetch announcements from Django backend
        // const response = await api.get('/announcements/');
        // setData(response.data.slice(0, 3));
        
        // Mock data for now
        const mockData = [
          {
            id: 1,
            title: "School Sports Day",
            description: "Annual sports competition will be held next Friday. All students are encouraged to participate.",
            date: "2024-01-15T10:00:00Z"
          },
          {
            id: 2,
            title: "Parent-Teacher Conference",
            description: "Monthly parent-teacher meeting scheduled for next Tuesday at 2 PM.",
            date: "2024-01-12T14:00:00Z"
          },
          {
            id: 3,
            title: "Library Hours Extended",
            description: "Library will now be open until 8 PM on weekdays to accommodate student study needs.",
            date: "2024-01-10T09:00:00Z"
          }
        ];
        setData(mockData);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [user]);

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data[0] && (
          <div className="bg-lamaSkyLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[0].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(new Date(data[0].date))}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[0].description}</p>
          </div>
        )}
        {data[1] && (
          <div className="bg-lamaPurpleLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[1].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(new Date(data[1].date))}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[1].description}</p>
          </div>
        )}
        {data[2] && (
          <div className="bg-lamaYellowLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[2].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(new Date(data[2].date))}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[2].description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
