
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type: 'annual' | 'sick' | 'casual';
  start_date: string;
  end_date: string;
  days_count: number;
  reason: string | null;
  status: 'pending' | 'approved' | 'rejected';
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  employees: {
    name: string;
    employee_id: string;
  } | null;
}

export const useLeaveRequests = () => {
  return useQuery({
    queryKey: ['leave-requests'],
    queryFn: async () => {
      console.log('Fetching leave requests...');
      const { data, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          employees!leave_requests_employee_id_fkey (
            name,
            employee_id
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching leave requests:', error);
        throw error;
      }
      console.log('Leave requests fetched:', data);
      return data;
    },
  });
};

export const useLeaveStats = () => {
  return useQuery({
    queryKey: ['leave-stats'],
    queryFn: async () => {
      console.log('Fetching leave stats...');
      const { data, error } = await supabase
        .from('leave_requests')
        .select('leave_type, status, days_count');
      
      if (error) {
        console.error('Error fetching leave stats:', error);
        throw error;
      }
      
      const stats = {
        total: data?.length || 0,
        pending: data?.filter(r => r.status === 'pending').length || 0,
        approved: data?.filter(r => r.status === 'approved').length || 0,
        rejected: data?.filter(r => r.status === 'rejected').length || 0,
        annual: data?.filter(r => r.leave_type === 'annual').length || 0,
        sick: data?.filter(r => r.leave_type === 'sick').length || 0,
        casual: data?.filter(r => r.leave_type === 'casual').length || 0,
      };
      
      console.log('Leave stats:', stats);
      return stats;
    },
  });
};

export const useUpdateLeaveStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
      console.log('Updating leave status:', { id, status });
      const { data, error } = await supabase
        .from('leave_requests')
        .update({ 
          status,
          approved_at: status === 'approved' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error updating leave status:', error);
        throw error;
      }
      
      console.log('Leave status updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      queryClient.invalidateQueries({ queryKey: ['leave-stats'] });
    },
  });
};

export const useCreateLeaveRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (leaveData: {
      employee_id: string;
      leave_type: string;
      start_date: string;
      end_date: string;
      days_count: number;
      reason?: string;
    }) => {
      console.log('Creating leave request:', leaveData);
      const { data, error } = await supabase
        .from('leave_requests')
        .insert([{
          ...leaveData,
          status: 'pending'
        }])
        .select();
      
      if (error) {
        console.error('Error creating leave request:', error);
        throw error;
      }
      
      console.log('Leave request created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      queryClient.invalidateQueries({ queryKey: ['leave-stats'] });
    },
  });
};
