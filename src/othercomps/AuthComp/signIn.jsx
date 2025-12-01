import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { clearError, loginUser } from '../../store/Authstore/login';

export default function AuthForms() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError, // corrected here
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' });

  const dispatch = useDispatch();

  const { error, token, loading } = useSelector((state) => state.just);

  const password = watch('password', '');
  const navigate = useNavigate();

  const submit = async (data) => {
    const resultAction = await dispatch(loginUser(data));
    console.log(data);

    if (loginUser.fulfilled.match(resultAction)) {
      if (token) {
        navigate('/login');
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      await axios.post(
        'https://r01ck4rh-405.inc1.devtunnels.ms/auth/register',
        {
          email: data.email,
          username: data.username,
          password: data.password,
        }
      );
      navigate('/login');
      reset();
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      if (message.toLowerCase().includes('email')) {
        setError('email', { type: 'server', message });
      } else {
        setError('root', { type: 'server', message });
      }
      reset();
    }
  };

  const switchMode = () => {
    navigate('/login');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?
              <button
                type="button"
                onClick={switchMode}
                className="font-medium text-blue-600 hover:text-blue-500 underline"
              >
                sign-in
              </button>
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                  placeholder="Enter your full name"
                  {...register('username', {
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'At least 2 characters' },
                    maxLength: {
                      value: 18,
                      message: 'At most 18 characters',
                    },
                  })}
                />
                {errors.username && (
                  <p className="text-red-500">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                  placeholder="Enter your email"
                  {...register('email', {
                    required: 'Email is required',
                    minLength: { value: 4, message: 'Email too short' },
                    pattern: {
                      value:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: 'Please enter a valid email',
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}

                <div>
                  <label
                    htmlFor="password"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'At least 6 characters' },
                      maxLength: {
                        value: 18,
                        message: 'At most 18 characters',
                      },
                    })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p className="text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    {...register('confirmPassword', {
                      required: 'Kindly confirm your password',
                      validate: (value) =>
                        value === password || 'Passwords do not match',
                    })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && (
                    <p className=" text-sm text-yellow-600 mt-2 ml-2">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {errors.root && (
                  <p className="text-red-400 mt-4 text-center">
                    {errors.root.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <button
                disabled={loading}
                type="submit"
                className={
                  loading
                    ? 'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-400 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out'
                    : 'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out'
                }
              >
                {loading ? 'Logging You In' : 'Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
