"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ManagerNavi from '../../../components/ManagerNavi/ManagerNavi';
import ManagerTabs from '../../../components/ManagerNavi/ManagerTabs';
import { AlertCircle, Megaphone, Trash2, Pencil, X } from 'lucide-react';
import ConfirmModal from '../../../components/Modals/ConfirmModal';
import { useToast } from '../../../components/Toast/ToastProvider';
import { API_BASE, authHeaders, clearAuth, getStoredName } from '../../../lib/api';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  priority: 'Urgent' | 'Important' | 'Normal';
  type: 'system' | 'project';
  postedBy?: { name: string };
  createdAt: string;
}

interface AnnouncementForm {
  title: string;
  content: string;
  priority: 'Urgent' | 'Important' | 'Normal';
}

const PRIORITY_BADGE: Record<string, string> = {
  Urgent: 'bg-red-600 text-white',
  Important: 'bg-black text-white',
  Normal: 'bg-blue-600 text-white',
};

export default function ManagerAnnouncementsPage() {
  const router = useRouter();
  const toast = useToast();
  const [managerName, setManagerName] = useState('Manager');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState<AnnouncementForm>({ title: '', content: '', priority: 'Normal' });
  const [formErrors, setFormErrors] = useState<Partial<AnnouncementForm>>({});
  const [submitting, setSubmitting] = useState(false);

  const [pendingDelete, setPendingDelete] = useState<Announcement | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/announcements`, { headers: authHeaders() });
      if (res.status === 401) { router.push('/login'); return; }
      const data = await res.json();
      if (data.success) setAnnouncements(data.announcements as Announcement[]);
    } catch {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setManagerName(getStoredName() || 'Manager');
    fetchAnnouncements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ title: '', content: '', priority: 'Normal' });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (ann: Announcement) => {
    setEditing(ann);
    setForm({ title: ann.title, content: ann.content, priority: ann.priority });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const errs: Partial<AnnouncementForm> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.content.trim()) errs.content = 'Content is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const url = editing
        ? `${API_BASE}/api/announcements/${editing._id}`
        : `${API_BASE}/api/announcements`;
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.message || 'Failed to save'); return; }
      toast.success(editing ? 'Announcement updated' : 'Announcement posted');
      setModalOpen(false);
      fetchAnnouncements();
    } catch {
      toast.error('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/api/announcements/${pendingDelete._id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.message || 'Failed to delete'); return; }
      toast.success('Announcement deleted');
      setPendingDelete(null);
      fetchAnnouncements();
    } catch {
      toast.error('Network error');
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => { clearAuth(); router.push('/login'); };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <ManagerNavi managerName={managerName} role="manager" onLogout={handleLogout} />
      <ManagerTabs activeTab="Announcements" />

      <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex-1">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Project Announcements</h2>
              <p className="text-sm text-gray-500">Create and manage project-level announcements for your team</p>
            </div>
            <button
              onClick={openNew}
              className="bg-[#1a1a1a] hover:bg-black transition-colors text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium"
            >
              <Megaphone size={16} />
              New Announcement
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-400 text-center py-8">Loading...</p>
          ) : announcements.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No project announcements yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {announcements.map((ann) => (
                <div key={ann._id} className="border border-gray-200 rounded-xl p-6 flex flex-col gap-4 hover:shadow-sm transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-gray-900">
                      <AlertCircle size={20} strokeWidth={1.5} />
                      <h3 className="text-base font-medium">{ann.title}</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(ann)}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-blue-50"
                        title="Edit"
                      >
                        <Pencil size={18} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => setPendingDelete(ann)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={18} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`${PRIORITY_BADGE[ann.priority]} text-[11px] font-semibold px-2.5 py-0.5 rounded-full`}>
                      {ann.priority}
                    </span>
                    <span className="border border-gray-200 text-gray-500 text-[11px] font-medium px-3 py-0.5 rounded-full">
                      Project Announcement
                    </span>
                  </div>

                  <p className="text-gray-800 text-sm">{ann.content}</p>

                  <hr className="border-gray-100 mt-2 mb-1" />
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>By {ann.postedBy?.name ?? 'Manager'}</span>
                    <span>{new Date(ann.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-3xl w-full max-w-xl p-8 shadow-xl relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editing ? 'Edit Announcement' : 'New Project Announcement'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-800 p-2 bg-gray-50 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setFormErrors(fe => ({ ...fe, title: undefined })); }}
                  placeholder="Announcement title"
                  className={`w-full px-4 py-3 bg-[#f3f4f6] rounded-xl outline-none text-sm text-gray-900 focus:ring-2 ${formErrors.title ? 'ring-2 ring-red-300' : 'focus:ring-gray-200'}`}
                />
                {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Priority</label>
                <select
                  value={form.priority}
                  onChange={e => setForm(f => ({ ...f, priority: e.target.value as AnnouncementForm['priority'] }))}
                  className="w-full px-4 py-3 bg-[#f3f4f6] rounded-xl outline-none text-sm text-gray-900 appearance-none"
                >
                  <option value="Normal">Normal</option>
                  <option value="Important">Important</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.content}
                  onChange={e => { setForm(f => ({ ...f, content: e.target.value })); setFormErrors(fe => ({ ...fe, content: undefined })); }}
                  placeholder="Write your announcement..."
                  rows={4}
                  className={`w-full px-4 py-3 bg-[#f3f4f6] rounded-xl outline-none text-sm text-gray-900 resize-none focus:ring-2 ${formErrors.content ? 'ring-2 ring-red-300' : 'focus:ring-gray-200'}`}
                />
                {formErrors.content && <p className="text-red-500 text-xs mt-1">{formErrors.content}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <button onClick={() => setModalOpen(false)} className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={submitting}
                className="px-6 py-3 bg-[#1a1a1a] text-white font-semibold rounded-xl hover:bg-black transition-colors disabled:opacity-60"
              >
                {submitting ? 'Saving...' : editing ? 'Update' : 'Post Announcement'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!pendingDelete}
        title="Delete announcement?"
        message={<>This will permanently delete <span className="font-semibold text-gray-900">"{pendingDelete?.title}"</span>. This cannot be undone.</>}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        busy={deleting}
        onClose={() => { if (!deleting) setPendingDelete(null); }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
