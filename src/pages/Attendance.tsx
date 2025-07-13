
import React, { useState } from 'react';
import { Calendar, Clock, Users, UserCheck, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import MetricCard from '@/components/MetricCard';
import { useAttendance, useAttendanceStats } from '@/hooks/useAttendance';
import { useEmployees } from '@/hooks/useEmployees';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Attendance = () => {
  const today = new Date().toISOString().split('T')[0];
  const { data: attendanceRecords = [] } = useAttendance(today);
  const { data: attendanceStats, refetch: refetchStats } = useAttendanceStats();
  const { data: employees = [] } = useEmployees();
  const { toast } = useToast();
  
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [attendanceForm, setAttendanceForm] = useState({
    employee_id: '',
    status: 'present',
    check_in_time: '',
    check_out_time: '',
    notes: ''
  });

  const departments = ['All Departments', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];

  const filteredRecords = attendanceRecords.filter(record => {
    if (departmentFilter === 'all') return true;
    const employee = employees.find(emp => emp.id === record.employee_id);
    return employee?.department.toLowerCase() === departmentFilter.toLowerCase();
  });

  const handleMarkAttendance = async () => {
    try {
      const selectedEmployee = employees.find(emp => emp.id === attendanceForm.employee_id);
      
      const { data, error } = await supabase
        .from('attendance')
        .insert([{
          employee_id: attendanceForm.employee_id,
          date: today,
          status: attendanceForm.status,
          check_in_time: attendanceForm.check_in_time || null,
          check_out_time: attendanceForm.check_out_time || null,
          notes: attendanceForm.notes || null
        }]);

      if (error) throw error;

      toast({
        title: "Attendance Marked",
        description: `${selectedEmployee?.name}'s attendance has been marked as ${attendanceForm.status}.`,
      });

      setShowMarkAttendance(false);
      setAttendanceForm({
        employee_id: '',
        status: 'present',
        check_in_time: '',
        check_out_time: '',
        notes: ''
      });
      
      refetchStats();
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast({
        title: "Error",
        description: "Failed to mark attendance. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Employee ID,Employee Name,Department,Status,Check In,Check Out,Notes\n"
      + filteredRecords.map(record => {
        const employee = employees.find(emp => emp.id === record.employee_id);
        return `${record.date},${employee?.employee_id || ''},${employee?.name || ''},${employee?.department || ''},${record.status},${record.check_in_time || ''},${record.check_out_time || ''},${record.notes || ''}`;
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_report_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Attendance data has been exported to CSV file.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
        <div className="flex space-x-4">
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={showMarkAttendance} onOpenChange={setShowMarkAttendance}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Mark Attendance
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Mark Attendance</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="employee">Employee</Label>
                  <Select value={attendanceForm.employee_id} onValueChange={(value) => setAttendanceForm({...attendanceForm, employee_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} ({employee.employee_id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={attendanceForm.status} onValueChange={(value) => setAttendanceForm({...attendanceForm, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="on_leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="check_in">Check In Time</Label>
                    <Input
                      type="time"
                      value={attendanceForm.check_in_time}
                      onChange={(e) => setAttendanceForm({...attendanceForm, check_in_time: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="check_out">Check Out Time</Label>
                    <Input
                      type="time"
                      value={attendanceForm.check_out_time}
                      onChange={(e) => setAttendanceForm({...attendanceForm, check_out_time: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    value={attendanceForm.notes}
                    onChange={(e) => setAttendanceForm({...attendanceForm, notes: e.target.value})}
                    placeholder="Optional notes..."
                  />
                </div>
                <Button onClick={handleMarkAttendance} className="w-full">
                  Mark Attendance
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Present Today"
          value={attendanceStats?.present || 0}
          icon={UserCheck}
          change="+2 from yesterday"
          changeType="increase"
          color="green"
        />
        <MetricCard
          title="Late Arrivals"
          value={attendanceStats?.late || 0}
          icon={Clock}
          change="-1 from yesterday"
          changeType="decrease"
          color="yellow"
        />
        <MetricCard
          title="Absent"
          value={attendanceStats?.absent || 0}
          icon={Users}
          change="Same as yesterday"
          changeType="neutral"
          color="red"
        />
        <MetricCard
          title="On Leave"
          value={attendanceStats?.on_leave || 0}
          icon={Calendar}
          change="+1 from yesterday"
          changeType="increase"
          color="blue"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Today's Attendance</CardTitle>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Departments" />
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
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRecords.map((record) => {
              const employee = employees.find(emp => emp.id === record.employee_id);
              return (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {employee?.name?.split(' ').map(n => n[0]).join('') || '??'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{employee?.name || 'Unknown'}</h3>
                      <p className="text-sm text-gray-600">{employee?.department || ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {record.check_in_time ? `In: ${record.check_in_time}` : ''}
                      </p>
                      <p className="text-sm text-gray-600">
                        {record.check_out_time ? `Out: ${record.check_out_time}` : ''}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      record.status === 'present' ? 'bg-green-100 text-green-800' :
                      record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                      record.status === 'absent' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {record.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredRecords.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No attendance records found for today.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
