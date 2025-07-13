
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface DepartmentData {
  department: string;
  amount: number;
  count: number;
}

const PayrollReport = () => {
  const { data: payroll = [] } = useQuery({
    queryKey: ['payrollReport'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payroll')
        .select(`
          *,
          employees (name, department)
        `);
      if (error) throw error;
      return data;
    }
  });

  // Process data for chart - group by department
  const departmentPayroll = React.useMemo(() => {
    const deptData: Record<string, DepartmentData> = {};
    
    payroll.forEach(record => {
      const dept = record.employees?.department || 'Unknown';
      if (!deptData[dept]) {
        deptData[dept] = { department: dept, amount: 0, count: 0 };
      }
      deptData[dept].amount += record.net_pay || 0;
      deptData[dept].count += 1;
    });

    return Object.values(deptData).map(dept => ({
      ...dept,
      amount: Math.round(dept.amount)
    }));
  }, [payroll]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={departmentPayroll}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
            <Tooltip 
              formatter={(value) => [`₹${value.toLocaleString()}`, 'Total Amount']}
              labelFormatter={(label) => `Department: ${label}`}
            />
            <Bar dataKey="amount" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {departmentPayroll.map((dept) => (
            <div key={dept.department} className="text-center">
              <div className="text-sm font-medium text-gray-600">{dept.department}</div>
              <div className="text-lg font-bold text-gray-900">₹{dept.amount.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{dept.count} employees</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollReport;
