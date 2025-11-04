import { useState, useEffect } from 'react';
import { LogOut, ClipboardList, Users, Folder } from 'lucide-react';
import {
    PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getTasksAndUsers } from '../firebaseServices/tasks.firebase';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


import { logout } from "../store/reducers"

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        taskStatus: [],
        userProductivity: [],
        projectTimeline: []
    });


    const mockUsers = [
        { id: 1, name: 'Aarav Sharma', email: 'aarav@example.com' },
        { id: 2, name: 'Priya Patel', email: 'priya@example.com' },
        // ... more users
    ];

    const mockProjects = [
        { id: 1, name: 'E-commerce Platform', createdAt: '2025-01-01' },
        // ... more projects
    ];

    const mockTasks = [
        { id: 1, status: 'completed', userId: 1, projectId: 1, createdAt: '2025-01-15' },
        { id: 2, status: 'in-progress', userId: 2, projectId: 1, createdAt: '2025-02-01' },
        // ... more tasks
    ];


    const fetchData = async () => {
        try {

            const response = await getTasksAndUsers();
            if (!response.success) {
                setError(response.error);

            }


            // Transform data for charts
            const taskStatusData = transformTaskStatusData(response.data.tasks);
            const userProductivityData = transformUserProductivityData(response.data.tasks, response.data.users);

            // const projectTimelineData = transformProjectTimelineData(mockTasks, mockProjects);

            setDashboardData({
                taskStatus: taskStatusData,
                userProductivity: userProductivityData,
                // projectTimeline: projectTimelineData
            });
            setLoading(false);
        } catch (err) {
            setError('Failed to load dashboard data');
            setLoading(false);
        }
    };

    // Mock data simulation - replace with real API calls
    useEffect(() => {

        fetchData();
    }, []);

    // Data transformation functions
    const transformTaskStatusData = (tasks) => {
        const statusCounts = tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {});

        return [
            { name: 'Completed', value: statusCounts['completed'] || 0, color: '#10B981' },
            { name: 'In Progress', value: statusCounts['in-progress'] || 0, color: '#F59E0B' },
            { name: 'Pending', value: statusCounts['pending'] || 0, color: '#EF4444' }
        ];
    };

    const transformUserProductivityData = (tasks, users) => {
        return users.map(user => {
            const userTasks = tasks.filter(task => task.userId === user.id);
            return {
                name: user.name.split(' ')[0], // First name only
                tasksCompleted: userTasks.filter(t => t.status === 'completed').length,
                activeTasks: userTasks.filter(t => t.status !== 'completed').length
            };
        });
    };

    const transformProjectTimelineData = (tasks, projects) => {
        // Group by month
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        return months.map(month => ({
            month,
            tasks: tasks.filter(t => new Date(t.createdAt).toLocaleString('default', { month: 'short' }) === month).length,
            completed: tasks.filter(t =>
                t.status === 'completed' &&
                new Date(t.completedAt).toLocaleString('default', { month: 'short' }) === month
            ).length
        }));
    };

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogout = () => {
        dispatch(logout())
        navigate("/login")

    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
                <p>Loading dashboard data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-6">
                <div className="bg-red-900/30 border border-red-700 p-6 rounded-lg max-w-md text-center">
                    <p className="text-xl font-medium mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-md text-white"
                    >
                        Retry
                    </button>
                </div>
                <button
                    onClick={handleLogout}
                    className="mt-6 flex items-center text-gray-400 hover:text-white"
                >
                    <LogOut className="h-5 w-5 mr-2" /> Logout
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-6">
            {/* Header with Logout */}
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold">
                    Admin Dashboard
                </h1>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </header>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Task Status Pie Chart */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <div className="flex items-center mb-6">
                        <ClipboardList className="h-6 w-6 text-amber-400 mr-2" />
                        <h2 className="text-xl font-semibold">Task Status Distribution</h2>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dashboardData.taskStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {dashboardData.taskStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Legend />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1F2937',
                                        borderColor: '#374151',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* User Productivity Bar Chart */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <div className="flex items-center mb-6">
                        <Users className="h-6 w-6 text-amber-400 mr-2" />
                        <h2 className="text-xl font-semibold">User Productivity</h2>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dashboardData.userProductivity}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1F2937',
                                        borderColor: '#374151'
                                    }}
                                />
                                <Legend />
                                <Bar
                                    dataKey="tasksCompleted"
                                    name="Tasks Completed"
                                    fill="#D4AF37"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="activeTasks"
                                    name="Active Tasks"
                                    fill="#10B981"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Project Timeline - Full Width */}
            {/* <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center mb-6">
                    <Folder className="h-6 w-6 text-amber-400 mr-2" />
                    <h2 className="text-xl font-semibold">Project Timeline</h2>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dashboardData.projectTimeline}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    borderColor: '#374151'
                                }}
                            />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="tasks"
                                name="Total Tasks"
                                stroke="#D4AF37"
                                fill="#D4AF37"
                                fillOpacity={0.2}
                            />
                            <Area
                                type="monotone"
                                dataKey="completed"
                                name="Completed"
                                stroke="#10B981"
                                fill="#10B981"
                                fillOpacity={0.2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div> */}
        </div>
    );
};

export default Dashboard;