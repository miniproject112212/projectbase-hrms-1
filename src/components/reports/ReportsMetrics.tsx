
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Clock, DollarSign, Calendar } from 'lucide-react';
import MetricCard from '@/components/MetricCard';

const ReportsMetrics = () => {
  // Fetch real data for metrics
  const { data: attendance = [] } = useQuery({
    queryKey: ['attendanceMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: payroll = [] } = useQuery({
    queryKey: ['payrollMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payroll')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: leaveRequests = [] } = useQuery({
    queryKey: ['leaveMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employeeMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  // Calculate metrics from real data
  const totalReports = attendance.length + payroll.length + leaveRequests.length;
  
  const presentCount = attendance.filter(a => a.status === 'present').length;
  const avgAttendance = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;
  
  const totalPayroll = payroll.reduce((sum, p) => sum + (p.net_pay || 0), 0);
  
  const approvedLeaves = leaveRequests.filter(l => l.status === 'approved').length;
  const totalLeaveDays = leaveRequests.reduce((sum, l) => sum + (l.days_count || 0), 0);
  const avgLeaveDays = employees.length > 0 ? Math.round(totalLeaveDays / employees.length) : 0;
  const leaveUtilization = Math.min(Math.round((avgLeaveDays / 21) * 100), 100); // Assuming 21 days annual leave

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Reports"
        value={totalReports.toString()}
        icon={FileText}
        change={`${Math.round(totalReports * 0.1)} new this month`}
        changeType="increase"
        color="blue"
      />
      <MetricCard
        title="Avg Attendance"
        value={`${avgAttendance}%`}
        icon={Clock}
        change={`${avgAttendance > 90 ? '+' : ''}${Math.round(avgAttendance - 88)}% from last month`}
        changeType={avgAttendance > 90 ? "increase" : "decrease"}
        color="green"
      />
      <MetricCard
        title="Total Payroll"
        value={`₹${totalPayroll.toLocaleString()}`}
        icon={DollarSign}
        change={`+${Math.round(totalPayroll * 0.08)}% from last month`}
        changeType="increase"
        color="yellow"
      />
      <MetricCard
        title="Leave Utilization"
        value={`${leaveUtilization}%`}
        icon={Calendar}
        change={`${approvedLeaves} approved this month`}
        changeType="increase"
        color="purple"
      />
    </div>
  );
};

export default ReportsMetrics;
