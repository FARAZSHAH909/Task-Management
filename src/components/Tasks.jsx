import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { getAllTasks } from '../firebaseServices/tasks.firebase';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Unified dark theme colors
    const theme = {
        bg: 'bg-gray-900',
        cardBg: 'bg-gray-800',
        border: 'border-gray-700',
        text: 'text-gray-100',
        mutedText: 'text-gray-400',
        accent: 'text-amber-400',
        accentHover: 'hover:text-amber-300',
        headerBg: 'bg-gray-800/50',
        errorBg: 'bg-red-900/30',
        errorBorder: 'border-red-700'
    };



    const fetchAllReocrds = async () => {
        console.log("d")
        try {
            setLoading(true)
            const response = await getAllTasks();
            if (response.success) {
                // console.log(response.data)
                setTasks(response.data)
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
        fetchAllReocrds()


    }, []);

    const getStatusIcon = (status) => {
        const baseClass = "h-4 w-4 mr-2";
        switch (status) {
            case 'completed':
                return <CheckCircle className={`${baseClass} text-emerald-400`} />;
            case 'in-progress':
                return <Clock className={`${baseClass} text-amber-400`} />;
            case 'pending':
                return <AlertCircle className={`${baseClass} text-red-400`} />;
            default:
                return <ClipboardList className={`${baseClass} ${theme.mutedText}`} />;
        }
    };

    // const getPriorityBadge = (priority) => {
    //     const baseClass = "text-xs px-2 py-1 rounded-full";
    //     switch (priority) {
    //         case 'critical':
    //             return <span className={`${baseClass} bg-red-900/40 text-red-300`}>Critical</span>;
    //         case 'high':
    //             return <span className={`${baseClass} bg-amber-900/40 text-amber-300`}>High</span>;
    //         case 'medium':
    //             return <span className={`${baseClass} bg-yellow-900/40 text-yellow-300`}>Medium</span>;
    //         case 'low':
    //             return <span className={`${baseClass} bg-gray-700/60 ${theme.mutedText}`}>Low</span>;
    //         default:
    //             return <span className={`${baseClass} bg-gray-700/60 ${theme.mutedText}`}>Normal</span>;
    //     }
    // };

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
            <div className={`flex justify-center items-center h-64 ${theme.bg}`}>
                <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${theme.accent}`}></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${theme.errorBg} ${theme.errorBorder} ${theme.text} p-4 rounded-lg mx-4`}>
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className={`mt-2 text-sm underline ${theme.accentHover}`}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className={`w-full overflow-hidden px-4 ${theme.bg} min-h-screen`}>
            <div className="max-w-screen-xl mx-auto py-6">
                <h2 className={`text-xl md:text-2xl font-bold ${theme.text} mb-6 flex items-center`}>
                    <ClipboardList className={`h-5 w-5 md:h-6 md:w-6 mr-2 ${theme.accent}`} />
                    Task Management
                </h2>

                <div className={`rounded-lg ${theme.border} overflow-hidden ${theme.cardBg}`}>
                    {/* Table Header */}
                    <div className={`grid grid-cols-12 p-4 ${theme.headerBg} ${theme.mutedText} font-medium text-sm`}>
                        <div className="col-span-6 md:col-span-7">Task</div>
                        <div className="col-span-2 md:col-span-2">Status</div>
                        <div className="col-span-2">Due Date</div>
                        <div className="col-span-2 md:col-span-1 text-right">Actions</div>
                    </div>

                    {/* Table Body */}
                    {tasks.length === 0 ? (
                        <div className={`p-6 text-center ${theme.mutedText}`}>
                            No tasks found
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`grid grid-cols-12 items-center p-4 border-t ${theme.border} hover:bg-gray-750/50 transition-colors`}
                            >
                                <div className={`col-span-6 md:col-span-7 font-medium ${theme.text} truncate`}>
                                    {task.name}
                                </div>
                                <div className="col-span-2 md:col-span-2 flex items-center">
                                    {getStatusIcon(task.status)}
                                    <span className="capitalize">{task.status.replace('-', ' ')}</span>
                                </div>
                                <div className={`col-span-2 ${theme.mutedText} text-sm`}>
                                    {formatDate(task.dueDate)}
                                </div>
                                <div className="col-span-2 md:col-span-1 flex justify-end">
                                    <Link
                                        to={`/task/${task.id}`}
                                        className={`${theme.mutedText} ${theme.accentHover} transition-colors`}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tasks;