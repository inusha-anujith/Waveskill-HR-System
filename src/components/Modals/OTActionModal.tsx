"use client";

import React, { useEffect, useState } from 'react';
import { X, Calendar, Clock, FileText, CheckCircle, XCircle, User } from 'lucide-react';

export interface OTRequestView {
  _id: string;
  date: string;
  otHours: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  user?: { _id: string; name: string; email: string; department?: string };
  reviewedBy?: { name: string };
  reviewNote?: string;
  createdAt: string;
}

interface OTActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: OTRequestView | null;
  busy?: boolean;
  /** Called with the chosen action and the reviewer's note */
  onAction: (id: string, action: 'approve' | 'reject', reviewNote: string) => void;
}

export default function OTActionModal({ isOpen, onClose, request, busy, onAction }: OTActionModalProps) {
  const [reviewNote, setReviewNote] = useState('');
  const [noteError, setNoteError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) { setReviewNote(''); setNoteError(null); }
  }, [isOpen, request]);

  if (!isOpen || !request) return null;

  const isPending = request.status === 'Pending';

  const handle = (action: 'approve' | 'reject') => {
    // A rejection without a reason is not actionable for the employee, so
    // require one. An approval note stays optional.
    if (action === 'reject' && !reviewNote.trim()) {
      setNoteError('Please give a reason so the employee knows why this was rejected.');
      return;
    }
    onAction(request._id, action, reviewNote.trim());
  };

  const statusBadge =
    request.status === 'Approved' ? 'bg-green-100 text-green-700'
      : request.status === 'Rejected' ? 'bg-red-100 text-red-700'
        : 'bg-gray-100 text-gray-700';

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-xl relative max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Review OT Request</h2>
            <p className="text-sm text-gray-500 mt-1">
              {isPending ? 'Review details and take action' : 'This request has already been reviewed'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors p-2 bg-gray-50 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><User size={14} /> Employee</p>
              <p className="text-base font-semibold text-gray-900">{request.user?.name ?? '—'}</p>
              <p className="text-xs text-gray-400">{request.user?.department ?? ''}</p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusBadge}`}>
              {request.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Calendar size={14} /> OT Date</p>
              <p className="text-sm font-medium text-gray-900">{new Date(request.date).toLocaleDateString('en-CA')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Clock size={14} /> Hours Claimed</p>
              <p className="text-sm font-medium text-gray-900">{request.otHours}h</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><FileText size={14} /> Reason</p>
            <p className="text-sm text-gray-700 bg-white p-3 rounded-xl border border-gray-200">
              {request.reason || 'No reason provided.'}
            </p>
          </div>

          {!isPending && request.reviewNote && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Reviewer Note</p>
              <p className="text-sm text-gray-700 bg-white p-3 rounded-xl border border-gray-200">{request.reviewNote}</p>
            </div>
          )}
        </div>

        {isPending ? (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Review Note <span className="text-gray-400 font-normal">(required when rejecting)</span>
              </label>
              <textarea
                value={reviewNote}
                onChange={e => { setReviewNote(e.target.value); setNoteError(null); }}
                rows={3}
                placeholder="Add context for the employee..."
                className={`w-full px-4 py-3 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 text-gray-900 outline-none resize-none transition-colors ${
                  noteError ? 'ring-2 ring-red-300 bg-red-50' : 'focus:ring-gray-200'
                }`}
              />
              {noteError && <p className="text-red-500 text-xs mt-1">{noteError}</p>}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handle('reject')}
                disabled={busy}
                className="flex-1 py-3.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-60"
              >
                <XCircle size={18} /> Reject
              </button>
              <button
                onClick={() => handle('approve')}
                disabled={busy}
                className="flex-1 py-3.5 bg-[#1a1a1a] text-white hover:bg-black font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-60"
              >
                <CheckCircle size={18} /> Approve
              </button>
            </div>
          </>
        ) : (
          <div className="text-center p-4 bg-gray-100 rounded-xl text-sm font-medium text-gray-600">
            {request.reviewedBy ? `Reviewed by ${request.reviewedBy.name}.` : 'Already reviewed.'}
          </div>
        )}
      </div>
    </div>
  );
}
