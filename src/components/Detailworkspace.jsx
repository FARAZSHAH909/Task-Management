import { useState, useEffect } from 'react';
import {
    Folder, User, Clock, MessageSquare, Trash2, FileText, AlertCircle, Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteWorkspaceById, getWorkspaceWithTasks } from '../firebaseServices/Workspaces.firebase';
import toast, { Toaster } from 'react-hot-toast';

const theme = {
    bg: 'bg-gray-900',
    cardBg: 'bg-gray-800',
    border: 'border-gray-700',
    text: 'text-gray-100',
    mutedText: 'text-gray-400',
    accent: 'text-amber-400',
    accentHover: 'hover:text-amber-300',
    errorBg: 'bg-red-900/30',
    errorBorder: 'border-red-700'
};

const WorkspaceDetail = () => {
    const [workspace, setWorkspace] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatDate = (input) => {
        const date = new Date(input);
        return date.toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const { id } = useParams()

    const fetchData = async () => {
        try {

            setLoading(true)
            const response = await getWorkspaceWithTasks(id);
            if (response.success) {
                setWorkspace(response.data.workspace);
                setTasks(response.data.tasks);
            } else {
                throw new Error("Something went wrong");
            }

            setLoading(false);
        } catch (err) {
            console.log(err)
            setError("Failed to load workspace");
            setLoading(false);
        }
    };

    useEffect(() => {


        fetchData();
    }, []);

    const navigate = useNavigate()
    const handleDeleteWorkspace = async () => {
        try {
            toast.loading("Deleting the Workspace");
            const response = await deleteWorkspaceById(id);
            if (response.success) {
                navigate("/workspaces")
            } else {
                toast.error(response.error)
            }

            setLoading(false);
        } catch (err) {
            console.log(err)
            setError("Failed to delete");
            setLoading(false);
        } finally {
            toast.dismiss()
        }
    };

    const handleDeleteComment = (id, type) => {
        alert(`Delete ${type} comment with ID: ${id}`);
    };

    if (loading) {
        return (
            <div className={`flex justify-center items-center h-screen ${theme.bg}`}>
                <Loader2 className={`h-8 w-8 animate-spin ${theme.accent}`} />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${theme.errorBg} ${theme.errorBorder} rounded-lg p-4 mx-4`}>
                <div className="flex items-center">
                    <AlertCircle className={`h-5 w-5 mr-2 ${theme.accent}`} />
                    <p className={theme.text}>{error}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className={`mt-2 text-sm ${theme.accent} ${theme.accentHover}`}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className={`min-h-screen w-full px-4 py-6 ${theme.bg}`}>
            <Toaster />
            <div className="max-w-screen-xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className={`text-2xl font-bold flex items-center ${theme.text}`}>
                        <Folder className={`h-6 w-6 mr-2 ${theme.accent}`} />
                        {workspace.name}
                    </h1>
                    <button
                        onClick={handleDeleteWorkspace}
                        className={`text-sm flex items-center ${theme.accent} ${theme.accentHover}`}
                    >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete Workspace
                    </button>
                </div>

                <p className={`${theme.mutedText} mb-2`}>
                    <User className="inline-block h-4 w-4 mr-1" />
                    {workspace.createdBy}
                </p>
                <p className={`${theme.mutedText} mb-4`}>
                    <Clock className="inline-block h-4 w-4 mr-1" />
                    {formatDate(workspace.createdAt)}
                </p>
                <p className={`${theme.text} mb-6`}>{workspace.description}</p>

                {workspace.fileURL?.length > 0 && (
                    <div className={`mb-6`}>
                        <h2 className={`text-lg font-semibold ${theme.text} mb-2`}>Attached Files</h2>
                        {workspace.fileURL.map((file, idx) => (
                            <a
                                key={idx}
                                href={file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center ${theme.accent} ${theme.accentHover} text-sm mb-2`}
                            >
                                <FileText className="h-4 w-4 mr-1" /> View File {idx + 1}
                            </a>
                        ))}
                    </div>
                )}

                {workspace.comments?.length > 0 && (
                    <div className={`mb-8`}>
                        <h2 className={`text-lg font-semibold ${theme.text} mb-3`}>Workspace Comments</h2>
                        {workspace.comments.map(comment => (
                            <div key={comment.id} className={`mb-4 border-l-4 pl-4 ${theme.border}`}>
                                <p className={`${theme.text}`}>{comment.text}</p>
                                <p className={`${theme.mutedText} text-xs`}>
                                    - {comment.author}, {formatDate(comment.createdAt)}
                                </p>
                                {/* <button
                                    onClick={() => handleDeleteComment(comment.id, 'workspace')}
                                    className={`mt-1 text-xs ${theme.accent} ${theme.accentHover}`}
                                >
                                    <Trash2 className="inline h-3 w-3 mr-1" /> Delete Comment
                                </button> */}
                            </div>
                        ))}
                    </div>
                )}

                <div>
                    <h2 className={`text-xl font-bold ${theme.text} mb-4`}>Tasks</h2>
                    {tasks.map(task => (
                        <div key={task.id} className={`mb-6 p-4 rounded-lg ${theme.cardBg} ${theme.border} border`}>
                            <h3 className={`${theme.text} font-semibold text-lg`}>{task.title}</h3>
                            <p className={`${theme.mutedText} text-sm mb-1`}>Status: {task.status}</p>
                            <p className={`${theme.mutedText} text-sm mb-3`}>To: {task.assignedTo} — {formatDate(task.createdAt)}</p>

                            {task.comments?.length > 0 && (
                                <div>
                                    <p className={`text-sm font-semibold ${theme.text} mb-1`}>Comments:</p>
                                    {task.comments.map(comment => (
                                        <div key={comment.id} className={`ml-4 border-l-4 pl-4 ${theme.border} mb-3`}>
                                            <p className={`${theme.text}`}>{comment.text}</p>
                                            <p className={`${theme.mutedText} text-xs`}>
                                                - {comment.author}, {formatDate(comment.createdAt)}
                                            </p>
                                            {/* <button
                                                onClick={() => handleDeleteComment(comment.id, 'task')}
                                                className={`mt-1 text-xs ${theme.accent} ${theme.accentHover}`}
                                            >
                                                <Trash2 className="inline h-3 w-3 mr-1" /> Delete Comment
                                            </button> */}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorkspaceDetail;
