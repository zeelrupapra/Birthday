import React, { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Sliders,
  Download,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  FileText,
  HelpCircle,
  Trophy,
  Disc,
  Type,
  Lock,
  ArrowLeft,
  Check,
  Sparkles,
  Calendar,
  Eye,
  Info
} from 'lucide-react';
import { BirthdayConfig, MemoryPhoto, QuizQuestion, AwardCategory, WheelOption } from '../data/birthdayConfig';
import { useBirthdayConfig } from '../context/BirthdayContext';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const { config, updateConfig, resetConfig, exportConfigJson, importConfigJson } = useBirthdayConfig();
  
  // Local edit state to allow batch saving
  const [formData, setFormData] = useState<BirthdayConfig>(() => JSON.parse(JSON.stringify(config)));
  const [activeTab, setActiveTab] = useState<'basic' | 'photos' | 'letter' | 'texts' | 'quiz' | 'award' | 'wheel'>('basic');
  const [isSaved, setIsSaved] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });
  const [adminPinInput, setAdminPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Keep local form in sync if external config updates
  useEffect(() => {
    setFormData(JSON.parse(JSON.stringify(config)));
  }, [config]);

  // Handle Admin PIN Login
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPinInput === config.passcode || adminPinInput === '1710' || adminPinInput === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setPinError('');
    } else {
      setPinError(`Incorrect passcode. Use "${config.passcode}" or "1710".`);
    }
  };

  const handleSave = () => {
    updateConfig(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to Vrushti Didu default configuration? Any custom changes will be overwritten.')) {
      resetConfig();
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importConfigJson(content);
        if (ok) {
          alert('Configuration imported successfully!');
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 3000);
        } else {
          alert('Invalid JSON file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  // Convert uploaded image to compressed Base64 data URL
  const handlePhotoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress & scale to max 1200px width/height to avoid localStorage size limits
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

          setFormData((prev) => {
            const updatedPhotos = [...prev.photos];
            updatedPhotos[index] = {
              ...updatedPhotos[index],
              imagePath: compressedDataUrl
            };
            return { ...prev, photos: updatedPhotos };
          });
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Add a brand new photo
  const handleAddNewPhoto = () => {
    const newId = (formData.photos.length > 0 ? Math.max(...formData.photos.map((p) => p.id)) : 0) + 1;
    const newPhoto: MemoryPhoto = {
      id: newId,
      title: `Memory #${newId} 🌸`,
      caption: 'A wonderful moment together...',
      story: 'Every single memory with you is cherished forever in my heart!',
      dateTag: `Vrushti Didu Photo ${newId}`,
      imagePath: '/photos/photo1.jpg',
      fallbackGradient: 'from-pink-400 via-rose-300 to-pink-200',
      accentEmoji: '💖',
      fit: 'cover',
      scale: 1,
      rotate: 0,
      positionX: 50,
      positionY: 50
    };
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, newPhoto]
    }));
  };

  const handleDeletePhoto = (index: number) => {
    if (formData.photos.length <= 1) {
      alert('You must keep at least 1 photo.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, idx) => idx !== index)
    }));
  };

  // Letter paragraph helpers
  const handleAddParagraph = () => {
    setFormData((prev) => ({
      ...prev,
      letter: {
        ...prev.letter,
        paragraphs: [...prev.letter.paragraphs, 'Another special message for my cute sister...']
      }
    }));
  };

  const handleDeleteParagraph = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      letter: {
        ...prev.letter,
        paragraphs: prev.letter.paragraphs.filter((_, i) => i !== idx)
      }
    }));
  };

  // If not authenticated, show PIN protection modal
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#2D1226]/95 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-pink-200 text-center animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-display text-2xl font-black text-slate-800 mb-1">
            Admin Panel Access
          </h2>
          <p className="text-xs text-slate-500 mb-5">
            Enter the admin passcode to customize texts, photos, letter, and all settings.
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                inputMode="numeric"
                placeholder="Enter passcode (e.g. 1710)"
                value={adminPinInput}
                onChange={(e) => {
                  setAdminPinInput(e.target.value);
                  setPinError('');
                }}
                className="w-full text-center text-xl font-mono font-bold tracking-widest py-3 px-4 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50/50"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-rose-500 font-semibold mt-2">{pinError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-sm shadow-md hover:opacity-95 active:scale-95 transition-all"
            >
              Unlock Admin Panel 🔓
            </button>
          </form>

          <button
            onClick={onClose}
            className="mt-4 text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Birthday Card</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md overflow-y-auto text-slate-800 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-200 px-4 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center font-black shadow-xs">
              👑
            </div>
            <div>
              <h1 className="font-display text-lg font-black text-slate-900 leading-tight">
                Birthday Surprise Admin Panel
              </h1>
              <p className="text-[11px] font-semibold text-pink-600">
                Managing card for: {formData.name} (from {formData.senderName})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSaved && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold animate-fade-in">
                <Check className="w-3.5 h-3.5" /> Saved!
              </span>
            )}

            <button
              onClick={handleSave}
              className="py-2 px-4 rounded-xl bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>

            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-extrabold text-xs flex items-center gap-1.5 transition-all"
              title="Return to preview as user"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Card</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6">
        {/* Left Side Tab Navigation */}
        <nav className="w-full md:w-60 shrink-0 space-y-1.5">
          <div className="bg-white p-2 rounded-2xl border border-pink-100 shadow-xs space-y-1">
            {[
              { id: 'basic', label: 'Basic Info & Lock', icon: Lock },
              { id: 'photos', label: 'Photo Memories', icon: ImageIcon },
              { id: 'letter', label: 'Heartfelt Letter', icon: FileText },
              { id: 'texts', label: 'Headings & Messages', icon: Type },
              { id: 'quiz', label: 'Bestie Quiz', icon: HelpCircle },
              { id: 'award', label: 'Awards Ceremony', icon: Trophy },
              { id: 'wheel', label: 'Spin Wheel', icon: Disc }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all text-left ${
                    isActive
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-pink-50 hover:text-pink-600'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Backup / Export / Reset Controls */}
          <div className="bg-white p-3 rounded-2xl border border-pink-100 shadow-xs space-y-2 text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
              Backup & Data
            </span>
            <button
              onClick={exportConfigJson}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold flex items-center gap-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-pink-500" />
              <span>Export JSON Backup</span>
            </button>

            <label className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold flex items-center gap-2 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-pink-500" />
              <span>Import JSON Backup</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>

            <button
              onClick={handleResetToDefaults}
              className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold flex items-center gap-2 transition-colors mt-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </nav>

        {/* Right Main Edit Card */}
        <main className="flex-1 bg-white rounded-3xl p-5 sm:p-7 border border-pink-100 shadow-xl overflow-y-auto max-h-[82vh]">
          {/* ======================================================== */}
          {/* TAB 1: BASIC INFO & PASSCODE */}
          {/* ======================================================== */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-black text-slate-800">
                  Basic Info & Security Lock
                </h2>
                <p className="text-xs text-slate-500">
                  Configure recipient name, sender, birthdate countdown target, and secret 4-digit lock code.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Birthday Person Name:
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    placeholder="e.g. Vrushti didu"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sender / Creator Name:
                  </label>
                  <input
                    type="text"
                    value={formData.senderName}
                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    placeholder="e.g. Zeel"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nickname / Display Name:
                  </label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    placeholder="e.g. Meri Cute Vrushti Didu 🌸"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Secret Passcode (Lock Code):
                  </label>
                  <input
                    type="text"
                    value={formData.passcode}
                    onChange={(e) => setFormData({ ...formData, passcode: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-pink-300 bg-pink-50/50 font-mono text-sm font-bold text-pink-700 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    placeholder="1710"
                    maxLength={6}
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Default is 1710. This opens the secret entry screen!
                  </span>
                </div>
              </div>

              {/* Birth Date Section */}
              <div className="bg-pink-50/60 p-4 rounded-2xl border border-pink-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-pink-600" />
                  <h3 className="font-display text-sm font-black text-pink-800">
                    Birth Date & Countdown Target
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Day (e.g. 17):
                    </label>
                    <input
                      type="number"
                      value={formData.birthDay}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          birthDay: parseInt(e.target.value) || 17,
                          birthDateString: `${String(e.target.value).padStart(2, '0')}/${String(formData.birthMonth).padStart(2, '0')}/${formData.birthYear}`
                        })
                      }
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 text-sm font-semibold bg-white"
                      min={1}
                      max={31}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Month (1-12, 10=Oct):
                    </label>
                    <input
                      type="number"
                      value={formData.birthMonth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          birthMonth: parseInt(e.target.value) || 10,
                          birthDateString: `${String(formData.birthDay).padStart(2, '0')}/${String(e.target.value).padStart(2, '0')}/${formData.birthYear}`
                        })
                      }
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 text-sm font-semibold bg-white"
                      min={1}
                      max={12}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Birth Year (e.g. 2008):
                    </label>
                    <input
                      type="number"
                      value={formData.birthYear}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          birthYear: parseInt(e.target.value) || 2008,
                          birthDateString: `${String(formData.birthDay).padStart(2, '0')}/${String(formData.birthMonth).padStart(2, '0')}/${e.target.value}`
                        })
                      }
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 text-sm font-semibold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Display String:
                    </label>
                    <input
                      type="text"
                      value={formData.birthDateString}
                      onChange={(e) => setFormData({ ...formData, birthDateString: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 text-sm font-semibold bg-white"
                      placeholder="17/10/2008"
                    />
                  </div>
                </div>
              </div>

              {/* Relationship Subtitle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Relationship Subtitle / Badge:
                </label>
                <input
                  type="text"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  placeholder="e.g. MY CUTE SISTER, BEST FRIEND & CLOSEST PERSON IN THE UNIVERSE 🌸💖"
                />
              </div>

              {/* Music Setting */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Music Track Title:
                  </label>
                  <input
                    type="text"
                    value={formData.songTitle}
                    onChange={(e) => setFormData({ ...formData, songTitle: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Music File Path / Audio URL:
                  </label>
                  <input
                    type="text"
                    value={formData.musicPath}
                    onChange={(e) => setFormData({ ...formData, musicPath: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm font-semibold font-mono"
                    placeholder="/music/birthday-song.mp3"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: PHOTOS & MEMORIES */}
          {/* ======================================================== */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-black text-slate-800">
                    Photos & Memories Manager
                  </h2>
                  <p className="text-xs text-slate-500">
                    Upload new photos, change titles, captions, and stories for all memory cards and gallery.
                  </p>
                </div>

                <button
                  onClick={handleAddNewPhoto}
                  className="py-2 px-3.5 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Photo</span>
                </button>
              </div>

              <div className="space-y-5">
                {formData.photos.map((photo, idx) => (
                  <div
                    key={photo.id}
                    className="p-4 sm:p-5 rounded-2xl border border-pink-200 bg-pink-50/30 space-y-4 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-black text-pink-700 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs">
                          {idx + 1}
                        </span>
                        <span>Photo #{idx + 1} - {photo.title}</span>
                      </span>

                      <button
                        onClick={() => handleDeletePhoto(idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Delete photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Image Preview with LIVE adjustment reflection & Upload Button */}
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-pink-300 bg-white text-center">
                        {photo.imagePath && (
                          <div className="w-full aspect-4/3 rounded-xl overflow-hidden mb-2 bg-slate-100 flex items-center justify-center relative shadow-inner border border-pink-100">
                            <img
                              src={photo.imagePath}
                              alt={photo.title}
                              style={{
                                objectFit: photo.fit || 'cover',
                                objectPosition: `${photo.positionX ?? 50}% ${photo.positionY ?? 50}%`,
                                transform: `scale(${photo.scale ?? 1}) rotate(${photo.rotate ?? 0}deg)`,
                                transformOrigin: `${photo.positionX ?? 50}% ${photo.positionY ?? 50}%`,
                              }}
                              className="w-full h-full transition-all duration-200 pointer-events-none"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono text-white pointer-events-none">
                              {photo.fit || 'cover'} · {photo.rotate ?? 0}° · {Math.round((photo.scale ?? 1) * 100)}%
                            </div>
                          </div>
                        )}

                        <label className="w-full py-2 px-3 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Image File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload(idx, e)}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[10px] text-slate-400 mt-1">
                          PNG, JPG, WebP supported
                        </span>
                      </div>

                      {/* Fields */}
                      <div className="md:col-span-2 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Title:
                            </label>
                            <input
                              type="text"
                              value={photo.title}
                              onChange={(e) => {
                                const newPhotos = [...formData.photos];
                                newPhotos[idx].title = e.target.value;
                                setFormData({ ...formData, photos: newPhotos });
                              }}
                              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Date Tag / Subtitle:
                            </label>
                            <input
                              type="text"
                              value={photo.dateTag}
                              onChange={(e) => {
                                const newPhotos = [...formData.photos];
                                newPhotos[idx].dateTag = e.target.value;
                                setFormData({ ...formData, photos: newPhotos });
                              }}
                              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Caption:
                          </label>
                          <input
                            type="text"
                            value={photo.caption}
                            onChange={(e) => {
                              const newPhotos = [...formData.photos];
                              newPhotos[idx].caption = e.target.value;
                              setFormData({ ...formData, photos: newPhotos });
                            }}
                            className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Story / Memory Description:
                          </label>
                          <textarea
                            rows={2}
                            value={photo.story}
                            onChange={(e) => {
                              const newPhotos = [...formData.photos];
                              newPhotos[idx].story = e.target.value;
                              setFormData({ ...formData, photos: newPhotos });
                            }}
                            className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-medium"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Accent Emoji:
                            </label>
                            <input
                              type="text"
                              value={photo.accentEmoji}
                              onChange={(e) => {
                                const newPhotos = [...formData.photos];
                                newPhotos[idx].accentEmoji = e.target.value;
                                setFormData({ ...formData, photos: newPhotos });
                              }}
                              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Image URL / Path:
                            </label>
                            <input
                              type="text"
                              value={photo.imagePath}
                              onChange={(e) => {
                                const newPhotos = [...formData.photos];
                                newPhotos[idx].imagePath = e.target.value;
                                setFormData({ ...formData, photos: newPhotos });
                              }}
                              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-mono"
                              placeholder="/photos/photo1.jpg"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Image Fit, Rotate, Scale & Position Adjustment Controls */}
                    <div className="mt-4 pt-4 border-t border-pink-200 bg-white/80 p-3.5 rounded-2xl space-y-3.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-pink-700 flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-pink-500" />
                          <span>Image Fit & Adjustment Controls (Card #{idx + 1})</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            const newPhotos = [...formData.photos];
                            newPhotos[idx] = {
                              ...newPhotos[idx],
                              fit: 'cover',
                              scale: 1,
                              rotate: 0,
                              positionX: 50,
                              positionY: 50
                            };
                            setFormData({ ...formData, photos: newPhotos });
                          }}
                          className="text-[11px] font-semibold text-slate-500 hover:text-pink-600 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-pink-50 transition-colors border border-transparent hover:border-pink-200"
                          title="Reset to default fit and rotation"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset Adjustments</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        {/* 1. Fit Mode Selector */}
                        <div className="bg-pink-50/40 p-2.5 rounded-xl border border-pink-100 flex flex-col justify-between">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                            Fit Mode:
                          </label>
                          <div className="grid grid-cols-3 gap-1">
                            {[
                              { id: 'cover', label: 'Cover' },
                              { id: 'contain', label: 'Fit' },
                              { id: 'fill', label: 'Stretch' }
                            ].map((f) => {
                              const isSelected = (photo.fit || 'cover') === f.id;
                              return (
                                <button
                                  key={f.id}
                                  type="button"
                                  onClick={() => {
                                    const newPhotos = [...formData.photos];
                                    newPhotos[idx] = { ...newPhotos[idx], fit: f.id as any };
                                    setFormData({ ...formData, photos: newPhotos });
                                  }}
                                  className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all border ${
                                    isSelected
                                      ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-pink-50'
                                  }`}
                                >
                                  {f.label}
                                </button>
                              );
                            })}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {photo.fit === 'contain' ? 'Entire image visible' : photo.fit === 'fill' ? 'Stretches card' : 'Fills entire card'}
                          </span>
                        </div>

                        {/* 2. Rotate Controls */}
                        <div className="bg-pink-50/40 p-2.5 rounded-xl border border-pink-100 flex flex-col justify-between">
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-slate-700">
                              Rotation:
                            </label>
                            <span className="text-[10px] font-mono font-bold text-pink-600 bg-pink-100 px-1.5 py-0.5 rounded">
                              {photo.rotate ?? 0}°
                            </span>
                          </div>

                          <div className="flex items-center gap-1 mb-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const newPhotos = [...formData.photos];
                                const currentRot = newPhotos[idx].rotate ?? 0;
                                newPhotos[idx] = { ...newPhotos[idx], rotate: (currentRot - 90 + 360) % 360 };
                                setFormData({ ...formData, photos: newPhotos });
                              }}
                              className="flex-1 py-1 px-1 rounded-lg bg-white border border-slate-200 hover:bg-pink-50 text-slate-700 text-[10px] font-bold flex items-center justify-center gap-0.5"
                              title="Rotate left 90°"
                            >
                              <RotateCcw className="w-2.5 h-2.5 text-pink-500" />
                              <span>-90°</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const newPhotos = [...formData.photos];
                                const currentRot = newPhotos[idx].rotate ?? 0;
                                newPhotos[idx] = { ...newPhotos[idx], rotate: (currentRot + 90) % 360 };
                                setFormData({ ...formData, photos: newPhotos });
                              }}
                              className="flex-1 py-1 px-1 rounded-lg bg-white border border-slate-200 hover:bg-pink-50 text-slate-700 text-[10px] font-bold flex items-center justify-center gap-0.5"
                              title="Rotate right 90°"
                            >
                              <RotateCw className="w-2.5 h-2.5 text-pink-500" />
                              <span>+90°</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const newPhotos = [...formData.photos];
                                const currentRot = newPhotos[idx].rotate ?? 0;
                                newPhotos[idx] = { ...newPhotos[idx], rotate: (currentRot + 180) % 360 };
                                setFormData({ ...formData, photos: newPhotos });
                              }}
                              className="flex-1 py-1 px-1 rounded-lg bg-white border border-slate-200 hover:bg-pink-50 text-slate-700 text-[10px] font-bold flex items-center justify-center"
                              title="Flip 180°"
                            >
                              <span>180°</span>
                            </button>
                          </div>

                          <input
                            type="range"
                            min={-180}
                            max={180}
                            step={5}
                            value={photo.rotate ?? 0}
                            onChange={(e) => {
                              const newPhotos = [...formData.photos];
                              newPhotos[idx] = { ...newPhotos[idx], rotate: parseInt(e.target.value) || 0 };
                              setFormData({ ...formData, photos: newPhotos });
                            }}
                            className="w-full accent-pink-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                          />
                        </div>

                        {/* 3. Zoom / Scale Slider */}
                        <div className="bg-pink-50/40 p-2.5 rounded-xl border border-pink-100 flex flex-col justify-between">
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-slate-700">
                              Zoom / Scale:
                            </label>
                            <span className="text-[10px] font-mono font-bold text-pink-600 bg-pink-100 px-1.5 py-0.5 rounded">
                              {Math.round((photo.scale ?? 1) * 100)}%
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 mb-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const newPhotos = [...formData.photos];
                                const current = newPhotos[idx].scale ?? 1;
                                newPhotos[idx] = { ...newPhotos[idx], scale: Math.max(0.5, Number((current - 0.1).toFixed(2))) };
                                setFormData({ ...formData, photos: newPhotos });
                              }}
                              className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-pink-50 text-slate-700 text-xs font-bold flex items-center justify-center"
                              title="Zoom out"
                            >
                              <ZoomOut className="w-3 h-3" />
                            </button>

                            <input
                              type="range"
                              min={0.5}
                              max={2.5}
                              step={0.05}
                              value={photo.scale ?? 1}
                              onChange={(e) => {
                                const newPhotos = [...formData.photos];
                                newPhotos[idx] = { ...newPhotos[idx], scale: parseFloat(e.target.value) || 1 };
                                setFormData({ ...formData, photos: newPhotos });
                              }}
                              className="flex-1 accent-pink-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                            />

                            <button
                              type="button"
                              onClick={() => {
                                const newPhotos = [...formData.photos];
                                const current = newPhotos[idx].scale ?? 1;
                                newPhotos[idx] = { ...newPhotos[idx], scale: Math.min(2.5, Number((current + 0.1).toFixed(2))) };
                                setFormData({ ...formData, photos: newPhotos });
                              }}
                              className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-pink-50 text-slate-700 text-xs font-bold flex items-center justify-center"
                              title="Zoom in"
                            >
                              <ZoomIn className="w-3 h-3" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const newPhotos = [...formData.photos];
                                newPhotos[idx] = { ...newPhotos[idx], scale: 1 };
                                setFormData({ ...formData, photos: newPhotos });
                              }}
                              className="px-1.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[9px] font-bold"
                              title="Reset zoom to 100%"
                            >
                              1x
                            </button>
                          </div>

                          <span className="text-[10px] text-slate-400 block">
                            Range: 50% to 250%
                          </span>
                        </div>

                        {/* 4. Position Pan (X & Y) */}
                        <div className="bg-pink-50/40 p-2.5 rounded-xl border border-pink-100 flex flex-col justify-between">
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-slate-700">
                              Position Pan:
                            </label>
                            <span className="text-[10px] font-mono text-slate-500">
                              X:{photo.positionX ?? 50}% Y:{photo.positionY ?? 50}%
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-bold text-slate-400 w-3">X</span>
                              <input
                                type="range"
                                min={0}
                                max={100}
                                step={1}
                                value={photo.positionX ?? 50}
                                onChange={(e) => {
                                  const newPhotos = [...formData.photos];
                                  newPhotos[idx] = { ...newPhotos[idx], positionX: parseInt(e.target.value) || 50 };
                                  setFormData({ ...formData, photos: newPhotos });
                                }}
                                className="flex-1 accent-pink-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                              />
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-bold text-slate-400 w-3">Y</span>
                              <input
                                type="range"
                                min={0}
                                max={100}
                                step={1}
                                value={photo.positionY ?? 50}
                                onChange={(e) => {
                                  const newPhotos = [...formData.photos];
                                  newPhotos[idx] = { ...newPhotos[idx], positionY: parseInt(e.target.value) || 50 };
                                  setFormData({ ...formData, photos: newPhotos });
                                }}
                                className="flex-1 accent-pink-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-1 mt-1">
                            {['Top', 'Center', 'Bottom'].map((pos) => (
                              <button
                                key={pos}
                                type="button"
                                onClick={() => {
                                  const newPhotos = [...formData.photos];
                                  const y = pos === 'Top' ? 0 : pos === 'Bottom' ? 100 : 50;
                                  newPhotos[idx] = { ...newPhotos[idx], positionX: 50, positionY: y };
                                  setFormData({ ...formData, photos: newPhotos });
                                }}
                                className="flex-1 py-0.5 rounded bg-white hover:bg-pink-100 text-[9px] font-semibold text-slate-600 border border-slate-200"
                              >
                                {pos}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: HEARTFELT LETTER */}
          {/* ======================================================== */}
          {activeTab === 'letter' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-black text-slate-800">
                  Heartfelt Letter Editor
                </h2>
                <p className="text-xs text-slate-500">
                  Craft the heartfelt letter revealed inside the pink wax-sealed envelope.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Letter Screen Title:
                  </label>
                  <input
                    type="text"
                    value={formData.letter.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        letter: { ...formData.letter, title: e.target.value }
                      })
                    }
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Salutation:
                  </label>
                  <input
                    type="text"
                    value={formData.letter.salutation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        letter: { ...formData.letter, salutation: e.target.value }
                      })
                    }
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm font-bold text-pink-600"
                    placeholder="Dear Vrushti didu,"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      Letter Paragraphs (revealed line by line):
                    </label>
                    <button
                      onClick={handleAddParagraph}
                      className="py-1 px-3 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Paragraph</span>
                    </button>
                  </div>

                  {formData.letter.paragraphs.map((p, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0 mt-2">
                        {idx + 1}
                      </span>
                      <textarea
                        rows={3}
                        value={p}
                        onChange={(e) => {
                          const updated = [...formData.letter.paragraphs];
                          updated[idx] = e.target.value;
                          setFormData({
                            ...formData,
                            letter: { ...formData.letter, paragraphs: updated }
                          });
                        }}
                        className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-xs font-medium leading-relaxed"
                      />
                      <button
                        onClick={() => handleDeleteParagraph(idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors mt-2"
                        title="Delete paragraph"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Letter Closing:
                    </label>
                    <input
                      type="text"
                      value={formData.letter.closing}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          letter: { ...formData.letter, closing: e.target.value }
                        })
                      }
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Signature:
                    </label>
                    <input
                      type="text"
                      value={formData.letter.signature}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          letter: { ...formData.letter, signature: e.target.value }
                        })
                      }
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-pink-600"
                      placeholder="Your Zeel Forever & Always 💕"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: HEADINGS & MESSAGES */}
          {/* ======================================================== */}
          {activeTab === 'texts' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-black text-slate-800">
                  Headings, Welcome & Final Messages
                </h2>
                <p className="text-xs text-slate-500">
                  Customize the title, countdown headline, secret screen hints, and emotional climax message.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-200 space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-pink-700">
                    Welcome & Lock Screens
                  </h3>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Welcome Title:
                    </label>
                    <input
                      type="text"
                      value={formData.welcomeTitle}
                      onChange={(e) => setFormData({ ...formData, welcomeTitle: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Welcome Subtitle:
                    </label>
                    <input
                      type="text"
                      value={formData.welcomeSubtitle}
                      onChange={(e) => setFormData({ ...formData, welcomeSubtitle: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Lock Screen Heading:
                      </label>
                      <input
                        type="text"
                        value={formData.secretScreenHeading}
                        onChange={(e) => setFormData({ ...formData, secretScreenHeading: e.target.value })}
                        className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Lock Screen Hint:
                      </label>
                      <input
                        type="text"
                        value={formData.secretScreenHint}
                        onChange={(e) => setFormData({ ...formData, secretScreenHint: e.target.value })}
                        className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-200 space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-pink-700">
                    Countdown Celebration Screen
                  </h3>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Countdown Unlocked Headline:
                    </label>
                    <input
                      type="text"
                      value={formData.unlockCelebrationHeadline}
                      onChange={(e) => setFormData({ ...formData, unlockCelebrationHeadline: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Countdown Celebration Subtext:
                    </label>
                    <textarea
                      rows={2}
                      value={formData.unlockCelebrationSubtext}
                      onChange={(e) => setFormData({ ...formData, unlockCelebrationSubtext: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-200 space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-pink-700">
                    Final Climax Message
                  </h3>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Final Headline:
                    </label>
                    <input
                      type="text"
                      value={formData.finalMessage.headline}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          finalMessage: { ...formData.finalMessage, headline: e.target.value }
                        })
                      }
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700">
                      Final Paragraphs:
                    </label>
                    {formData.finalMessage.paragraphs.map((p, pIdx) => (
                      <textarea
                        key={pIdx}
                        rows={2}
                        value={p}
                        onChange={(e) => {
                          const updated = [...formData.finalMessage.paragraphs];
                          updated[pIdx] = e.target.value;
                          setFormData({
                            ...formData,
                            finalMessage: { ...formData.finalMessage, paragraphs: updated }
                          });
                        }}
                        className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Final Toast / Motto:
                      </label>
                      <input
                        type="text"
                        value={formData.finalMessage.toast}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            finalMessage: { ...formData.finalMessage, toast: e.target.value }
                          })
                        }
                        className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Final Button Label:
                      </label>
                      <input
                        type="text"
                        value={formData.finalMessage.finalButtonText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            finalMessage: { ...formData.finalMessage, finalButtonText: e.target.value }
                          })
                        }
                        className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: BESTIE QUIZ */}
          {/* ======================================================== */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-black text-slate-800">
                  Sister & Bestie Quiz Editor
                </h2>
                <p className="text-xs text-slate-500">
                  Edit quiz questions, options, and cute reactions when an answer is chosen.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Quiz Title:
                    </label>
                    <input
                      type="text"
                      value={formData.quiz.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quiz: { ...formData.quiz, title: e.target.value }
                        })
                      }
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Result Badge Text:
                    </label>
                    <input
                      type="text"
                      value={formData.quiz.resultScoreText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quiz: { ...formData.quiz, resultScoreText: e.target.value }
                        })
                      }
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                    />
                  </div>
                </div>

                {formData.quiz.questions.map((q, qIdx) => (
                  <div key={qIdx} className="p-4 rounded-2xl border border-pink-200 bg-pink-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-pink-700">
                        Question {qIdx + 1}
                      </span>
                    </div>

                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => {
                        const updated = [...formData.quiz.questions];
                        updated[qIdx].question = e.target.value;
                        setFormData({
                          ...formData,
                          quiz: { ...formData.quiz, questions: updated }
                        });
                      }}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                    />

                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Options & Reactions:
                      </span>
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => {
                              const updated = [...formData.quiz.questions];
                              updated[qIdx].options[oIdx].text = e.target.value;
                              setFormData({
                                ...formData,
                                quiz: { ...formData.quiz, questions: updated }
                              });
                            }}
                            className="py-1.5 px-3 rounded-lg border border-slate-200 text-xs bg-white font-medium"
                            placeholder="Option text"
                          />
                          <input
                            type="text"
                            value={opt.reaction}
                            onChange={(e) => {
                              const updated = [...formData.quiz.questions];
                              updated[qIdx].options[oIdx].reaction = e.target.value;
                              setFormData({
                                ...formData,
                                quiz: { ...formData.quiz, questions: updated }
                              });
                            }}
                            className="py-1.5 px-3 rounded-lg border border-slate-200 text-xs bg-white text-pink-600 font-semibold"
                            placeholder="Reaction text"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: AWARDS CEREMONY */}
          {/* ======================================================== */}
          {activeTab === 'award' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-black text-slate-800">
                  Awards Ceremony & Certificate
                </h2>
                <p className="text-xs text-slate-500">
                  Configure the printable honors certificate and categories presented to Vrushti Didu.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Award Ceremony Title:
                    </label>
                    <input
                      type="text"
                      value={formData.award.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          award: { ...formData.award, title: e.target.value }
                        })
                      }
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Recipient Name on Certificate:
                    </label>
                    <input
                      type="text"
                      value={formData.award.recipient}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          award: { ...formData.award, recipient: e.target.value }
                        })
                      }
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-pink-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Award Title / Distinction:
                    </label>
                    <input
                      type="text"
                      value={formData.award.awardName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          award: { ...formData.award, awardName: e.target.value }
                        })
                      }
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Date:
                    </label>
                    <input
                      type="text"
                      value={formData.award.officialDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          award: { ...formData.award, officialDate: e.target.value }
                        })
                      }
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-pink-700">
                    Award Honors Categories:
                  </h3>
                  {formData.award.categories.map((cat, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-3 rounded-xl border border-pink-200 bg-pink-50/30 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                    >
                      <input
                        type="text"
                        value={cat.icon}
                        onChange={(e) => {
                          const updated = [...formData.award.categories];
                          updated[cIdx].icon = e.target.value;
                          setFormData({
                            ...formData,
                            award: { ...formData.award, categories: updated }
                          });
                        }}
                        className="sm:col-span-1 text-center py-1.5 px-2 rounded-lg border border-slate-200 text-base bg-white"
                      />
                      <input
                        type="text"
                        value={cat.title}
                        onChange={(e) => {
                          const updated = [...formData.award.categories];
                          updated[cIdx].title = e.target.value;
                          setFormData({
                            ...formData,
                            award: { ...formData.award, categories: updated }
                          });
                        }}
                        className="sm:col-span-4 py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-bold bg-white"
                        placeholder="Honor title"
                      />
                      <input
                        type="text"
                        value={cat.desc}
                        onChange={(e) => {
                          const updated = [...formData.award.categories];
                          updated[cIdx].desc = e.target.value;
                          setFormData({
                            ...formData,
                            award: { ...formData.award, categories: updated }
                          });
                        }}
                        className="sm:col-span-7 py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-medium bg-white text-slate-600"
                        placeholder="Honor description"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: SPIN WHEEL */}
          {/* ======================================================== */}
          {activeTab === 'wheel' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-black text-slate-800">
                  Spinning Birthday Wheel
                </h2>
                <p className="text-xs text-slate-500">
                  Configure the 6 wheel slices, labels, emojis, and sweet challenge rewards.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Wheel Title:
                    </label>
                    <input
                      type="text"
                      value={formData.wheel.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          wheel: { ...formData.wheel, title: e.target.value }
                        })
                      }
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Wheel Subtitle:
                    </label>
                    <input
                      type="text"
                      value={formData.wheel.subtitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          wheel: { ...formData.wheel, subtitle: e.target.value }
                        })
                      }
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-pink-700">
                    Wheel Slices (6 items):
                  </h3>

                  {formData.wheel.options.map((opt, oIdx) => (
                    <div
                      key={opt.id}
                      className="p-3 rounded-xl border border-pink-200 bg-pink-50/30 space-y-2 text-xs"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                        <input
                          type="text"
                          value={opt.emoji}
                          onChange={(e) => {
                            const updated = [...formData.wheel.options];
                            updated[oIdx].emoji = e.target.value;
                            setFormData({
                              ...formData,
                              wheel: { ...formData.wheel, options: updated }
                            });
                          }}
                          className="sm:col-span-1 text-center py-1.5 px-2 rounded-lg border border-slate-200 text-sm bg-white"
                        />
                        <input
                          type="text"
                          value={opt.label}
                          onChange={(e) => {
                            const updated = [...formData.wheel.options];
                            updated[oIdx].label = e.target.value;
                            setFormData({
                              ...formData,
                              wheel: { ...formData.wheel, options: updated }
                            });
                          }}
                          className="sm:col-span-4 py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-bold bg-white"
                          placeholder="Slice Label"
                        />
                        <input
                          type="color"
                          value={opt.color}
                          onChange={(e) => {
                            const updated = [...formData.wheel.options];
                            updated[oIdx].color = e.target.value;
                            setFormData({
                              ...formData,
                              wheel: { ...formData.wheel, options: updated }
                            });
                          }}
                          className="sm:col-span-2 h-8 w-full rounded-lg border border-slate-200 bg-white cursor-pointer"
                        />
                        <input
                          type="text"
                          value={opt.challenge}
                          onChange={(e) => {
                            const updated = [...formData.wheel.options];
                            updated[oIdx].challenge = e.target.value;
                            setFormData({
                              ...formData,
                              wheel: { ...formData.wheel, options: updated }
                            });
                          }}
                          className="sm:col-span-5 py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-medium bg-white"
                          placeholder="Reward / Perk text"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
