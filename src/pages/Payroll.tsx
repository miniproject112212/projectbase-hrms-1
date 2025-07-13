import React, { useState } from 'react';
import { DollarSign, Download, FileText, Calculator, Settings, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MetricCard from '@/components/MetricCard';
import { usePayrollStats } from '@/hooks/usePayroll';
import { useEmployees } from '@/hooks/useEmployees';
import { useToast } from '@/hooks/use-toast';

const Payroll = () => {
  const { data: payrollStats } = usePayrollStats();
  const { data: employees = [] } = useEmployees();
  const { toast } = useToast();
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleExportAll = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Employee ID,Employee Name,Department,Basic Salary,HRA,Allowances,Gross Pay,Deductions,Net Pay\n"
      + employees.map(employee => {
        const grossPay = employee.basic_salary + employee.hra + employee.allowances;
        const deductions = Math.round(employee.basic_salary * 0.1875);
        const netPay = grossPay - deductions;
        return `${employee.employee_id},${employee.name},${employee.department},${employee.basic_salary},${employee.hra},${employee.allowances},${grossPay},${deductions},${netPay}`;
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payroll_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Payroll data has been exported to CSV file.",
    });
  };

  const generatePayslip = (employee) => {
    const payslipContent = `
PAYSLIP
Employee: ${employee.name}
Employee ID: ${employee.employee_id}
Department: ${employee.department}
Position: ${employee.position}

EARNINGS:
Basic Salary: ₹${employee.basic_salary.toLocaleString()}
HRA: ₹${employee.hra.toLocaleString()}
Allowances: ₹${employee.allowances.toLocaleString()}

GROSS PAY: ₹${(employee.basic_salary + employee.hra + employee.allowances).toLocaleString()}

DEDUCTIONS:
PF: ₹${Math.round(employee.basic_salary * 0.12).toLocaleString()}
ESI: ₹${Math.round(employee.basic_salary * 0.0175).toLocaleString()}
Tax: ₹${Math.round(employee.basic_salary * 0.05).toLocaleString()}

NET PAY: ₹${(employee.basic_salary + employee.hra + employee.allowances - Math.round(employee.basic_salary * 0.1875)).toLocaleString()}

Generated on: ${new Date().toLocaleDateString()}
    `;

    const element = document.createElement('a');
    const file = new Blob([payslipContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `payslip_${employee.employee_id}_${new Date().getMonth() + 1}_${new Date().getFullYear()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Payslip Generated",
      description: `Payslip for ${employee.name} has been downloaded.`,
    });
  };

  const quickActions = [
    { title: 'Process Payroll', icon: Calculator, action: () => toast({ title: "Processing", description: "Payroll processing initiated..." }) },
    { title: 'Generate Reports', icon: FileText, action: () => toast({ title: "Generating", description: "Payroll reports being generated..." }) },
    { title: 'Tax Calculation', icon: TrendingUp, action: () => toast({ title: "Calculating", description: "Tax calculations in progress..." }) },
    { title: 'Payroll Settings', icon: Settings, action: () => toast({ title: "Settings", description: "Opening payroll settings..." }) }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
        <Button onClick={handleExportAll} className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Payroll Overview</TabsTrigger>
          <TabsTrigger value="employee">Employee Payroll</TabsTrigger>
          <TabsTrigger value="settings">Payroll Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Payroll"
              value={`₹${(payrollStats?.totalPayroll || 0).toLocaleString()}`}
              icon={DollarSign}
              change="+8.2% from last month"
              changeType="increase"
              color="green"
            />
            <MetricCard
              title="Employees Paid"
              value={payrollStats?.processedCount || 0}
              icon={Users}
              change="100% completion"
              changeType="increase"
              color="blue"
            />
            <MetricCard
              title="Pending Payments"
              value={payrollStats?.pendingCount || 0}
              icon={FileText}
              change="On schedule"
              changeType="neutral"
              color="yellow"
            />
            <MetricCard
              title="Avg Salary"
              value={`₹${Math.round((payrollStats?.totalPayroll || 0) / Math.max(payrollStats?.totalEmployees || 1, 1)).toLocaleString()}`}
              icon={Calculator}
              change="+5.1% from last month"
              changeType="increase"
              color="purple"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Payroll Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">Basic Salary</span>
                      <span className="font-bold">₹{(payrollStats?.totalPayroll * 0.6 || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">HRA</span>
                      <span className="font-bold">₹{(payrollStats?.totalPayroll * 0.2 || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">Allowances</span>
                      <span className="font-bold">₹{(payrollStats?.totalPayroll * 0.15 || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">Deductions</span>
                      <span className="font-bold text-red-600">-₹{(payrollStats?.totalPayroll * 0.05 || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={action.action}
                    >
                      <action.icon className="h-4 w-4 mr-2" />
                      {action.title}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employee" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Payroll</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{employee.name}</h3>
                        <p className="text-sm text-gray-600">{employee.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold">₹{(employee.basic_salary + employee.hra + employee.allowances).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Gross Pay</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => generatePayslip(employee)}
                      >
                        Download Payslip
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="income_tax">Income Tax Rate (%)</Label>
                  <Input id="income_tax" type="number" defaultValue="5" />
                </div>
                <div>
                  <Label htmlFor="pf_rate">PF Rate (%)</Label>
                  <Input id="pf_rate" type="number" defaultValue="12" />
                </div>
                <div>
                  <Label htmlFor="esi_rate">ESI Rate (%)</Label>
                  <Input id="esi_rate" type="number" defaultValue="1.75" />
                </div>
                <Button className="w-full">Save Tax Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payroll Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pay_frequency">Pay Frequency</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Monthly</option>
                    <option>Bi-weekly</option>
                    <option>Weekly</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="pay_date">Monthly Pay Date</Label>
                  <Input id="pay_date" type="number" defaultValue="30" min="1" max="31" />
                </div>
                <div>
                  <Label htmlFor="overtime_rate">Overtime Rate (multiplier)</Label>
                  <Input id="overtime_rate" type="number" defaultValue="1.5" step="0.1" />
                </div>
                <Button className="w-full">Save Schedule Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payroll;
