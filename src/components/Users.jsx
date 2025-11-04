import { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Calendar, User, UserCircle, Trash2 } from 'lucide-react';
import { deleteUsersByEmail, fetchAllUsers } from '../firebaseServices/users.firebase.js';
import toast, { Toaster } from 'react-hot-toast';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")


    const fetchusers = async () => {
        try {
            setLoading(true)
            const response = await fetchAllUsers();
            if (response.success) {
                // console.log(response.data)
                setUsers(response.data)
                setLoading(false)
            } else {
                setError(typeof (error) == String ? error : "Something went wrong");
            }
        } catch (error) {
            setError(typeof (error) == String ? error : "Something went wrong");
        } finally {
            setLoading(false)
        }

    }


    useEffect(() => {

        fetchusers()
    }, []);


    const handleDeleteUser = async (email) => {
        try {
            toast.loading("Deleting the user")
            const response = await deleteUsersByEmail(email);
            if (response.success) {
                fetchusers()
            } else {
                setError(typeof (error) == String ? error : "Something went wrong");
            }
        } catch (error) {
            setError(typeof (error) == String ? error : "Something went wrong");
        }
        finally {
            toast.dismiss()
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error != "") {
        return (
            <div className="dark bg-gray-900 p-6 ">
                <div className="text-red-600 text-center font-extrabold ">
                    {error.toUpperCase()}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-4 bg-[#1a1a2e] min-h-screen py-6">
            <Toaster />
            <div className="max-w-screen-xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center">
                    <UserIcon className="h-6 w-6 mr-2 text-purple-400" />
                    User Management
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="bg-[#2a2a40] rounded-xl p-4 border border-[#3a3a55] hover:border-purple-600/30 transition relative"
                        >
                            {/* Delete button - positioned top right */}
                            {/* <button
                                onClick={() => handleDeleteUser(user.email)}
                                className="absolute top-3 right-3 p-1 rounded-full hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition"
                                aria-label={`Delete ${user.name}`}
                            >
                                <Trash2 className="h-4 w-4" />
                            </button> */}

                            <div className="flex items-start gap-4">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={`${user.name}'s avatar`}
                                        className="h-12 w-12 rounded-full object-cover border border-purple-600/20"
                                    />
                                ) : (
                                    <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 border border-purple-600/20">
                                        <UserCircle className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                    </div>
                                )}

                                <div className="flex-1 overflow-hidden">
                                    <h3 className="text-lg font-semibold text-white truncate">
                                        {user.name}
                                    </h3>
                                    <div className="flex items-center mt-1 text-gray-400 text-sm overflow-hidden">
                                        <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                    <div className="flex items-center mt-1 text-gray-400 text-sm">
                                        <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                                        <span>{formatDate(user.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Users;
