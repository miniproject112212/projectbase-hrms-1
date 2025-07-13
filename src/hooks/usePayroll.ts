
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PayrollRecord {
  id: string;
  employee_id: string;
  pay_period_start: string;
  pay_period_end: string;
  basic_salary: number;
  hra: number;
  allowances: number;
  deductions: number;
  gross_pay: number;
  net_pay: number;
  status: 'draft' | 'processed' | 'paid';
  processed_at?: string;
  created_at: string;
  updated_at: string;
  employees?: {
    name: string;
    employee_id: string;
  };
}

export const usePayroll = () => {
  return useQuery({
    queryKey: ['payroll'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payroll')
        .select('*, employees(name, employee_id)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PayrollRecord[];
    },
  });
};

export const usePayrollStats = () => {
  return useQuery({
    queryKey: ['payroll-stats'],
    queryFn: async () => {
      console.log('Fetching payroll stats...');
      const { data, error } = await supabase
        .from('payroll')
        .select('net_pay, status');
      
      if (error) {
        console.error('Error fetching payroll stats:', error);
        throw error;
      }

      const stats = {
        totalPayroll: data.reduce((sum, record) => sum + (record.net_pay || 0), 0),
        processedCount: data.filter(record => record.status === 'processed' || record.status === 'paid').length,
        pendingCount: data.filter(record => record.status === 'draft').length,
        totalEmployees: data.length,
      };

      console.log('Payroll stats:', stats);
      return stats;
    },
  });
};

export const useCreatePayroll = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (payrollData: Omit<PayrollRecord, 'id' | 'created_at' | 'updated_at' | 'employees'>) => {
      const { data, error } = await supabase
        .from('payroll')
        .insert([payrollData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      queryClient.invalidateQueries({ queryKey: ['payroll-stats'] });
      toast({
        title: "Success!",
        description: "Payroll record created successfully.",
      });
    },
    onError: (error) => {
      console.error('Error creating payroll:', error);
      toast({
        title: "Error",
        description: "Failed to create payroll record. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdatePayroll = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PayrollRecord> }) => {
      const { data, error } = await supabase
        .from('payroll')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      queryClient.invalidateQueries({ queryKey: ['payroll-stats'] });
      toast({
        title: "Success!",
        description: "Payroll record updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating payroll:', error);
      toast({
        title: "Error",
        description: "Failed to update payroll record. Please try again.",
        variant: "destructive",
      });
    },
  });
};
