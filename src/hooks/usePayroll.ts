
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  status: string;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
  employees: {
    name: string;
    employee_id: string;
    department: string;
  };
}

export const usePayroll = (payPeriod?: string) => {
  return useQuery({
    queryKey: ['payroll', payPeriod],
    queryFn: async () => {
      console.log('Fetching payroll for period:', payPeriod);
      let query = supabase
        .from('payroll')
        .select(`
          *,
          employees (
            name,
            employee_id,
            department
          )
        `)
        .order('created_at', { ascending: false });
      
      if (payPeriod) {
        query = query.eq('pay_period_start', payPeriod);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching payroll:', error);
        throw error;
      }
      console.log('Payroll fetched:', data);
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
        .select('net_pay, status, employees(*)');
      
      if (error) {
        console.error('Error fetching payroll stats:', error);
        throw error;
      }
      
      const totalPayroll = data.reduce((sum, record) => sum + record.net_pay, 0);
      const processedCount = data.filter(r => r.status === 'processed').length;
      const pendingCount = data.filter(r => r.status === 'draft').length;
      const totalEmployees = data.length;
      
      const result = {
        totalPayroll,
        processedCount,
        pendingCount,
        totalEmployees,
      };
      
      console.log('Payroll stats:', result);
      return result;
    },
  });
};

export const useGeneratePayroll = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      console.log('Generating payroll...');
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select('*')
        .eq('status', 'active');
      
      if (employeesError) {
        console.error('Error fetching employees for payroll:', employeesError);
        throw employeesError;
      }
      
      const payPeriodStart = new Date();
      payPeriodStart.setDate(1); // First day of current month
      const payPeriodEnd = new Date(payPeriodStart);
      payPeriodEnd.setMonth(payPeriodEnd.getMonth() + 1);
      payPeriodEnd.setDate(0); // Last day of current month
      
      const payrollRecords = employees.map(employee => {
        const grossPay = employee.basic_salary + employee.hra + employee.allowances;
        const deductions = grossPay * 0.12; // 12% deductions
        const netPay = grossPay - deductions;
        
        return {
          employee_id: employee.id,
          pay_period_start: payPeriodStart.toISOString().split('T')[0],
          pay_period_end: payPeriodEnd.toISOString().split('T')[0],
          basic_salary: employee.basic_salary,
          hra: employee.hra,
          allowances: employee.allowances,
          deductions,
          gross_pay: grossPay,
          net_pay: netPay,
          status: 'processed',
          processed_at: new Date().toISOString(),
        };
      });
      
      console.log('Inserting payroll records:', payrollRecords);
      const { data, error } = await supabase
        .from('payroll')
        .upsert(payrollRecords, { 
          onConflict: 'employee_id,pay_period_start,pay_period_end' 
        })
        .select();
      
      if (error) {
        console.error('Error generating payroll:', error);
        throw error;
      }
      console.log('Payroll generated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      queryClient.invalidateQueries({ queryKey: ['payroll-stats'] });
    },
  });
};
