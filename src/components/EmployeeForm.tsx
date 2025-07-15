
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateEmployee, useUpdateEmployee } from '@/hooks/useEmployees';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EmployeeFormData {
  employee_id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  location: string;
  join_date: string;
  basic_salary: number;
  hra: number;
  allowances: number;
  pf: number;
  advance: number;
  notes: string;
  pan_card: string;
  document_url: string;
}

interface EmployeeFormProps {
  employee?: any;
  onSuccess?: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSuccess }) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    employee_id: employee?.employee_id || '',
    name: employee?.name || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    position: employee?.position || '',
    department: employee?.department || '',
    location: employee?.location || '',
    join_date: employee?.join_date || '',
    basic_salary: employee?.basic_salary || 0,
    hra: employee?.hra || 0,
    allowances: employee?.allowances || 0,
    pf: employee?.pf || 0,
    advance: employee?.advance || 0,
    notes: employee?.notes || '',
    pan_card: employee?.pan_card || '',
    document_url: employee?.document_url || '',
  });

  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const { toast } = useToast();
  const isEditing = Boolean(employee);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numericFields = ['basic_salary', 'hra', 'allowances', 'pf', 'advance'];
    
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        document_url: file.name
      }));
    }
  };

  const validatePanCard = async (panCard: string) => {
    if (!panCard) return true;
    
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('id')
        .eq('pan_card', panCard)
        .neq('id', employee?.id || '');
      
      if (error) {
        console.error('Error checking PAN card:', error);
        return true;
      }
      
      return data.length === 0;
    } catch (error) {
      console.error('Error validating PAN card:', error);
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate PAN card
    const isPanValid = await validatePanCard(formData.pan_card);
    if (!isPanValid) {
      toast({
        title: "Error",
        description: "PAN card number already exists. Please enter a different PAN card number.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (isEditing) {
        await updateEmployee.mutateAsync({
          id: employee.id,
          employee: formData
        });
        toast({
          title: "Success!",
          description: "Employee updated successfully.",
        });
      } else {
        await createEmployee.mutateAsync({
          ...formData,
          status: 'active',
          avatar_url: null
        });
        toast({
          title: "Success!",
          description: "Employee created successfully.",
        });
      }
      
      if (onSuccess) onSuccess();
      
      if (!isEditing) {
        setFormData({
          employee_id: '',
          name: '',
          email: '',
          phone: '',
          position: '',
          department: '',
          location: '',
          join_date: '',
          basic_salary: 0,
          hra: 0,
          allowances: 0,
          pf: 0,
          advance: 0,
          notes: '',
          pan_card: '',
          document_url: '',
        });
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      toast({
        title: "Error",
        description: `Error ${isEditing ? 'updating' : 'creating'} employee. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="employee_id">Employee ID</Label>
          <Input
            id="employee_id"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="Operations">Operations</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="join_date">Join Date</Label>
          <Input
            id="join_date"
            name="join_date"
            type="date"
            value={formData.join_date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="basic_salary">Basic Salary</Label>
          <Input
            id="basic_salary"
            name="basic_salary"
            type="number"
            value={formData.basic_salary}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="hra">HRA</Label>
          <Input
            id="hra"
            name="hra"
            type="number"
            value={formData.hra}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="allowances">Allowances</Label>
          <Input
            id="allowances"
            name="allowances"
            type="number"
            value={formData.allowances}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="pf">PF (Provident Fund)</Label>
          <Input
            id="pf"
            name="pf"
            type="number"
            value={formData.pf}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="advance">Advance</Label>
          <Input
            id="advance"
            name="advance"
            type="number"
            value={formData.advance}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="notes">Notes (Narration)</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Enter any additional notes or remarks..."
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="pan_card">PAN Card Number</Label>
          <Input
            id="pan_card"
            name="pan_card"
            value={formData.pan_card}
            onChange={handleInputChange}
            placeholder="Enter PAN card number"
            maxLength={10}
          />
        </div>
        <div>
          <Label htmlFor="document">Document Upload</Label>
          <Input
            id="document"
            name="document"
            type="file"
            onChange={handleFileUpload}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
          {formData.document_url && (
            <p className="text-sm text-gray-500 mt-1">
              Current file: {formData.document_url}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700"
          disabled={createEmployee.isPending || updateEmployee.isPending}
        >
          {(createEmployee.isPending || updateEmployee.isPending) 
            ? (isEditing ? 'Updating...' : 'Creating...') 
            : (isEditing ? 'Update Employee' : 'Create Employee')
          }
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
