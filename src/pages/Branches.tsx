
import React, { useState } from 'react';
import { Building2, Plus, Edit, MapPin, Phone, Mail, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Branches = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const { toast } = useToast();

  // Sample branch data - this will be replaced with actual data from your backend
  const [branches, setBranches] = useState([
    {
      id: 1,
      name: 'Head Office',
      address: '123 Business District, Mumbai, Maharashtra 400001',
      phone: '+91 22 1234 5678',
      email: 'headoffice@company.com',
      manager: 'John Doe',
      employeeCount: 45,
      status: 'active'
    },
    {
      id: 2,
      name: 'Delhi Branch',
      address: '456 Connaught Place, New Delhi, Delhi 110001',
      phone: '+91 11 2345 6789',
      email: 'delhi@company.com',
      manager: 'Jane Smith',
      employeeCount: 23,
      status: 'active'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    manager: '',
    status: 'active'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBranch) {
      // Update existing branch
      setBranches(prev => prev.map(branch => 
        branch.id === editingBranch.id 
          ? { ...branch, ...formData, employeeCount: branch.employeeCount }
          : branch
      ));
      toast({
        title: "Success!",
        description: "Branch updated successfully.",
      });
      setShowEditDialog(false);
      setEditingBranch(null);
    } else {
      // Add new branch
      const newBranch = {
        id: Date.now(),
        ...formData,
        employeeCount: 0
      };
      setBranches(prev => [...prev, newBranch]);
      toast({
        title: "Success!",
        description: "Branch created successfully.",
      });
      setShowAddDialog(false);
    }

    // Reset form
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      manager: '',
      status: 'active'
    });
  };

  const handleEditClick = (branch: any) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      manager: branch.manager,
      status: branch.status
    });
    setShowEditDialog(true);
  };

  const BranchForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Branch Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="manager">Branch Manager</Label>
          <Input
            id="manager"
            name="manager"
            value={formData.manager}
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
        <div className="md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter complete branch address..."
            rows={3}
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {editingBranch ? 'Update Branch' : 'Create Branch'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Branches</h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Branch</DialogTitle>
            </DialogHeader>
            <BranchForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <Card key={branch.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{branch.name}</h3>
                  <p className="text-sm text-gray-600">{branch.manager}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditClick(branch)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span className="text-sm">{branch.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{branch.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{branch.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{branch.employeeCount} employees</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    branch.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {branch.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Branch</DialogTitle>
          </DialogHeader>
          <BranchForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Branches;
