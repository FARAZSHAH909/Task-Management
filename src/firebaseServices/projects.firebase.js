import { ref, get, child, update, remove } from "firebase/database";
import { database } from "../config/firebaseconfig.js";

export const getAllProjects = async () => {
    try {
        const projectsRef = ref(database, "projects");
        const snapshot = await get(projectsRef);

        if (snapshot.exists()) {
            const rawData = snapshot.val();
            const allProjects = [];

            // Traverse each userId node
            Object.entries(rawData).forEach(([userId, userProjects]) => {
                Object.entries(userProjects).forEach(([projectId, project]) => {
                    allProjects.push({
                        id: projectId,
                        userId,
                        ...project,
                    });
                });
            });

            return { success: true, data: allProjects };
        } else {
            return { success: true, data: [] }; // No projects found
        }
    } catch (error) {
        console.error("Error fetching projects:", error);
        return { success: false, error: "Failed to fetch projects." };
    }
};


export const getProjectWithUserById = async (projectId) => {
    try {
        const projectsRef = ref(database, "projects");
        const snapshot = await get(projectsRef);

        if (!snapshot.exists()) {
            return { success: false, error: "No projects found." };
        }

        const rawData = snapshot.val();
        let matchedProject = null;
        let matchedUserId = null;

        // Search through all user IDs and their projects
        for (const [userId, projects] of Object.entries(rawData)) {
            for (const [projId, projectData] of Object.entries(projects)) {
                if (projId === projectId) {
                    matchedProject = { id: projId, userId, ...projectData };
                    matchedUserId = userId;
                    break;
                }
            }
            if (matchedProject) break;
        }

        if (!matchedProject) {
            return { success: false, error: "Project not found." };
        }

        // Fetch user data
        const userRef = ref(database, `users/${matchedUserId}`);
        const userSnap = await get(userRef);

        if (!userSnap.exists()) {
            return { success: false, error: "User not found for this project." };
        }

        const userData = userSnap.val();

        return {
            success: true,
            data: {
                project: matchedProject,
                user: { userId: matchedUserId, ...userData },
            },
        };
    } catch (error) {
        console.error("Error fetching project and user:", error);
        return { success: false, error: "Something went wrong." };
    }
};



export const deleteProjectById = async (projectId) => {
    try {
        const projectsRef = ref(database, "projects");
        const snapshot = await get(projectsRef);

        if (!snapshot.exists()) {
            return { success: false, message: "No projects found." };
        }

        const allProjects = snapshot.val();

        // Traverse all userIds to find the projectId
        for (const userId in allProjects) {
            const userProjects = allProjects[userId];

            if (userProjects && userProjects[projectId]) {
                const projectRef = ref(database, `projects/${userId}/${projectId}`);
                await remove(projectRef);
                return { success: true, message: `Project ${projectId} deleted.` };
            }
        }

        return { success: false, message: "Project ID not found." };
    } catch (error) {
        console.error("Error deleting project:", error);
        return { success: false, message: "Something went wrong." };
    }
};

