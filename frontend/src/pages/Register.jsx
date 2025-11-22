import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // For navigation
import { toast } from 'react-toastify'; // For pretty alerts
import axios from 'axios';
import { UserPlus } from 'lucide-react';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();
  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      const userData = { name, email, password };
      // Call Backend API
      await axios.post('https://career-canvas-qtnw.onrender.com/api/users', userData);
      
      toast.success('Registration Successful! Please Login.');
      navigate('/login'); // Move user to login page
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-violet-600 p-8 text-center">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <UserPlus className="text-white h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Join CareerCanvas</h2>
          <p className="text-violet-100">Start tracking your dream job today.</p>
        </div>

        <form onSubmit={onSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
              id="name"
              name="name"
              value={name}
              placeholder="Abdul Rehman"
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
              id="email"
              name="email"
              value={email}
              placeholder="ar@example.com"
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
              id="password"
              name="password"
              value={password}
              placeholder="••••••••"
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              placeholder="••••••••"
              onChange={onChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-violet-200"
          >
            Create Account
          </button>
        </form>

        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
