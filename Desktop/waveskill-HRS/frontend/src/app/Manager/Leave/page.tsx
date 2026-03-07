"use client";

import React, { useState } from 'react';
import ManagerNavi from '../../../components/ManagerNavi/ManagerNavi';
import ManagerTabs from '../../../components/ManagerNavi/ManagerTabs';
import { Calendar, Clock, Pencil, UserX } from 'lucide-react';
// Import the new Modal
import LeaveActionModal from '../../../components/Modals/LeaveActionModal';

export default function ManagerLeavePage() {
  const handleLogout = () => {
    alert("Logged out!");
  };

  // State for filtering and modal control
  const [filter, setFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  // We put the mock data in a State variable so we can edit it!
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
    {
      id: 3,
      employee: 'Mike Johnson',
      type: 'Sick',
      duration: '1/15/2026 - 1/15/2026',
      days: '1 day',
      appliedDate: '1/14/2026',
      status: 'Pending',
      reason: 'Have a scheduled medical appointment.'
    }
  ]);

  // Handle changing the status of a request from the modal
  const handleUpdateStatus = (id: number, newStatus: string) => {
    setLeaveData(prevData => 
      prevData.map(req => req.id === id ? { ...req, status: newStatus } : req)
    );
  };

  // Filter the data based on the active tab
  const filteredRequests = leaveData.filter(req => {
    if (filter === 'All') return true;
    return req.status === filter;
  });

  // Calculate dynamic stats
  const pendingCount = leaveData.filter(req => req.status === 'Pending').length;
  const approvedCount = leaveData.filter(req => req.status === 'Approved').length;
  const rejectedCount = leaveData.filter(req => req.status === 'Rejected').length;

  // Helpers
  const getTypeBadge = (type: string) => {
    if (type === 'Sick') return <span className="bg-red-100 text-red-500 text-[11px] font-semibold px-3 py-1 rounded-full">{type}</span>;
    if (type === 'Vacation') return <span className="bg-green-100 text-green-500 text-[11px] font-semibold px-3 py-1 rounded-full">{type}</span>;
    return <span>{type}</span>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Pending') return <span className="bg-gray-200 text-gray-700 text-[11px] font-semibold px-3 py-1 rounded-full">{status}</span>;
    if (status === 'Approved') return <span className="bg-[#1a1a1a] text-white text-[11px] font-semibold px-3 py-1 rounded-full">{status}</span>;
    if (status === 'Rejected') return <span className="bg-red-500 text-white text-[11px] font-semibold px-3 py-1 rounded-full">{status}</span>;
    return <span>{status}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <ManagerNavi managerName="Sarah Manager" role="manager" onLogout={handleLogout} />
      <ManagerTabs activeTab="Leaves" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col gap-6">
          
          {/* Header & Filters Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Leave Approvals</h2>
              <p className="text-sm text-gray-500">Review and approve/reject leave requests</p>
            </div>
            
            {/* Functional Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                <button 
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`text-sm font-medium px-5 py-2 rounded-xl transition-colors ${
                    filter === status 
                      ? 'bg-[#1a1a1a] text-white' 
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Leave Requests Table */}
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
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
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
                          {/* Edit/View Button triggers Modal */}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-gray-500">
                      No leave requests found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Dynamic Bottom Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Pending Requests</p>
            <p className="text-4xl font-semibold text-gray-900">{pendingCount}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Approved</p>
            <p className="text-4xl font-semibold text-green-500">{approvedCount}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Rejected</p>
            <p className="text-4xl font-semibold text-red-500">{rejectedCount}</p>
          </div>
        </div>

      </main>

      {/* Action Modal */}
      <LeaveActionModal 
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}