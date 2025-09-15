"use client";
import { useState, useEffect } from 'react';
import Image from "next/image";
// import api from '@/services/api';

const UserCard = ({
  type,
}: {
  type: "admin" | "teacher" | "student" | "parent";
}) => {
  const [data, setData] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Implement API call to get counts from Django backend
        // const response = await api.get(`/${type}s/count/`);
        // setData(response.data.count);
        
        // Mock data for now
        const mockCounts = {
          admin: 5,
          teacher: 45,
          student: 1200,
          parent: 900
        };
        setData(mockCounts[type]);
      } catch (error) {
        console.error(`Error fetching ${type} count:`, error);
        setData(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  return (
    <div className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{loading ? "..." : data}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}s</h2>
    </div>
  );
};

export default UserCard;
