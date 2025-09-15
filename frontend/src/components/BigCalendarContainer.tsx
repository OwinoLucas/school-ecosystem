"use client";
import { useState, useEffect } from 'react';
import BigCalendar from "./BigCalender";
// import { adjustScheduleToCurrentWeek } from "@/lib/utils";
// import api from '@/services/api';

interface LessonEvent {
  title: string;
  start: Date;
  end: Date;
}

const BigCalendarContainer = ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  const [schedule, setSchedule] = useState<LessonEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        // TODO: Implement API call to fetch lessons from Django backend
        // const endpoint = type === "teacherId" ? `/lessons/?teacher=${id}` : `/lessons/?class=${id}`;
        // const response = await api.get(endpoint);
        // const data = response.data.map((lesson) => ({
        //   title: lesson.name,
        //   start: new Date(lesson.start_time),
        //   end: new Date(lesson.end_time),
        // }));
        // const adjustedSchedule = adjustScheduleToCurrentWeek(data);
        // setSchedule(adjustedSchedule);
        
        // Mock data for now
        const mockData: LessonEvent[] = [
          {
            title: "Mathematics",
            start: new Date(2024, 0, 15, 9, 0),
            end: new Date(2024, 0, 15, 10, 0),
          },
          {
            title: "English",
            start: new Date(2024, 0, 15, 10, 0),
            end: new Date(2024, 0, 15, 11, 0),
          },
        ];
        setSchedule(mockData);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [type, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="">
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;
