import api from './api';
import {
  Student,
  Teacher,
  Parent,
  Subject,
  Class,
  Grade,
  Lesson,
  Exam,
  Assignment,
  Result,
  Attendance,
  Event,
  Announcement,
  QueryParams,
  PaginatedResponse,
  StudentList,
  TeacherList,
  ParentList,
} from '@/lib/types';

// Generic API functions
const createApiService = <T>(endpoint: string) => ({
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<T>> => {
    const response = await api.get(endpoint, { params });
    return response.data;
  },
  
  getById: async (id: number): Promise<T> => {
    const response = await api.get(`${endpoint}/${id}/`);
    return response.data;
  },
  
  create: async (data: Partial<T>): Promise<T> => {
    const response = await api.post(`${endpoint}/`, data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<T>): Promise<T> => {
    const response = await api.put(`${endpoint}/${id}/`, data);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`${endpoint}/${id}/`);
  },
});

// Specific API services
export const studentService = {
  ...createApiService<Student>('/students'),
  
  getStudentsByParent: async (parentId: string): Promise<Student[]> => {
    const response = await api.get(`/students/?parent=${parentId}`);
    return response.data.results || response.data;
  },
  
  getStudentsByClass: async (classId: number): Promise<Student[]> => {
    const response = await api.get(`/students/?class=${classId}`);
    return response.data.results || response.data;
  },
};

export const teacherService = {
  ...createApiService<Teacher>('/teachers'),
  
  getTeachersBySubject: async (subjectId: number): Promise<Teacher[]> => {
    const response = await api.get(`/teachers/?subject=${subjectId}`);
    return response.data.results || response.data;
  },
};

export const parentService = createApiService<Parent>('/parents');
export const subjectService = createApiService<Subject>('/subjects');
export const classService = createApiService<Class>('/classes');
export const gradeService = createApiService<Grade>('/grades');
export const lessonService = createApiService<Lesson>('/lessons');
export const examService = createApiService<Exam>('/exams');
export const assignmentService = createApiService<Assignment>('/assignments');
export const resultService = createApiService<Result>('/results');
export const attendanceService = createApiService<Attendance>('/attendance');
export const eventService = createApiService<Event>('/events');
export const announcementService = createApiService<Announcement>('/announcements');

// Mock data service (temporary replacement for Prisma queries)
// This provides dummy data until the Django backend is fully connected
export const mockDataService = {
  students: {
    findMany: async (options?: {
      where?: any;
      include?: any;
      take?: number;
      skip?: number;
    }): Promise<StudentList[]> => {
      // Mock data - replace with actual API calls
      return [];
    },
    
    count: async (options?: { where?: any }): Promise<number> => {
      return 0;
    },
    
    findUnique: async (options: { where: { id: number } }): Promise<Student | null> => {
      return null;
    },
  },
  
  teachers: {
    findMany: async (options?: {
      where?: any;
      include?: any;
      take?: number;
      skip?: number;
    }): Promise<TeacherList[]> => {
      return [];
    },
    
    count: async (options?: { where?: any }): Promise<number> => {
      return 0;
    },
    
    findUnique: async (options: { where: { id: number } }): Promise<Teacher | null> => {
      return null;
    },
  },
  
  parents: {
    findMany: async (options?: {
      where?: any;
      include?: any;
      take?: number;
      skip?: number;
    }): Promise<ParentList[]> => {
      return [];
    },
    
    count: async (options?: { where?: any }): Promise<number> => {
      return 0;
    },
  },
  
  subjects: {
    findMany: async (options?: {
      where?: any;
      include?: any;
      take?: number;
      skip?: number;
    }): Promise<Subject[]> => {
      return [];
    },
    
    count: async (options?: { where?: any }): Promise<number> => {
      return 0;
    },
  },
  
  classes: {
    findMany: async (options?: {
      where?: any;
      include?: any;
      take?: number;
      skip?: number;
    }): Promise<Class[]> => {
      return [];
    },
    
    count: async (options?: { where?: any }): Promise<number> => {
      return 0;
    },
  },
  
  lessons: {
    findMany: async (options?: {
      where?: any;
      include?: any;
      take?: number;
      skip?: number;
    }): Promise<Lesson[]> => {
      return [];
    },
    
    count: async (options?: { where?: any }): Promise<number> => {
      return 0;
    },
  },
  
  exams: {
    findMany: async (options?: {
      where?: any;
      include?: any;
      take?: number;
      skip?: number;
    }): Promise<Exam[]> => {
      return [];
    },
    
    count: async (options?: { where?: any }): Promise<number> => {
      return 0;
    },
  },
  
  assignments: {
    findMany: async (options?: {
      where?: any;
      include?: any;
      take?: number;
      skip?: number;
    }): Promise<Assignment[]> => {
      return [];
    },
    
    count: async (options?: { where?: any }): Promise<number> => {
      return 0;
    },
  },
  
  results: {
    findMany: async (options?: {
      where?: any;
      include?: any;
      take?: number;
      skip?: number;
    }): Promise<Result[]> => {
      return [];
    },
    
    count: async (options?: { where?: any }): Promise<number> => {
      return 0;
    },
  },
  
  events: {
    findMany: async (options?: {
      where?: any;
      include?: any;
      take?: number;
      skip?: number;
    }): Promise<Event[]> => {
      return [];
    },
    
    count: async (options?: { where?: any }): Promise<number> => {
      return 0;
    },
  },
  
  announcements: {
    findMany: async (options?: {
      where?: any;
      include?: any;
      take?: number;
      skip?: number;
    }): Promise<Announcement[]> => {
      return [];
    },
    
    count: async (options?: { where?: any }): Promise<number> => {
      return 0;
    },
  },
  
  // Transaction method to mimic Prisma's $transaction
  $transaction: async (queries: any[]): Promise<any[]> => {
    const results = await Promise.all(queries);
    return results;
  },
};