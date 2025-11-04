import { useState, useEffect } from 'react';
import {
    Folder,
    MessageSquare,
    User,
    Clock,
    Download,
    AlertCircle,
    Loader2,
    Trash2
} from 'lucide-react';
import { deleteCommentFromPublicRep, deletePublicRepById, getPublicRepById } from '../firebaseServices/PublicRepo';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const RepoViewer = () => {
    const [project, setProjects] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const { id } = useParams()

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await getPublicRepById(id);
            if (response.success) {
                // console.log(response.data)
                setProjects(response.data)
            } else {
                setError(typeof (error) == String ? error : "Something went wrong");
            }
            setLoading(false);
        } catch (err) {
            setError(typeof (error) == String ? error : "Something went wrong");
            setLoading(false);
        }
    };
    useEffect(() => {


        fetchProjects();
    }, []);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDeleteComment = async (commentID) => {
        try {
            toast.loading("Deleting comment...");

            const response = await deleteCommentFromPublicRep(id, commentID);
            if (response.success) {
                fetchProjects();
            } else {
                setError(typeof (error) == String ? error : "Something went wrong");
            }
            setLoading(false);
        } catch (err) {
            setError(typeof (error) == String ? error : "Something went wrong");
            setLoading(false);
        } finally {
            toast.dismiss()
        }
    };

    const navigate = useNavigate()
    const handleDeleteRepo = async () => {
        try {
            toast.loading("Deleting Repo...");

            const response = await deletePublicRepById(id);
            if (response.success) {
                navigate("/public-repos")
            } else {
                setError(typeof (error) == String ? error : "Something went wrong");
            }
            setLoading(false);
        } catch (err) {
            setError(typeof (error) == String ? error : "Something went wrong");
            setLoading(false);
        } finally {
            toast.dismiss()
        }
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
        <div className={`w-full px-4 ${theme.bg} min-h-screen py-6`}>
            <Toaster />
            <div className="max-w-screen-2xl mx-auto">
                <h1 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center`}>
                    <Folder className={`h-6 w-6 mr-2 ${theme.accent}`} />
                    Public Repo
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    <div
                        key={project.id}
                        className={`rounded-lg ${theme.border} overflow-hidden ${theme.cardBg} hover:border-amber-400/30 transition-colors border flex flex-col h-full`}
                    >
                        <div className="p-5 flex-grow">
                            <h2 className={`text-lg font-semibold ${theme.text} mb-2`}>
                                {project.name}
                            </h2>

                            <p className={`${theme.mutedText} text-sm mb-4`}>
                                {project.description}
                            </p>

                            <div className={`flex items-center ${theme.mutedText} text-sm mb-2`}>
                                <User className="h-4 w-4 mr-2" />
                                <span>Uploaded by: {project.uploadedByName}</span>
                            </div>

                            <div className={`flex items-center ${theme.mutedText} text-sm mb-4`}>
                                <Clock className="h-4 w-4 mr-2" />
                                <span>{formatDate(project.uploadedAt)}</span>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <a
                                    href={project.fileUrl}
                                    download
                                    className={`flex items-center ${theme.accent} ${theme.accentHover} text-sm`}
                                >
                                    <Download className="h-4 w-4 mr-1" />
                                    Download Project
                                </a>

                                <button
                                    onClick={() => handleDeleteRepo(project.id)}
                                    className={`flex items-center text-sm ${theme.accent} ${theme.accentHover}`}
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete Repo
                                </button>
                            </div>

                            {project.comments && Object.keys(project.comments).length > 0 && (
                                <div className={`pt-3 border-t ${theme.border}`}>
                                    <div className={`flex items-center ${theme.mutedText} text-sm mb-2`}>
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        <span>Comments:</span>
                                    </div>

                                    {Object.entries(project.comments).map(([id, comment]) => (
                                        <div key={id} className="pl-6 mb-3">
                                            <p className={`${theme.text} text-sm`}>
                                                "{comment.comment}"
                                            </p>
                                            <p className={`${theme.mutedText} text-xs mt-1`}>
                                                - {comment.username}, {formatDate(comment.timestamp)}
                                            </p>
                                            <button
                                                onClick={() => handleDeleteComment(id)}
                                                className={`mt-1 text-xs flex items-center ${theme.accent} ${theme.accentHover}`}
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" />
                                                Delete Comment
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RepoViewer;
