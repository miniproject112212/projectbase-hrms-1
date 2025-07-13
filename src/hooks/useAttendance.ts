
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'on_leave';
  check_in_time?: string;
  check_out_time?: string;
  notes?: string;
  created_at: string;
  employees?: {
    name: string;
    employee_id: string;
  };
}

export const useAttendance = (date?: string) => {
  return useQuery({
    queryKey: ['attendance', date],
    queryFn: async () => {
      let query = supabase
        .from('attendance')
        .select('*, employees(name, employee_id)')
        .order('date', { ascending: false });

      if (date) {
        query = query.eq('date', date);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as AttendanceRecord[];
    },
  });
};

export const useAttendanceStats = () => {
  const today = new Date().toISOString().split('T')[0];
  
  return useQuery({
    queryKey: ['attendance-stats', today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select('status')
        .eq('date', today);

      if (error) throw error;

      const stats = {
        present: data.filter(record => record.status === 'present').length,
        absent: data.filter(record => record.status === 'absent').length,
        late: data.filter(record => record.status === 'late').length,
        on_leave: data.filter(record => record.status === 'on_leave').length,
        total: data.length,
        presentPercentage: data.length > 0 ? Math.round((data.filter(record => record.status === 'present').length / data.length) * 100) : 0,
      };

      return stats;
    },
  });
};

export const useCreateAttendance = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (attendance: Omit<AttendanceRecord, 'id' | 'created_at' | 'employees'>) => {
      const { data, error } = await supabase
        .from('attendance')
        .insert([attendance])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-stats'] });
      toast({
        title: "Success!",
        description: "Attendance record created successfully.",
      });
    },
    onError: (error) => {
      console.error('Error creating attendance:', error);
      toast({
        title: "Error",
        description: "Failed to create attendance record. Please try again.",
        variant: "destructive",
      });
    },
  });
};
