"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Assignment, Class, Subject, Teacher } from "@/lib/types";
import { mockDataService } from "@/services/apiService";
import Image from "next/image";

type AssignmentList = Assignment & {
  lesson: {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
};

interface AssignmentListPageProps {
  searchParams: { [key: string]: string | undefined };
}

const AssignmentListPage = ({ searchParams }: AssignmentListPageProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.user_type?.toLowerCase() || "student";
  const currentUserId = user?.id?.toString() || "";
  const [data, setData] = useState<AssignmentList[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  
  const columns = [
    {
      header: "Subject Name",
      accessor: "name",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Due Date",
      accessor: "dueDate",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "teacher"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];
  
  const renderRow = (item: AssignmentList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.lesson.subject.name}</td>
      <td>{item.lesson.class.name}</td>
      <td className="hidden md:table-cell">
        {item.lesson.teacher.name + " " + item.lesson.teacher.surname}
      </td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.dueDate)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormModal table="assignment" type="update" data={item} />
              <FormModal table="assignment" type="delete" id={item.id} />
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
                case "classId":
                  query.classId = parseInt(value);
                  break;
                case "teacherId":
                  query.teacherId = value;
                  break;
                case "search":
                  query.search = value;
                  break;
                default:
                  break;
              }
            }
          }
        }

        // Role-based filtering
        switch (role) {
          case "admin":
            break;
          case "teacher":
            query.teacherId = currentUserId;
            break;
          case "student":
            query.studentId = currentUserId;
            break;
          case "parent":
            query.parentId = currentUserId;
            break;
          default:
            break;
        }

        // Use mock data service temporarily
        const [assignmentsData, assignmentsCount] = await mockDataService.$transaction([
          mockDataService.assignments.findMany({
            where: query,
            include: {
              lesson: {
                select: {
                  subject: { select: { name: true } },
                  teacher: { select: { name: true, surname: true } },
                  class: { select: { name: true } },
                },
              },
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
          }),
          mockDataService.assignments.count({ where: query }),
        ]);
        
        setData(assignmentsData);
        setCount(assignmentsCount);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setData([]);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [searchParams, role, currentUserId]);
  
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
        <h1 className="hidden md:block text-lg font-semibold">
          All Assignments
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" ||
              (role === "teacher" && (
                <FormModal table="assignment" type="create" />
              ))}
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

export default AssignmentListPage;
