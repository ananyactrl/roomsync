import { useState, ChangeEvent, FormEvent } from 'react';
import { usersAPI } from '../services/api';

const INDIAN_UNIVERSITIES = [
  'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
  'IIT Roorkee', 'IIT Guwahati', 'IIT Hyderabad', 'IIT BHU', 'IIT ISM Dhanbad',
  'NIT Trichy', 'NIT Surathkal', 'NIT Warangal', 'NIT Calicut', 'NIT Rourkela',
  'BITS Pilani', 'BITS Goa', 'BITS Hyderabad', 'Delhi University', 'Mumbai University',
  'Jadavpur University', 'Anna University', 'VIT Vellore', 'SRM University', 'MIT Pune',
  'MIT AOE', 'Other'
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year+'];

type Profile = {
  full_name?: string;
  university?: string;
  major?: string;
  year?: number | string;
  bio?: string;
  avatar_url?: string;
};

type EditProfileModalProps = {
  profile: Profile;
  onClose: () => void;
  onSave: () => void;
};

const EditProfileModal: React.FC<EditProfileModalProps> = ({ profile, onClose, onSave }) => {
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    university: profile?.university || '',
    major: profile?.major || '',
    year: profile?.year ? `${profile.year} Year` : '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string>(profile?.avatar_url || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      setForm({ ...form, avatar_url: url });
    }
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const yearNum = parseInt(form.year);
      await usersAPI.updateProfile({
        ...form,
        year: isNaN(yearNum) ? null : yearNum,
      });
      onSave();
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <span className="text-xl">&times;</span>
        </button>
        <h2 className="text-lg font-bold text-wisteria-700 mb-4">Edit Profile</h2>
        <form onSubmit={handleSave} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-red-600 text-sm">{error}</div>}
          <div className="flex flex-col items-center mb-2">
            <div className="w-20 h-20 rounded-full bg-wisteria-200 flex items-center justify-center mb-2 overflow-hidden">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl text-wisteria-700 font-bold">
                  {form.full_name?.charAt(0) || '?'}
                </span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full text-xs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
            <select
              name="university"
              value={form.university}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent"
            >
              <option value="">Select university</option>
              {INDIAN_UNIVERSITIES.map((university) => (
                <option key={university} value={university}>
                  {university}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
            <input
              type="text"
              name="major"
              value={form.major}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent"
              placeholder="Enter your major"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              name="year"
              value={form.year}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent"
            >
              <option value="">Select year</option>
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-wisteria-300 focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-3 bg-wisteria-500 text-white rounded-xl font-medium hover:bg-wisteria-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal; 