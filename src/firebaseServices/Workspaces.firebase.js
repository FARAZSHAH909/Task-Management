import { ref, get, query, orderByChild, equalTo, remove } from "firebase/database";
import { database } from "../config/firebaseconfig.js";

export const getAllWorkspaces = async () => {
    try {
        const workspacesRef = ref(database, 'workspaces');
        const snapshot = await get(workspacesRef);

        if (!snapshot.exists()) {
            return { success: true, data: [] };
        }

        const data = snapshot.val();

        const workspacesArray = Object.entries(data).map(([id, workspace]) => ({
            id,
            ...workspace,
        }));

        return { success: true, data: workspacesArray };
    } catch (error) {
        console.error("Error fetching workspaces:", error);
        return { success: false, error: error.message };
    }
};



export const getWorkspaceWithTasks = async (workspaceId) => {
    try {
        // 1. Get workspace details
        const workspaceRef = ref(database, `workspaces/${workspaceId}`);
        const workspaceSnap = await get(workspaceRef);

        if (!workspaceSnap.exists()) {
            return { success: false, error: "Workspace not found" };
        }
        const workspaceData = { id: workspaceId, ...workspaceSnap.val() };

        // 2. Query workspaceTasks where workspaceId equals given workspaceId
        const tasksRef = ref(database, 'workSpaceTasks');
        const tasksQuery = query(tasksRef, orderByChild('workspaceId'), equalTo(workspaceId));
        const tasksSnap = await get(tasksQuery);

        const tasks = [];
        if (tasksSnap.exists()) {
            const tasksData = tasksSnap.val();
            // Convert tasks object to array and add task id
            for (const [taskId, task] of Object.entries(tasksData)) {
                tasks.push({ id: taskId, ...task });
            }
        }

        return {
            success: true,
            data: {
                workspace: workspaceData,
                tasks: tasks
            }
        };

    } catch (error) {
        console.error("Error fetching workspace and tasks:", error);
        return { success: false, error: error.message };
    }
};


export const deleteWorkspaceById = async (workspaceId) => {

    const workspaceRef = ref(database, `workspaces/${workspaceId}`);

    try {
        await remove(workspaceRef);
        console.log(`Workspace ${workspaceId} deleted successfully.`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting workspace:", error);
        return { success: false, message: error.message };
    }
};
