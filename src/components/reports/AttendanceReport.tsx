
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface MonthlyData {
  month: string;
  present: number;
  absent: number;
  late: number;
  total: number;
}

const AttendanceReport = () => {
  const { toast } = useToast();

  const { data: attendance = [] } = useQuery({
    queryKey: ['attendanceReport'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          employees (name, department)
        `)
        .order('date', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // Process data for chart
  const processedData = React.useMemo(() => {
    const monthlyData: Record<string, MonthlyData> = {};
    
    attendance.forEach(record => {
      const date = new Date(record.date);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, present: 0, absent: 0, late: 0, total: 0 };
      }
      
      monthlyData[monthKey].total++;
      if (record.status === 'present') {
        monthlyData[monthKey].present++;
      } else if (record.status === 'absent') {
        monthlyData[monthKey].absent++;
      } else if (record.status === 'late') {
        monthlyData[monthKey].late++;
      }
    });

    // Convert to percentage
    return Object.values(monthlyData).map(month => ({
      ...month,
      present: month.total > 0 ? Math.round((month.present / month.total) * 100) : 0,
      absent: month.total > 0 ? Math.round((month.absent / month.total) * 100) : 0,
      late: month.total > 0 ? Math.round((month.late / month.total) * 100) : 0,
    }));
  }, [attendance]);

  // Calculate summary stats
  const stats = React.useMemo(() => {
    const totalRecords = attendance.length;
    const presentCount = attendance.filter(a => a.status === 'present').length;
    const absentCount = attendance.filter(a => a.status === 'absent').length;
    const lateCount = attendance.filter(a => a.status === 'late').length;
    
    return {
      avgPresent: totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : '0.0',
      avgAbsent: totalRecords > 0 ? ((absentCount / totalRecords) * 100).toFixed(1) : '0.0',
      avgLate: totalRecords > 0 ? ((lateCount / totalRecords) * 100).toFixed(1) : '0.0',
      bestMonth: processedData.length > 0 ? 
        processedData.reduce((best, current) => current.present > best.present ? current : best).month : 'N/A'
    };
  }, [attendance, processedData]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Employee,Department,Date,Status,Check In,Check Out\n"
      + attendance.map(record => 
        `${record.employees?.name || 'N/A'},${record.employees?.department || 'N/A'},${record.date},${record.status},${record.check_in_time || 'N/A'},${record.check_out_time || 'N/A'}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Attendance report has been exported successfully.",
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Attendance Analytics</CardTitle>
        <Button onClick={handleExport} variant="outline" className="bg-blue-600 text-white hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Monthly Attendance Trend</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <YAxis 
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="present"
                  stackId="1"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.8}
                />
                <Area
                  type="monotone"
                  dataKey="late"
                  stackId="1"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.8}
                />
                <Area
                  type="monotone"
                  dataKey="absent"
                  stackId="1"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Attendance Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-green-700 font-medium">Average Present</span>
                <span className="text-2xl font-bold text-green-600">{stats.avgPresent}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-700 font-medium">Average Late</span>
                <span className="text-2xl font-bold text-yellow-600">{stats.avgLate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-700 font-medium">Average Absent</span>
                <span className="text-2xl font-bold text-red-600">{stats.avgAbsent}%</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-blue-700 font-medium">Best Month</span>
                <span className="text-xl font-bold text-blue-600">{stats.bestMonth}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceReport;
