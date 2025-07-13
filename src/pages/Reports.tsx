
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ReportsMetrics from '@/components/reports/ReportsMetrics';
import ReportTypeSelector from '@/components/reports/ReportTypeSelector';
import AttendanceReport from '@/components/reports/AttendanceReport';
import PayrollReport from '@/components/reports/PayrollReport';
import LeaveReport from '@/components/reports/LeaveReport';
import DepartmentReport from '@/components/reports/DepartmentReport';
import { useToast } from '@/hooks/use-toast';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('attendance');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState('last_month');
  const [department, setDepartment] = useState('all');
  const { toast } = useToast();

  // Fetch real data for reports
  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: attendance = [] } = useQuery({
    queryKey: ['attendance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          employees (name, department)
        `);
      if (error) throw error;
      return data;
    }
  });

  const { data: payroll = [] } = useQuery({
    queryKey: ['payroll'],
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

  const { data: leaveRequests = [] } = useQuery({
    queryKey: ['leaveRequests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          employees!leave_requests_employee_id_fkey (name, department)
        `);
      if (error) throw error;
      return data;
    }
  });

  const handleExport = () => {
    let csvContent = "";
    let filename = "";
    
    switch (selectedReport) {
      case 'attendance':
        csvContent = "data:text/csv;charset=utf-8," 
          + "Employee,Department,Date,Status,Check In,Check Out\n"
          + attendance.map(record => 
            `${record.employees?.name || 'N/A'},${record.employees?.department || 'N/A'},${record.date},${record.status},${record.check_in_time || 'N/A'},${record.check_out_time || 'N/A'}`
          ).join("\n");
        filename = "attendance_report";
        break;
        
      case 'payroll':
        csvContent = "data:text/csv;charset=utf-8," 
          + "Employee,Department,Basic Salary,HRA,Allowances,Gross Pay,Deductions,Net Pay,Status\n"
          + payroll.map(record => 
            `${record.employees?.name || 'N/A'},${record.employees?.department || 'N/A'},${record.basic_salary},${record.hra},${record.allowances},${record.gross_pay},${record.deductions},${record.net_pay},${record.status}`
          ).join("\n");
        filename = "payroll_report";
        break;
        
      case 'leave':
        csvContent = "data:text/csv;charset=utf-8," 
          + "Employee,Department,Leave Type,Start Date,End Date,Days,Status,Reason\n"
          + leaveRequests.map(record => 
            `${record.employees?.name || 'N/A'},${record.employees?.department || 'N/A'},${record.leave_type},${record.start_date},${record.end_date},${record.days_count},${record.status},${record.reason || 'N/A'}`
          ).join("\n");
        filename = "leave_report";
        break;
        
      case 'department':
        const departmentStats = employees.reduce((acc: Record<string, number>, emp) => {
          acc[emp.department] = (acc[emp.department] || 0) + 1;
          return acc;
        }, {});
        csvContent = "data:text/csv;charset=utf-8," 
          + "Department,Employee Count,Percentage\n"
          + Object.entries(departmentStats).map(([dept, count]) => 
            `${dept},${count},${((Number(count) / employees.length) * 100).toFixed(1)}%`
          ).join("\n");
        filename = "department_report";
        break;
        
      default:
        csvContent = "data:text/csv;charset=utf-8,No data available";
        filename = "report";
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    const reportName = selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1);
    toast({
      title: "Export Successful",
      description: `${reportName} report has been exported successfully.`,
    });
  };

  const applyFilters = () => {
    setShowFilters(false);
    toast({
      title: "Filters Applied",
      description: `Showing ${selectedReport} data for ${dateRange} from ${department === 'all' ? 'all departments' : department}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <div className="flex space-x-4">
          <Dialog open={showFilters} onOpenChange={setShowFilters}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report Filters</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Date Range</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last_week">Last Week</SelectItem>
                      <SelectItem value="last_month">Last Month</SelectItem>
                      <SelectItem value="last_quarter">Last Quarter</SelectItem>
                      <SelectItem value="last_year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Department</label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={applyFilters} className="w-full">
                  Apply Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <ReportsMetrics />
      <ReportTypeSelector 
        selectedReport={selectedReport} 
        onReportChange={setSelectedReport} 
      />

      <Tabs value={selectedReport} onValueChange={setSelectedReport} className="space-y-4">
        <TabsContent value="attendance" className="space-y-4">
          <AttendanceReport />
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <PayrollReport />
        </TabsContent>

        <TabsContent value="leave" className="space-y-4">
          <LeaveReport />
        </TabsContent>

        <TabsContent value="department" className="space-y-4">
          <DepartmentReport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
