import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

type AuthMode = 'login' | 'register';

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { showAlert } = useAlert();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    // Clear form when switching modes
    setEmail('');
    setPassword('');
    setFullName('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!email.trim() || !password.trim()) {
      showAlert('error', 'Please fill in all required fields');
      return;
    }

    if (!validateEmail(email)) {
      showAlert('error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      showAlert('error', 'Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message === 'Invalid login credentials' || error.message.includes('invalid_credentials')) {
            showAlert('error', 'Invalid email or password. Please check your credentials and try again.');
          } else {
            showAlert('error', 'An error occurred during sign in. Please try again.');
          }
          return;
        }
        showAlert('success', 'Successfully logged in!');
      } else {
        if (!fullName.trim()) {
          showAlert('error', 'Please enter your full name');
          setLoading(false);
          return;
        }
        
        const { error } = await signUp(email, password, fullName);
        if (error) {
          // Check if the error is due to an existing user
          if (error.message === 'User already registered' || error.message.includes('user_already_exists')) {
            showAlert('error', 'An account with this email already exists. Please try logging in instead.');
            setMode('login');
            setLoading(false);
            return;
          } else {
            showAlert('error', 'An error occurred during registration. Please try again.');
          }
        } else {
          showAlert('success', 'Account created successfully! You can now log in.');
          setMode('login');
        }
      }
    } catch (error: any) {
      showAlert('error', 'An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'login' ? 'Sign in to StockSence' : 'Create your account'}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {mode === 'login' 
            ? 'Enter your credentials to access your account' 
            : 'Fill in the information to create your account'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {mode === 'register' && (
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="John Doe"
              />
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              placeholder="••••••••"
              required
              minLength={6}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </form>
      
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={toggleMode}
          className="text-sm font-medium text-teal-600 hover:text-teal-500 focus:outline-none"
        >
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;