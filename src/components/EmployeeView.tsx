
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, MapPin, Calendar, CreditCard, FileText, IndianRupee } from 'lucide-react';

interface EmployeeViewProps {
  employee: any;
  isOpen: boolean;
  onClose: () => void;
}

const EmployeeView: React.FC<EmployeeViewProps> = ({ employee, isOpen, onClose }) => {
  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={employee.avatar_url} />
              <AvatarFallback>
                {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{employee.name}</h2>
              <p className="text-gray-600">{employee.position}</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{employee.email}</p>
                </div>
              </div>
              
              {employee.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{employee.phone}</p>
                  </div>
                </div>
              )}
              
              {employee.location && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{employee.location}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Join Date</p>
                  <p className="font-medium">{new Date(employee.join_date).toLocaleDateString()}</p>
                </div>
              </div>

              {employee.pan_card && (
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">PAN Card</p>
                    <p className="font-medium">{employee.pan_card}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Work Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Work Information</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Employee ID</p>
                <p className="font-medium">{employee.employee_id}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <Badge variant="outline">{employee.department}</Badge>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                  {employee.status}
                </Badge>
              </div>

              {employee.document_url && (
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Document</p>
                    <p className="font-medium">{employee.document_url}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Salary Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Salary Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <IndianRupee className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Basic Salary</p>
                  <p className="font-medium">₹{employee.basic_salary?.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <IndianRupee className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">HRA</p>
                  <p className="font-medium">₹{employee.hra?.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <IndianRupee className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Allowances</p>
                  <p className="font-medium">₹{employee.allowances?.toLocaleString()}</p>
                </div>
              </div>

              {employee.pf !== null && employee.pf !== undefined && (
                <div className="flex items-center space-x-3">
                  <IndianRupee className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">PF</p>
                    <p className="font-medium">₹{employee.pf?.toLocaleString()}</p>
                  </div>
                </div>
              )}

              {employee.advance !== null && employee.advance !== undefined && employee.advance > 0 && (
                <div className="flex items-center space-x-3">
                  <IndianRupee className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Advance</p>
                    <p className="font-medium">₹{employee.advance?.toLocaleString()}</p>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600">Gross Salary</p>
                <p className="font-bold text-lg">₹{(employee.basic_salary + employee.hra + employee.allowances)?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {employee.notes && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Notes</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm">{employee.notes}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeView;
