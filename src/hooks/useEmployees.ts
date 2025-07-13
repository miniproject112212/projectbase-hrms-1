
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Employee {
  id: string;
  employee_id: string;
  name: string;
  email: string;
  phone: string | null;
  position: string;
  department: string;
  location: string | null;
  join_date: string;
  status: string;
  avatar_url: string | null;
  basic_salary: number;
  hra: number;
  allowances: number;
  created_at: string;
  updated_at: string;
}

export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      console.log('Fetching employees...');
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching employees:', error);
        throw error;
      }
      console.log('Employees fetched:', data);
      return data as Employee[];
    },
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating employee:', employee);
      const { data, error } = await supabase
        .from('employees')
        .insert([employee])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating employee:', error);
        throw error;
      }
      console.log('Employee created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, employee }: { id: string; employee: Partial<Omit<Employee, 'id' | 'created_at' | 'updated_at'>> }) => {
      console.log('Updating employee:', id, employee);
      const { data, error } = await supabase
        .from('employees')
        .update({
          ...employee,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating employee:', error);
        throw error;
      }
      console.log('Employee updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
