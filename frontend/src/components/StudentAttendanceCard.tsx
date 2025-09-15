"use client";
import { useState, useEffect } from 'react';
// import api from '@/services/api';

const StudentAttendanceCard = ({ id }: { id: string }) => {
  const [percentage, setPercentage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // TODO: Implement API call to fetch attendance from Django backend
        // const response = await api.get(`/attendance/?student=${id}`);
        // const attendance = response.data;
        // const totalDays = attendance.length;
        // const presentDays = attendance.filter(day => day.present).length;
        // const calculatedPercentage = (presentDays / totalDays) * 100;
        // setPercentage(calculatedPercentage);
        
        // Mock data for now
        setPercentage(85);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendance();
  }, [id]);
  return (
    <div className="">
      <h1 className="text-xl font-semibold">
        {loading ? "..." : percentage !== null ? `${percentage}%` : "-"}
      </h1>
      <span className="text-sm text-gray-400">Attendance</span>
    </div>
  );
};

export default StudentAttendanceCard;
