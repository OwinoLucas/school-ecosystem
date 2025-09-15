"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import AttendanceChart from "./AttendanceChart";
import { mockDataService } from "@/services/apiService";

const AttendanceChartContainer = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const lastMonday = new Date(today);
        lastMonday.setDate(today.getDate() - daysSinceMonday);

        // Use mock data service temporarily
        const resData = await mockDataService.attendance.findMany({
          where: {
            date: {
              gte: lastMonday,
            },
          },
          select: {
            date: true,
            present: true,
          },
        });

        const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];

        const attendanceMap: { [key: string]: { present: number; absent: number } } = {
          Mon: { present: 0, absent: 0 },
          Tue: { present: 0, absent: 0 },
          Wed: { present: 0, absent: 0 },
          Thu: { present: 0, absent: 0 },
          Fri: { present: 0, absent: 0 },
        };

        resData.forEach((item: any) => {
          const itemDate = new Date(item.date);
          const dayOfWeek = itemDate.getDay();
          
          if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            const dayName = daysOfWeek[dayOfWeek - 1];

            if (item.present) {
              attendanceMap[dayName].present += 1;
            } else {
              attendanceMap[dayName].absent += 1;
            }
          }
        });

        const chartData = daysOfWeek.map((day) => ({
          name: day,
          present: attendanceMap[day].present,
          absent: attendanceMap[day].absent,
        }));

        setData(chartData);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 h-full">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">Attendance</h1>
          <Image src="/moreDark.png" alt="" width={20} height={20} />
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <AttendanceChart data={data}/>
    </div>
  );
};

export default AttendanceChartContainer;
