import React, { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../store/Authstore/login';

function LogIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const { loading, error } = useSelector((state) => state.just);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm();

  // Switch between login and signup modes (if you want this feature)
  const switchMode = () => {
    navigate('/sign-in');
  };

  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(loginUser(data));
      if (loginUser.fulfilled.match(resultAction)) {
        reset();
        navigate('/');
      } else if (loginUser.rejected.match(resultAction)) {
        setError('password', {
          message: resultAction.payload || 'Login failed',
        });
      }
    } catch (e) {
      setError('password', { message: 'An unexpected error occurred.' });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                {isLogin ? 'Sign in to your account' : 'Create your account'}
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                {isLogin
                  ? "Don't have an account? "
                  : 'Already have an account? '}
                <button
                  type="button"
                  onClick={switchMode}
                  className="font-medium text-blue-600 hover:text-blue-500 underline"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
            <div className="mt-8 space-y-6">
              <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 space-y-4">
                {/* If you want a fullName field for signup, uncomment below: */}
                {/* {!isLogin && (
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
                      placeholder="Enter your name"
                      {...register('fullName', {
                        required: !isLogin && 'Full name is required',
                        minLength: { value: 2, message: 'Name too short' },
                      })}
                    />
                    {errors.fullName && (
                      <p className="text-red-500">{errors.fullName.message}</p>
                    )}
                  </div>
                )} */}

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
                  {error === 'you are not authorized' && (
                    <div className="text-red-500">You are not authorized</div>
                  )}
                </div>

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

                  {error === 'you are not authorized' && (
                    <div>you are not authorized</div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 leading-tight" />
                    <span className="text-sm text-gray-700">Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </a>
                </div>

                {error && (
                  <p className="text-sm text-yellow-500">Invalid credentials</p>
                )}

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
        </div>
      </form>
    </>
  );
}

export default LogIn;
