import { useRef, useState } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { verifyAdminLogin } from '../firebaseServices/Adminauth';
import { useDispatch } from 'react-redux';
import { login } from "../store/reducers"
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });

    const ref = useRef()


    const dispatch = useDispatch();
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Basic validation
        let valid = true;
        const newErrors = { email: '', password: '' };

        if (!email.includes('@')) {
            newErrors.email = 'Invalid email';
            valid = false;
        }
        if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            valid = false;
        }

        setErrors(newErrors);
        if (valid) {
            ref.current.innerText = "Signin you in......."
            // console.log("working")
            let response = await verifyAdminLogin(email, password);

            if (response.success) {
                dispatch(login())
                toast.custom("You have been logged in")
                setTimeout(() => {
                    navigate("/")
                }, 2000);

            } else {
                setErrors({ email: 'Email or passwords are not valid', password: '' })
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
                {/* Header */}
                <div className="p-8 pb-6 border-b border-gray-700">
                    <div className="flex justify-center mb-2">
                        <div className="p-3 rounded-full bg-gradient-to-br from-amber-500 to-amber-600">
                            <Lock className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-white">Admin Portal</h2>
                    <p className="text-gray-400 text-center mt-1">Secure Task Management</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-6">
                    {/* Email Input */}
                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`bg-gray-700 text-white w-full pl-10 pr-3 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition`}
                                placeholder="Email address"
                            />
                        </div>
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`bg-gray-700 text-white w-full pl-10 pr-10 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition`}
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-amber-400 transition" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-amber-400 transition" />
                                )}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        ref={ref}
                        type="submit"
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition shadow-lg"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;