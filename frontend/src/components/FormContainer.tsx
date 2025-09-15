"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import FormModal from "./FormModal";
import { useState, useEffect } from "react";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = ({ table, type, data, id }: FormContainerProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [relatedData, setRelatedData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const role = user?.user_type?.toLowerCase();
  const currentUserId = user?.id;

  useEffect(() => {
    const fetchRelatedData = async () => {
      if (type === "delete") return;
      
      setLoading(true);
      try {
        // TODO: Implement API calls to fetch related data from Django backend
        // This will be implemented when connecting to the actual backend
        switch (table) {
          case "subject":
            // setRelatedData({ teachers: await api.get('/teachers/') });
            break;
          case "class":
            // setRelatedData({ teachers: await api.get('/teachers/'), grades: await api.get('/grades/') });
            break;
          case "teacher":
            // setRelatedData({ subjects: await api.get('/subjects/') });
            break;
          case "student":
            // setRelatedData({ classes: await api.get('/classes/'), grades: await api.get('/grades/') });
            break;
          case "exam":
            // setRelatedData({ lessons: await api.get('/lessons/') });
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('Error fetching related data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedData();
  }, [table, type, role, currentUserId]);

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
