import React, { useState } from 'react';
import { Plus, Bell, Trash2, CheckCircle2, Edit2, Sparkles, Tag, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Announcement, AnnouncementType } from '../../types';

export const AdminAnnouncements: React.FC = () => {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, showToast } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<AnnouncementType>('special_offer');
  const [linkUrl, setLinkUrl] = useState('');
  const [active, setActive] = useState(true);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setContent('');
    setType('special_offer');
    setLinkUrl('');
    setActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setEditingItem(ann);
    setTitle(ann.title);
    setContent(ann.content);
    setType(ann.type);
    setLinkUrl(ann.linkUrl || '');
    setActive(ann.active);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast('Validation Error', 'Title and content are required.', 'error');
      return;
    }

    if (editingItem) {
      updateAnnouncement(editingItem.id, {
        title: title.trim(),
        content: content.trim(),
        type,
        linkUrl: linkUrl.trim() || undefined,
        active,
      });
      showToast('Updated', 'Store announcement updated successfully.', 'success');
    } else {
      addAnnouncement({
        title: title.trim(),
        content: content.trim(),
        type,
        linkUrl: linkUrl.trim() || undefined,
        active,
      });
      showToast('Published', 'New store announcement broadcasted.', 'success');
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">Announcements & Customer Alerts</h2>
          <p className="text-stone-500">
            Publish store notices, discount announcements, and new arrival alerts to customer screens.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`p-5 rounded-2xl border transition-all shadow-sm ${
              ann.active ? 'bg-white border-stone-200' : 'bg-stone-50 border-stone-200 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    ann.type === 'special_offer'
                      ? 'bg-amber-100 text-amber-800'
                      : ann.type === 'new_arrival'
                      ? 'bg-emerald-100 text-emerald-800'
                      : ann.type === 'discount'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {ann.type.replace('_', ' ')}
                </span>
                <span className="text-[11px] text-stone-400">
                  {new Date(ann.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleOpenEdit(ann)}
                  className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete announcement?')) deleteAnnouncement(ann.id);
                  }}
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <h4 className="font-bold text-stone-900 text-sm mb-1">{ann.title}</h4>
            <p className="text-stone-600 mb-3 leading-relaxed">{ann.content}</p>

            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
              <span className="font-semibold text-stone-500">
                Status: {ann.active ? '🟢 Live on Storefront' : '⚪ Archived'}
              </span>
              <button
                onClick={() => updateAnnouncement(ann.id, { active: !ann.active })}
                className="text-stone-700 hover:text-stone-950 font-bold underline"
              >
                {ann.active ? 'Deactivate' : 'Publish'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-stone-200 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-stone-900 text-base">
                {editingItem ? 'Edit Announcement' : 'Create Store Announcement'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Alert Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flash 20% Off Audio Gear Today"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Badge Classification</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AnnouncementType)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white font-bold"
                >
                  <option value="special_offer">Special Offer</option>
                  <option value="new_arrival">New Arrival</option>
                  <option value="discount">Seasonal Discount</option>
                  <option value="business">Business Notice</option>
                  <option value="important">Important Notification</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Message Content *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Details regarding the promotion, promo code, or shipping notice..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Action Destination Link (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. #offers"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="ann-active-check"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded text-stone-900"
                />
                <label htmlFor="ann-active-check" className="font-bold text-stone-700 cursor-pointer">
                  Activate and display immediately to customers
                </label>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-bold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold shadow-md"
                >
                  Save Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
