"use client";

import React, { useState } from 'react';
// Correctly routing up 3 levels
import AdminNavi from '../../../components/AdminNavi/AdminNavi';
import AdminTabs from '../../../components/AdminNavi/AdminTabs';
import { Calendar, Clock, Pencil, UserX } from 'lucide-react';
// Import the Leave Action Modal
import LeaveActionModal from '../../../components/Modals/AdminLeaveActionModal';

export default function AdminLeavePage() {
  const handleLogout = () => {
    alert("Logged out!");
  };

  // State to manage which request is currently open in the modal
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  // Converted static data to state so we can update it
  const [leaveData, setLeaveData] = useState([
    {
      id: 1,
      employee: 'John Doe',
      type: 'Sick',
      duration: '1/10/2026 - 1/12/2026',
      days: '2 days',
      appliedDate: '1/08/2026',
      status: 'Pending',
      reason: 'Feeling quite ill with flu symptoms. Doctor advised 2 days of bed rest.'
    },
    {
      id: 2,
      employee: 'Jane Smith',
      type: 'Vacation',
      duration: '1/20/2026 - 1/25/2026',
      days: '5 days',
      appliedDate: '1/05/2026',
      status: 'Approved',
      reason: 'Taking a planned family vacation out of the city.'
    },
  ]);

  // Function to handle the actual approval/rejection from the modal or quick buttons
  const handleUpdateStatus = (id: number, newStatus: string) => {
    setLeaveData(prevData => 
      prevData.map(req => req.id === id ? { ...req, status: newStatus } : req)
    );
  };

  // Calculate dynamic stats for the bottom cards based on the current state data
  const pendingCount = leaveData.filter(req => req.status === 'Pending').length;
  const approvedCount = leaveData.filter(req => req.status === 'Approved').length;
  const rejectedCount = leaveData.filter(req => req.status === 'Rejected').length;

  // Helper to style the "Type" badge
  const getTypeBadge = (type: string) => {
    if (type === 'Sick') {
      return <span className="bg-red-100 text-red-500 text-[11px] font-semibold px-3 py-1 rounded-full">{type}</span>;
    }
    if (type === 'Vacation') {
      return <span className="bg-green-100 text-green-500 text-[11px] font-semibold px-3 py-1 rounded-full">{type}</span>;
    }
    return <span>{type}</span>;
  };

  // Helper to style the "Status" badge
  const getStatusBadge = (status: string) => {
    if (status === 'Pending') {
      return <span className="bg-gray-200 text-gray-700 text-[11px] font-semibold px-3 py-1 rounded-full">{status}</span>;
    }
    if (status === 'Approved') {
      return <span className="bg-[#1a1a1a] text-white text-[11px] font-semibold px-3 py-1 rounded-full">{status}</span>;
    }
    if (status === 'Rejected') {
      return <span className="bg-red-500 text-white text-[11px] font-semibold px-3 py-1 rounded-full">{status}</span>;
    }
    return <span>{status}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <AdminNavi adminName="Admin User" role="admin" onLogout={handleLogout} />
      <AdminTabs activeTab="Leaves" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col gap-6">
          
          <div className="mb-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Leave Approvals</h2>
            <p className="text-sm text-gray-500">Review and approve/reject leave requests</p>
          </div>

          <div className="border border-gray-200 rounded-2xl overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-white">
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Employee</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Type</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Duration</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Days</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Applied Date</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-900 whitespace-nowrap text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaveData.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50/50 transition-colors bg-white">
                    <td className="py-4 px-6 text-sm text-gray-500 font-medium whitespace-nowrap">{request.employee}</td>
                    <td className="py-4 px-6 whitespace-nowrap">{getTypeBadge(request.type)}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={16} className="text-gray-400" />
                        {request.duration}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{request.days}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={16} className="text-gray-400" />
                        {request.appliedDate}
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">{getStatusBadge(request.status)}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Button - Opens Modal */}
                        <button 
                          onClick={() => setSelectedRequest(request)}
                          className="border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                          title="Review Request"
                        >
                          <Pencil size={16} strokeWidth={2} />
                        </button>
                        {/* Quick Reject Button */}
                        <button 
                          onClick={() => {
                            if(window.confirm('Are you sure you want to reject this request?')) {
                              handleUpdateStatus(request.id, 'Rejected');
                            }
                          }}
                          className="bg-red-600 text-white hover:bg-red-700 p-1.5 rounded-lg transition-colors"
                          title="Quick Reject"
                        >
                          <UserX size={16} strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-500 mb-2">Pending Requests</p>
            <p className="text-4xl font-semibold text-gray-900">{pendingCount}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-500 mb-2">Approved</p>
            <p className="text-4xl font-semibold text-green-500">{approvedCount}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-500 mb-2">Rejected</p>
            <p className="text-4xl font-semibold text-red-500">{rejectedCount}</p>
          </div>
        </div>

      </main>

      {/* Render the Modal conditionally */}
      <LeaveActionModal 
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}