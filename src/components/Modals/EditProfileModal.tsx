"use client";
import React, { useState, useEffect } from 'react';
// [NEW]: Import the Change Password Modal component so it can be rendered on top
import ChangePasswordModal from './ChangePasswordModal';
import { resolvePhotoUrl } from '../Avatar/Avatar';
import { setStoredPhoto } from '../../lib/api';

export default function EditProfileModal({ isOpen, onClose, currentData, onSaveSuccess }: any) {
  const [formData, setFormData] = useState({
      countryCode: '+94',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      emergencyName: '',
      emergencyCountryCode: '+94',
      emergencyPhone: '',
      emergencyRelation: '',
      bloodGroup: '',
      allergies: '', 
      profilePhoto: '',
      cvFileName: ''
  });

  const [skills, setSkills] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner' });
  const [isLoading, setIsLoading] = useState(false);

  // Photo and CV upload immediately on selection (they are multipart requests,
  // separate from the JSON save), so they need their own busy/error state.
  const [photoBusy, setPhotoBusy] = useState(false);
  const [cvBusy, setCvBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // [NEW]: State to control the visibility of the Change Password sub-modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const sanitizeInitialPhone = (phone: string) => {
      if (!phone) return '';
      let cleaned = phone.replace(/[^0-9]/g, '');
      if (cleaned.startsWith('94') && cleaned.length > 9) cleaned = cleaned.substring(2);
      if (cleaned.startsWith('0') && cleaned.length > 9) cleaned = cleaned.substring(1);
      return cleaned.slice(0, 9);
  };

  useEffect(() => {
    if (currentData && isOpen) {
        setFormData({
            countryCode: currentData.countryCode || '+94',
            phoneNumber: sanitizeInitialPhone(currentData.phoneNumber),
            addressLine1: currentData.addressLine1 || '',
            addressLine2: currentData.addressLine2 || '',
            addressLine3: currentData.addressLine3 || '',
            emergencyName: currentData.emergencyContact?.name || '',
            emergencyCountryCode: currentData.emergencyContact?.countryCode || '+94',
            emergencyPhone: sanitizeInitialPhone(currentData.emergencyContact?.phone),
            emergencyRelation: currentData.emergencyContact?.relation || '',
            bloodGroup: currentData.medicalDetails?.bloodGroup || '',
            allergies: currentData.medicalDetails?.allergies || '',
            profilePhoto: currentData.profilePhoto || '',
            cvFileName: currentData.cvFile || ''
        });
        setSkills(currentData.skills || []);
    }
  }, [currentData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePhoneInput = (e: any) => {
      const value = e.target.value.replace(/[^0-9]/g, '');
      if (value.length <= 9) setFormData({ ...formData, [e.target.name]: value });
  };

  // The 400x400 centre-crop is kept from the original implementation: it keeps
  // uploads around 30KB, so no server-side image processing is needed. The
  // difference is the output — a Blob that is actually uploaded, rather than a
  // base64 string that only ever lived in this form's state.
  const cropToBlob = (file: File): Promise<Blob> =>
      new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onerror = () => reject(new Error('Could not read that image'));
          reader.onload = (event: any) => {
              const img = new Image();
              img.onerror = () => reject(new Error('That file is not a readable image'));
              img.onload = () => {
                  const canvas = document.createElement('canvas');
                  const size = Math.min(img.width, img.height);
                  canvas.width = 400;
                  canvas.height = 400;
                  const ctx = canvas.getContext('2d');

                  const startX = (img.width - size) / 2;
                  const startY = (img.height - size) / 2;

                  ctx?.drawImage(img, startX, startY, size, size, 0, 0, 400, 400);
                  canvas.toBlob(
                      (blob) => (blob ? resolve(blob) : reject(new Error('Could not process that image'))),
                      'image/jpeg',
                      0.8
                  );
              };
              img.src = event.target.result;
          };
          reader.readAsDataURL(file);
      });

  const handlePhotoUpload = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      e.target.value = '';   // allow re-picking the same file after an error

      setPhotoBusy(true);
      setUploadError(null);
      try {
          const blob = await cropToBlob(file);

          const body = new FormData();
          body.append('photo', blob, 'avatar.jpg');

          const token = localStorage.getItem('token');
          const res = await fetch("http://localhost:5001/api/profile/upload-photo", {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },   // no Content-Type: the browser sets the multipart boundary
              body
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.message || 'Upload failed');

          setFormData((prev) => ({ ...prev, profilePhoto: data.profilePhoto }));
          setStoredPhoto(data.profilePhoto);   // keeps the header avatar in sync
      } catch (err: any) {
          setUploadError(err.message || 'Could not upload that photo');
      } finally {
          setPhotoBusy(false);
      }
  };

  const handleCVUpload = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      e.target.value = '';

      setCvBusy(true);
      setUploadError(null);
      try {
          const body = new FormData();
          body.append('cvFile', file);

          const token = localStorage.getItem('token');
          const res = await fetch("http://localhost:5001/api/profile/upload-cv", {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
              body
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.message || 'Upload failed');

          setFormData((prev) => ({ ...prev, cvFileName: data.cvFile }));
      } catch (err: any) {
          setUploadError(err.message || 'Could not upload that CV');
      } finally {
          setCvBusy(false);
      }
  };

  const removePhoto = async (e: any) => {
      e.preventDefault();
      setPhotoBusy(true);
      setUploadError(null);
      try {
          const token = localStorage.getItem('token');
          await fetch("http://localhost:5001/api/profile/photo", {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` }
          });
          setFormData((prev) => ({ ...prev, profilePhoto: '' }));
          setStoredPhoto('');
      } catch {
          setUploadError('Could not remove the photo');
      } finally {
          setPhotoBusy(false);
      }
  };

  // Clears the reference only. The stored file is removed by the server the
  // next time a CV is uploaded, so nothing is orphaned.
  const removeCV = (e: any) => {
      e.preventDefault();
      setFormData((prev) => ({ ...prev, cvFileName: '' }));
  };

  const addSkill = () => {
      if (newSkill.name.trim() !== '') {
          setSkills([...skills, newSkill]);
          setNewSkill({ name: '', level: 'Beginner' });
      }
  };
  const removeSkill = (index: number) => setSkills(skills.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (formData.phoneNumber && formData.phoneNumber.length !== 9) return alert("Phone number must be exactly 9 digits.");
      if (formData.emergencyPhone && formData.emergencyPhone.length !== 9) return alert("Emergency Phone number must be exactly 9 digits.");

      setIsLoading(true);
      try {
          const token = localStorage.getItem('token');
          // profilePhoto and cvFileName are owned by the dedicated upload
          // endpoints. Sending them here too would let this JSON save overwrite
          // a freshly uploaded filename with a stale one.
          const { profilePhoto, cvFileName, ...jsonFields } = formData;
          const res = await fetch("http://localhost:5001/api/users/me", {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...jsonFields, skills })
          });
          const data = await res.json();
          if (data.success) {
              onSaveSuccess();
              onClose();
          } else { alert(data.message); }
      } catch (error) { alert("Error saving profile"); }
      setIsLoading(false);
  };

  const inputStyle = "w-full px-4 h-[48px] bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900 font-medium placeholder-gray-400 focus:border-blue-500 focus:bg-white transition-all";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-8">
        
        {/* [UPDATED]: Header area modified to include the Change Password button */}
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Edit Profile</h3>
            <div className="flex items-center gap-3">
                {/* Button triggers the sub-modal to open without closing the main form */}
                <button 
                    type="button" 
                    onClick={() => setIsPasswordModalOpen(true)} 
                    className="text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                >
                    Change Password
                </button>
                <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

            {uploadError && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-3">{uploadError}</div>
            )}

            {/* File Uploads — these save immediately, they do not wait for Save */}
            <div className="grid grid-cols-2 gap-4">
                <div className="relative border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl p-4 flex flex-col items-center justify-center transition-colors overflow-hidden group">
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                        <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" className="hidden" disabled={photoBusy} onChange={handlePhotoUpload} />
                        {photoBusy ? (
                            <p className="text-sm font-semibold text-gray-500 py-4">Uploading...</p>
                        ) : formData.profilePhoto ? (
                            <div className="absolute inset-0 w-full h-full">
                                <img src={resolvePhotoUrl(formData.profilePhoto) || ''} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <>
                                <svg className="text-blue-500 mb-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
                                <p className="text-sm font-semibold text-gray-700">Profile Photo</p>
                                <p className="text-xs text-gray-400 mt-1">Click to upload & auto-crop</p>
                            </>
                        )}
                    </label>
                    {formData.profilePhoto && (
                        <button onClick={removePhoto} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full z-10 shadow-md">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                    )}
                </div>
                
                <div className="relative border-2 border-dashed border-gray-200 hover:border-orange-400 rounded-xl p-4 flex flex-col items-center justify-center transition-colors">
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                        {/* PDF only — the server rejects anything else */}
                        <input type="file" accept="application/pdf,.pdf" className="hidden" disabled={cvBusy} onChange={handleCVUpload} />
                        <svg className="text-orange-500 mb-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                        <p className="text-sm font-semibold text-gray-700">Upload CV</p>
                        <p className="text-xs font-medium text-gray-900 mt-1 truncate w-full text-center px-2">
                            {cvBusy ? 'Uploading...' : formData.cvFileName ? 'CV uploaded' : 'Click to browse (PDF)'}
                        </p>
                    </label>
                    {formData.cvFileName && (
                        <button onClick={removeCV} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full z-10 shadow-md">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Phone Number (Now takes the full width) */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="flex h-[48px]">
                    <select name="countryCode" value={formData.countryCode} onChange={handleChange} className="bg-gray-50 border border-gray-200 rounded-l-xl px-3 outline-none text-gray-900 font-medium h-full">
                        <option value="+94">+94 (LK)</option>
                        <option value="+1">+1 (US)</option>
                    </select>
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handlePhoneInput} placeholder="770000000" className="w-full px-4 bg-gray-50 border border-l-0 border-gray-200 rounded-r-xl outline-none text-gray-900 font-medium h-full focus:bg-white focus:border-blue-500" required/>
                </div>
            </div>

            {/* Address */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Home Address</label>
                <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} placeholder="Line 1 (Street Address)" className={inputStyle}/>
                <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} placeholder="Line 2 (City / Area)" className={inputStyle}/>
                <input type="text" name="addressLine3" value={formData.addressLine3} onChange={handleChange} placeholder="Line 3 (Province / Postal Code)" className={inputStyle}/>
            </div>

            {/* Dedicated Medical Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                <div className="col-span-1 md:col-span-2"><h4 className="font-semibold text-gray-900">Medical Details</h4></div>
                <div>
                    <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={inputStyle}>
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option><option value="O+">O+</option><option value="B+">B+</option><option value="AB+">AB+</option>
                        <option value="A-">A-</option><option value="O-">O-</option><option value="B-">B-</option><option value="AB-">AB-</option>
                    </select>
                </div>
                <div>
                    <input type="text" name="allergies" value={formData.allergies} onChange={handleChange} placeholder="Allergies (e.g. Peanuts, None)" className={inputStyle}/>
                </div>
            </div>

            {/* Emergency Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                <div className="col-span-1 md:col-span-2"><h4 className="font-semibold text-gray-900">Emergency Contact</h4></div>
                <input type="text" name="emergencyName" value={formData.emergencyName} onChange={handleChange} placeholder="Contact Name" className={inputStyle}/>
                <input type="text" name="emergencyRelation" value={formData.emergencyRelation} onChange={handleChange} placeholder="Relationship (e.g. Spouse)" className={inputStyle}/>
                
                <div className="col-span-1 md:col-span-2 flex h-[48px]">
                    <select name="emergencyCountryCode" value={formData.emergencyCountryCode} onChange={handleChange} className="bg-gray-50 border border-gray-200 rounded-l-xl px-3 outline-none text-gray-900 font-medium h-full">
                        <option value="+94">+94 (LK)</option>
                        <option value="+1">+1 (US)</option>
                    </select>
                    <input type="text" name="emergencyPhone" value={formData.emergencyPhone} onChange={handlePhoneInput} placeholder="770000000" className="w-full px-4 bg-gray-50 border border-l-0 border-gray-200 rounded-r-xl outline-none text-gray-900 font-medium h-full focus:bg-white focus:border-blue-500" required/>
                </div>
            </div>

            {/* Skills */}
            <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Professional Skills</h4>
                <div className="flex gap-2 mb-3">
                    <input type="text" value={newSkill.name} onChange={(e) => setNewSkill({...newSkill, name: e.target.value})} placeholder="Skill (e.g. React.js)" className="flex-1 px-4 h-[42px] bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium"/>
                    <select value={newSkill.level} onChange={(e) => setNewSkill({...newSkill, level: e.target.value})} className="px-3 h-[42px] bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-900 font-medium">
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                    </select>
                    <button type="button" onClick={addSkill} className="px-4 h-[42px] bg-blue-100 text-blue-700 font-bold rounded-lg hover:bg-blue-200 flex items-center gap-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg> Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                        <div key={index} className="bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2">
                            {skill.name} <span className="opacity-70 font-normal">({skill.level})</span>
                            <button type="button" onClick={() => removeSkill(index)} className="hover:text-red-400">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
                <button type="button" onClick={onClose} className="flex-1 py-3.5 text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isLoading} className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl">{isLoading ? 'Saving...' : 'Save Profile'}</button>
            </div>
        </form>
      </div>

      {/* [NEW]: Render the Change Password Modal entirely on top of the Edit Profile modal when the state is set to true */}
      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
    </div>
  );
}