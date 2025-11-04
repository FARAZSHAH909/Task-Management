import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code, User, Clock, ChevronRight } from 'lucide-react';
import { getAllPublicRep } from '../firebaseServices/PublicRepo';

const PublicRepos = () => {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Theme configuration
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


    const fetchPublicRepos = async () => {
        try {
            setLoading(true)
            const response = await getAllPublicRep();
            if (response.success) {
                // console.log(response.data)
                setRepos(response.data)
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
        fetchPublicRepos()
    }, []);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
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
        <div className={`w-full overflow-hidden px-4 ${theme.bg} min-h-screen py-6`}>
            <div className="max-w-screen-xl mx-auto">
                <h2 className={`text-xl md:text-2xl font-bold ${theme.text} mb-6 flex items-center`}>
                    <Code className={`h-5 w-5 md:h-6 md:w-6 mr-2 ${theme.accent}`} />
                    Public Repositories
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {repos.map((repo) => (
                        <div
                            key={repo.id}
                            className={`rounded-lg ${theme.border} overflow-hidden ${theme.cardBg} hover:border-amber-400/30 transition-colors border p-5`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center">
                                    <Code className={`h-5 w-5 mr-2 ${theme.accent}`} />
                                    <h3 className={`text-lg font-medium ${theme.text} truncate`}>{repo.name}</h3>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full bg-gray-700/60 ${theme.mutedText}`}>
                                    {repo.language}
                                </span>
                            </div>

                            <div className={`flex items-center ${theme.mutedText} text-sm mb-2`}>
                                <User className="h-4 w-4 mr-2" />
                                <span>{repo.uploadedByName}</span>
                            </div>

                            <div className={`flex items-center ${theme.mutedText} text-sm mb-4`}>
                                <Clock className="h-4 w-4 mr-2" />
                                <span>Uploaded: {formatDate(repo.uploadedAt)}</span>
                            </div>

                            <div className="pt-3 border-t border-gray-700 flex justify-end">
                                <Link
                                    to={`/repo/${repo.id}`}
                                    className={`inline-flex items-center ${theme.accent} ${theme.accentHover} text-sm`}
                                >
                                    View Repo <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PublicRepos;