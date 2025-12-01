import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PostUser } from '../store/profile';
import { useForm } from 'react-hook-form';
import { X, User, Image, Smile, FileText, AlertCircle } from 'lucide-react';

export default function ProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);

  const onSubmit = async (data) => {
    setApiError(null);

    try {
      const resultAction = await dispatch(PostUser(data));

      if (PostUser.fulfilled.match(resultAction)) {
        navigate('/profile');
        console.log('profile should be updated');

        reset();
      } else if (PostUser.rejected.match(resultAction)) {
        setApiError(
          resultAction.error.message ||
            'Failed to save profile. Please try again.'
        );
      }
    } catch (error) {
      setApiError('An unexpected error occurred. Please try again.');
    }
  };

  const handleCancel = () => {
    reset();
    navigate('/profile');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tl from-gray-800 via-black to-gray-800 p-4">
      <div className="bg-neutral-900 rounded-xl shadow-2xl w-full max-w-2xl border border-neutral-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <div>
            <h2 className="text-white text-2xl font-bold">Profile</h2>
            <p className="text-gray-400 text-sm mt-1">
              Set up your profile information
            </p>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition p-2 hover:bg-neutral-800 rounded-lg"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* API Error Alert */}
          {apiError && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-400 text-sm">{apiError}</p>
              </div>
              <button
                type="button"
                onClick={() => setApiError(null)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Display Name */}
          <div>
            <label className="flex items-center gap-2 text-gray-200 mb-2 font-medium">
              <User className="w-4 h-4" />
              Display Name <span className="text-red-400">*</span>
            </label>
            <input
              className={`w-full px-4 py-2.5 rounded-lg bg-neutral-800 text-white border ${
                errors.displayName ? 'border-red-500' : 'border-neutral-700'
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
              {...register('displayName', {
                required: 'Display name is required',
                minLength: {
                  value: 2,
                  message: 'Display name must be at least 2 characters',
                },
                maxLength: {
                  value: 50,
                  message: 'Display name must not exceed 50 characters',
                },
              })}
              placeholder="Enter your display name"
            />
            {errors.displayName && (
              <p className="flex items-center gap-1 text-red-400 text-sm mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.displayName.message}
              </p>
            )}
          </div>

          {/* Profile Picture */}
          <div>
            <label className="flex items-center gap-2 text-gray-200 mb-2 font-medium">
              <Image className="w-4 h-4" />
              Profile Picture URL
            </label>
            <input
              type="url"
              className={`w-full px-4 py-2.5 rounded-lg bg-neutral-800 text-white border ${
                errors.profilePic ? 'border-red-500' : 'border-neutral-700'
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition`}
              {...register('profilePic', {
                pattern: {
                  value: /^https?:\/\/.+\..+/i,
                  message: 'Please enter a valid URL',
                },
              })}
              placeholder="https://example.com/image.jpg"
            />
            {errors.profilePic && (
              <p className="flex items-center gap-1 text-red-400 text-sm mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.profilePic.message}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1.5">
              Optional: Add a URL to your profile picture
            </p>
          </div>

          {/* Mood Input */}
          <div>
            <label className="flex items-center gap-2 text-gray-200 mb-2 font-medium">
              <Smile className="w-4 h-4" />
              Current Mood
            </label>
            <input
              className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              {...register('mood', {
                maxLength: {
                  value: 100,
                  message: 'Mood must not exceed 100 characters',
                },
              })}
              placeholder="How are you feeling today?"
            />
            {errors.mood && (
              <p className="flex items-center gap-1 text-red-400 text-sm mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.mood.message}
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="flex items-center gap-2 text-gray-200 mb-2 font-medium">
              <FileText className="w-4 h-4" />
              Bio
            </label>
            <textarea
              className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              {...register('bio', {
                maxLength: {
                  value: 500,
                  message: 'Bio must not exceed 500 characters',
                },
              })}
              rows={4}
              placeholder="Tell us about yourself..."
            />
            {errors.bio && (
              <p className="flex items-center gap-1 text-red-400 text-sm mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.bio.message}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1.5">
              Maximum 500 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2.5 px-4 bg-neutral-800 text-gray-300 font-medium rounded-lg border border-neutral-700 hover:bg-neutral-750 hover:text-white transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-2.5 px-4 font-medium rounded-lg shadow-lg transition ${
                isSubmitting
                  ? 'bg-neutral-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:shadow-xl'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
