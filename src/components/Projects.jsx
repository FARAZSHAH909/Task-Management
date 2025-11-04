import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Folder, ChevronRight } from 'lucide-react';
import { getAllProjects } from '../firebaseServices/projects.firebase';

const Projects = () => {
    const [projects, setProjects] = useState([]);
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


    const fetchallProjects = async () => {
        try {
            setLoading(true)
            const response = await getAllProjects();
            if (response.success) {
                // console.log(response.data)
                setProjects(response.data)
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

        fetchallProjects()

    }, []);



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
                    <Folder className={`h-5 w-5 md:h-6 md:w-6 mr-2 ${theme.accent}`} />
                    Projects
                </h2>

                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}>
                    {projects.length === 0 ? (
                        <div className={`col-span-full text-center ${theme.mutedText} p-8`}>
                            No projects found
                        </div>
                    ) : (
                        projects.map((project) => (
                            <div
                                key={project.id}
                                className={`rounded-lg ${theme.border} overflow-hidden ${theme.cardBg} hover:border-amber-400/30 transition-colors border p-5 flex justify-between items-center`}
                            >
                                <div className="flex items-center">
                                    <Folder className={`h-5 w-5 mr-3 ${theme.accent}`} />
                                    <span className={`${theme.text} truncate`}>{project.name}</span>
                                </div>
                                <Link
                                    to={`/projects/${encodeURIComponent(project.id)}`}
                                    className={`${theme.mutedText} ${theme.accentHover} p-1 rounded-full`}
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Projects;