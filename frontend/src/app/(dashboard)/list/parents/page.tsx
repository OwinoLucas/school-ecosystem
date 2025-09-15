"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { ParentList } from "@/lib/types";
import { mockDataService } from "@/services/apiService";
import Image from "next/image";

interface ParentListPageProps {
  searchParams: { [key: string]: string | undefined };
}

const ParentListPage = ({ searchParams }: ParentListPageProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.user_type?.toLowerCase() || "student";
  const [data, setData] = useState<ParentList[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Student Names",
    accessor: "students",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  ...(role === "admin"
    ? [
        {
          header: "Actions",
          accessor: "action",
        },
      ]
    : []),
];

const renderRow = (item: ParentList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-500">{item?.email}</p>
      </div>
    </td>
    <td className="hidden md:table-cell">
      {item.students.map((student) => student.name).join(",")}
    </td>
    <td className="hidden md:table-cell">{item.phone}</td>
    <td className="hidden md:table-cell">{item.address}</td>
    <td>
      <div className="flex items-center gap-2">
        {role === "admin" && (
          <>
            <FormContainer table="parent" type="update" data={item} />
            <FormContainer table="parent" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { page, ...queryParams } = searchParams;
        const p = page ? parseInt(page) : 1;

        // Build query object for filtering
        const query: any = {};
        
        if (queryParams) {
          for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
              switch (key) {
                case "search":
                  query.search = value;
                  break;
                default:
                  break;
              }
            }
          }
        }

        // Use mock data service temporarily
        const [parentsData, parentsCount] = await mockDataService.$transaction([
          mockDataService.parents.findMany({
            where: query,
            include: {
              students: true,
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
          }),
          mockDataService.parents.count({ where: query }),
        ]);
        
        setData(parentsData);
        setCount(parentsCount);
      } catch (error) {
        console.error('Error fetching parents:', error);
        setData([]);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [searchParams]);
  
  const { page } = searchParams;
  const p = page ? parseInt(page) : 1;
  
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="parent" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ParentListPage;
