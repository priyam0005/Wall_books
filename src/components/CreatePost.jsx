import React from 'react';
import { useForm } from 'react-hook-form';

export default function NewWallbookForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm({ defaultValues: { author: '', text: '' } });

  const submitHandler = async (data) => {
    await onSubmit({ ...data, timestamp: new Date().toISOString() });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="max-w-lg mx-auto p-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl ring-1 ring-purple-700/40 backdrop-blur-md"
    >
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6">
        Share a Wallbook Thought
      </h2>

      {/* Author Input */}
      <div className="mb-6">
        <label
          htmlFor="author"
          className="block text-gray-300 text-lg font-semibold mb-2"
        >
          Your Name
        </label>
        <input
          id="author"
          type="text"
          {...register('author', {
            required: 'Please enter your name',
            maxLength: { value: 30, message: 'Name can be max 30 characters' },
          })}
          placeholder="E.g., Alex"
          className={`w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500/60 transition-shadow duration-300 ${
            errors.author ? 'ring-2 ring-red-500' : 'ring-1 ring-gray-700'
          }`}
          autoComplete="off"
        />
        {errors.author && (
          <p className="mt-1 text-sm text-red-500 font-semibold">
            {errors.author.message}
          </p>
        )}
      </div>

      {/* Wallbook Textarea */}
      <div className="mb-8">
        <label
          htmlFor="text"
          className="block text-gray-300 text-lg font-semibold mb-2"
        >
          Your Wallbook
        </label>
        <textarea
          id="text"
          rows={5}
          {...register('text', {
            required: 'Wallbook text is required',
            minLength: {
              value: 10,
              message: 'Please enter at least 10 characters',
            },
            maxLength: {
              value: 250,
              message: 'Maximum 250 characters allowed',
            },
          })}
          placeholder="Share your thoughts here..."
          className={`w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-4 focus:ring-blue-500/60 transition-shadow duration-300 ${
            errors.text ? 'ring-2 ring-red-500' : 'ring-1 ring-gray-700'
          }`}
        />
        {errors.text && (
          <p className="mt-1 text-sm text-red-500 font-semibold">
            {errors.text.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl text-white text-xl font-bold shadow-lg transition-transform duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Posting Your Wallbook...' : 'Post Your Wallbook'}
      </button>

      {/* Success Message */}
      {isSubmitSuccessful && (
        <p className="mt-6 text-center text-green-400 font-semibold text-lg animate-pulse">
          ✅ Your wallbook has been successfully posted!
        </p>
      )}
    </form>
  );
}
