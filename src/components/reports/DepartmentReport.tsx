
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useEmployees } from '@/hooks/useEmployees';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DepartmentReport = () => {
  const { data: employees = [] } = useEmployees();
  const { toast } = useToast();

  const departmentData = [
    { 
      department: 'Engineering', 
      employees: employees.filter(e => e.department === 'Engineering').length,
      color: '#3B82F6'
    },
    { 
      department: 'Marketing', 
      employees: employees.filter(e => e.department === 'Marketing').length,
      color: '#10B981'
    },
    { 
      department: 'Sales', 
      employees: employees.filter(e => e.department === 'Sales').length,
      color: '#F59E0B'
    },
    { 
      department: 'HR', 
      employees: employees.filter(e => e.department === 'HR').length,
      color: '#EF4444'
    },
    { 
      department: 'Finance', 
      employees: employees.filter(e => e.department === 'Finance').length,
      color: '#8B5CF6'
    },
  ].filter(dept => dept.employees > 0);

  const totalEmployees = departmentData.reduce((sum, dept) => sum + dept.employees, 0);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Department,Employees,Percentage\n"
      + departmentData.map(dept => 
        `${dept.department},${dept.employees},${((dept.employees / totalEmployees) * 100).toFixed(1)}%`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "department_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Department analytics have been exported to CSV file.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Department Analytics</h2>
        <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={150}
                  paddingAngle={5}
                  dataKey="employees"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, 'Employees']}
                  labelFormatter={(label) => `Department: ${label}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentData.map((dept) => (
                <div key={dept.department} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: dept.color }}
                    ></div>
                    <span className="font-medium text-gray-900">{dept.department}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{dept.employees}</div>
                    <div className="text-sm text-gray-600">employees</div>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <span className="font-bold text-blue-900">Total Employees</span>
                  <div className="text-3xl font-bold text-blue-900">{totalEmployees}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepartmentReport;
