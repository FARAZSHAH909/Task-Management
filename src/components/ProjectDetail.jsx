import { useState, useEffect } from 'react';
import {
    User,
    Download,
    Folder,
    FileText,
    Calendar,
    Link as LinkIcon
} from 'lucide-react';
import { deleteProjectById, getProjectWithUserById } from '../firebaseServices/projects.firebase';
import { useNavigate, useParams } from 'react-router-dom';

const ProjectDetail = () => {
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { id } = useParams()
    useEffect(() => {
        const fetchProject = async () => {
            try {
                // Replace with your actual API call
                const response = await getProjectWithUserById(id);
                if (response.success) {
                    setProjectData(response.data)
                } else {
                    setError(response.error);
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, []);


    const navigate = useNavigate()
    const deleteProject = async () => {
        try {
            setLoading(true)
            const response = await deleteProjectById(id);
            if (response.success) {
                navigate("/projects")
                setLoading(false)
            } else {

                console.log(response.message)
                setError(typeof (error) == String ? error : "Something went wrong");
            }
        } catch (error) {

            setError(typeof (error) == String ? error : "Something went wrong");
        } finally {
            setLoading(false)
        }
    }


    const handleDownload = () => {
        if (projectData?.project?.fileUrl) {
            // Create a temporary anchor tag to trigger download
            const link = document.createElement('a');
            link.href = projectData.project.fileUrl;
            link.download = projectData.project.name || 'project_file';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

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
                <button
                    onClick={() => window.location.reload()}
                    className="mt-2 text-sm underline text-amber-400 hover:text-amber-300"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!projectData) {
        return (
            <div className="bg-gray-800/50 border border-gray-700 text-gray-400 p-4 rounded-lg mx-4">
                No project data found
            </div>
        );
    }

    return (
        <div className="bg-gray-900 min-h-screen p-6">
            <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {/* Project Header */}
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center">
                                <Folder className="h-6 w-6 mr-2 text-amber-400" />
                                {projectData.project.name}
                            </h1>
                            <p className="mt-2 text-gray-300">{projectData.project.description}</p>
                        </div>

                        {projectData.project.fileUrl && (
                            <a
                                href={projectData.project.fileUrl}
                                download
                                className="flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-white transition-colors"
                            >
                                <Download className="h-5 w-5 mr-2" />
                                Download
                            </a>
                        )}
                    </div>
                </div>

                {/* Project Meta */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* File Info */}
                        {projectData.project.fileUrl && (
                            <div className="flex items-start">
                                <FileText className="h-5 w-5 mr-3 mt-0.5 text-amber-400 flex-shrink-0" />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400">File</h3>
                                    <div className="flex items-center mt-1">
                                        <a
                                            href={projectData.project.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white hover:text-amber-400 flex items-center"
                                        >
                                            <LinkIcon className="h-4 w-4 mr-1" />
                                            View file
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}


                        {
                            projectData.user && (<div className="flex items-start">
                                {projectData.user.profilePicture ? (
                                    <img
                                        src={projectData.user.profilePicture}
                                        alt={projectData.user.name}
                                        className="h-10 w-10 rounded-full mr-3 border border-amber-400/30 object-cover"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center mr-3 border border-amber-400/30">
                                        <User className="h-5 w-5 text-amber-400" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400">Created By</h3>
                                    <p className="text-white">{projectData.user.name}</p>
                                    <p className="text-sm text-gray-400">{projectData.user.email}</p>
                                </div>
                            </div>)
                        }


                    </div>
                </div>

                {/* Project Actions */}
                <div className="p-6 bg-gray-800/50 border-t border-gray-700 flex justify-end space-x-3">
                    {/* <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                        Edit Project
                    </button> */}
                    <button
                        onClick={deleteProject}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg cursor-pointer text-white transition-colors">
                        Delete Project
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;