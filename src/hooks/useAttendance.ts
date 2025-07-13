
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'on_leave';
  check_in_time: string | null;
  check_out_time: string | null;
  notes: string | null;
  created_at: string;
  employees: {
    name: string;
    employee_id: string;
  };
}

export const useAttendance = (date?: string) => {
  return useQuery({
    queryKey: ['attendance', date],
    queryFn: async () => {
      console.log('Fetching attendance for date:', date);
      let query = supabase
        .from('attendance')
        .select(`
          *,
          employees (
            name,
            employee_id
          )
        `)
        .order('date', { ascending: false });
      
      if (date) {
        query = query.eq('date', date);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching attendance:', error);
        throw error;
      }
      console.log('Attendance fetched:', data);
      return data as AttendanceRecord[];
    },
  });
};

export const useAttendanceStats = () => {
  return useQuery({
    queryKey: ['attendance-stats'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      console.log('Fetching attendance stats for:', today);
      
      const { data, error } = await supabase
        .from('attendance')
        .select('status')
        .eq('date', today);
      
      if (error) {
        console.error('Error fetching attendance stats:', error);
        throw error;
      }
      
      const stats = {
        present: data.filter(r => r.status === 'present').length,
        late: data.filter(r => r.status === 'late').length,
        absent: data.filter(r => r.status === 'absent').length,
        on_leave: data.filter(r => r.status === 'on_leave').length,
      };
      
      const total = stats.present + stats.late + stats.absent + stats.on_leave;
      
      const result = {
        ...stats,
        total,
        presentPercentage: total > 0 ? Math.round((stats.present / total) * 100) : 0,
      };
      
      console.log('Attendance stats:', result);
      return result;
    },
  });
};
