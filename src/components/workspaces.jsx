import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid3X3, User, ChevronRight, Ellipsis } from 'lucide-react';
import { getAllWorkspaces } from '../firebaseServices/Workspaces.firebase';

const Workspaces = () => {
    const [workspaces, setWorkspaces] = useState([]);
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

    const fetchallworkspaces = async () => {
        setLoading(true)
        try {
            // Replace with your actual API call
            const response = await getAllWorkspaces();
            if (response.success) {
                setWorkspaces(response.data)
            } else {
                setError(response.error);
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const mockWorkspaces = [
            {
                id: '1',
                name: 'Marketing Campaigns',
                createdBy: 'team-lead@example.com',
                description: 'All marketing materials and campaign assets for Q3 product launches and promotions across digital and print media.',
                createdAt: '2025-03-15T09:30:00.000Z'
            },
            {
                id: '2',
                name: 'Product Development',
                createdBy: 'cto@example.com',
                description: 'Core product development workspace with feature roadmaps, technical specifications, and sprint planning.',
                createdAt: '2025-01-10T14:45:00.000Z'
            },
            {
                id: '3',
                name: 'Customer Support',
                createdBy: 'support-head@example.com',
                description: 'Knowledge base, common issues, and escalation protocols for customer support team.',
                createdAt: '2025-02-22T11:20:00.000Z'
            },
            {
                id: '4',
                name: 'Executive Dashboard',
                createdBy: 'ceo@example.com',
                description: 'High-level metrics and KPIs for executive team with financial and operational reports.',
                createdAt: '2025-04-05T16:15:00.000Z'
            },
            {
                id: '5',
                name: 'UI/UX Design',
                createdBy: 'design-lead@example.com',
                description: 'Design system, component library, and user experience research documents for all products.',
                createdAt: '2025-05-18T10:00:00.000Z'
            },
            {
                id: '6',
                name: 'DevOps Pipeline',
                createdBy: 'devops@example.com',
                description: 'CI/CD configurations, deployment scripts, and infrastructure as code for all environments.',
                createdAt: '2025-03-30T13:50:00.000Z'
            }
        ];


        fetchallworkspaces();

    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const truncateDescription = (desc) => {
        return desc.length > 50 ? `${desc.substring(0, 50)}...` : desc;
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
                    <Grid3X3 className={`h-5 w-5 md:h-6 md:w-6 mr-2 ${theme.accent}`} />
                    Workspaces
                </h2>

                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}>
                    {workspaces.map((workspace) => (
                        <div
                            key={workspace.id}
                            className={`rounded-lg ${theme.border} overflow-hidden ${theme.cardBg} hover:border-amber-400/30 transition-colors border`}
                        >
                            <div className="p-5">
                                <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>
                                    {workspace.name}
                                </h3>

                                <div className={`flex items-center ${theme.mutedText} text-sm mb-3`}>
                                    <User className="h-4 w-4 mr-2" />
                                    <span className="truncate">{workspace.createdBy}</span>
                                </div>

                                <p className={`${theme.mutedText} text-sm mb-4`}>
                                    {truncateDescription(workspace.description)}
                                    {workspace.description.length > 50 && (
                                        <Link
                                            to={`/workspaces/${workspace.id}`}
                                            className={`ml-1 ${theme.accent} ${theme.accentHover} text-xs`}
                                        >
                                            (view full)
                                        </Link>
                                    )}
                                </p>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                                    <span className={`${theme.mutedText} text-xs`}>
                                        Created: {formatDate(workspace.createdAt)}
                                    </span>
                                    <Link
                                        to={`/workspaces/${workspace.id}`}
                                        className={`${theme.accent} ${theme.accentHover} text-sm flex items-center`}
                                    >
                                        View <ChevronRight className="h-4 w-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Workspaces;