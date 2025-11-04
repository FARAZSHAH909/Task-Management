import { User, Calendar, ClipboardList, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTaskWithUserById, markTaskAsCompleted } from '../firebaseServices/tasks.firebase';

const TaskDetail = () => {
    const [taskData, setTaskData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { id } = useParams()

    useEffect(() => {
        const fetchTask = async () => {
            try {
                // Replace with your actual API call
                const response = await getTaskWithUserById(id)
                if (response.success) {
                    // console.log(response.data)
                    setTaskData(response.data);
                } else {
                    setError(response.message)
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-5 w-5 text-emerald-500" />;
            case 'in-progress':
                return <Clock className="h-5 w-5 text-amber-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-red-500" />;
        }
    };

    const ref = useRef()
    const navigate = useNavigate()
    const updateStatus = async () => {
        ref.current.disabled = true
        ref.current.innerText = "Updating status"
        const response = await markTaskAsCompleted(id);
        if (response.success) {
            navigate("/tasks")
        } else {
            ref.current.innerText = "Mark as completed";
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 bg-gray-900">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-lg mx-4">
                <p>{error}</p>
            </div>
        );
    }

    if (!taskData) {
        return (
            <div className="bg-gray-800/50 border border-gray-700 text-gray-400 p-4 rounded-lg mx-4">
                No task data found
            </div>
        );
    }

    return (
        <div className="bg-gray-900 min-h-screen p-6">
            <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {/* Task Header */}
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-white flex items-center">
                            <ClipboardList className="h-6 w-6 mr-2 text-amber-400" />
                            {taskData.task.name}
                        </h1>
                        <div className="flex items-center space-x-2">
                            {getStatusIcon(taskData.task.status)}
                            <span className="capitalize text-sm bg-gray-700 px-3 py-1 rounded-full">
                                {taskData.task.status.replace('-', ' ')}
                            </span>
                        </div>
                    </div>
                    <p className="mt-3 text-gray-300">{taskData.task.description}</p>
                </div>

                {/* Task Meta */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Due Date */}
                        <div className="flex items-start">
                            <Calendar className="h-5 w-5 mr-3 mt-0.5 text-amber-400 flex-shrink-0" />
                            <div>
                                <h3 className="text-sm font-medium text-gray-400">Due Date</h3>
                                <p className="text-white">
                                    {new Date(taskData.task.dueDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Assigned User */}

                        {
                            taskData.user && (<div className="flex items-start">
                                {taskData.user.profilePicture ? (
                                    <img
                                        src={taskData.user.profilePicture}
                                        alt={taskData.user.name}
                                        className="h-10 w-10 rounded-full mr-3 border border-amber-400/30"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center mr-3 border border-amber-400/30">
                                        <User className="h-5 w-5 text-amber-400" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400">Task Owner</h3>
                                    <p className="text-white">{taskData.user.name}</p>
                                    <p className="text-sm text-gray-400">{taskData.user.email}</p>
                                </div>
                            </div>)
                        }

                    </div>
                </div>

                {/* Task Actions */}
                <div className="p-6 bg-gray-800/50 border-t border-gray-700 flex justify-end space-x-3">
                    {/* <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                        Edit Task
                    </button> */}

                    {
                        taskData.task.status != "completed" && (<button
                            ref={ref}
                            onClick={updateStatus}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-white transition-colors">
                            Mark Complete
                        </button>)
                    }

                </div>
            </div>
        </div>
    );
};

export default TaskDetail;