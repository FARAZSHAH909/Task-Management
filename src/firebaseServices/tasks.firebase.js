import { ref, get, child, update } from "firebase/database";
import { database } from "../config/firebaseconfig.js";

export const getAllTasks = async () => {
    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, 'tasks'));

        if (!snapshot.exists()) {
            return { success: false, error: "No tasks found." };
        }

        const tasksObj = snapshot.val();

        // Convert object to array
        const tasksArray = Object.entries(tasksObj).map(([id, task]) => ({
            id,
            ...task
        }));

        return { success: true, data: tasksArray };
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return { success: false, error: "Something went wrong." };
    }
};



export const getTasksAndUsers = async () => {
    try {
        const dbRef = ref(database);

        // Fetch tasks
        const tasksSnap = await get(child(dbRef, 'tasks'));
        const tasksObj = tasksSnap.exists() ? tasksSnap.val() : {};

        // Convert tasks object to array
        const tasks = Object.entries(tasksObj).map(([id, task]) => ({
            id,
            ...task
        }));

        // Fetch users
        const usersSnap = await get(child(dbRef, 'users'));
        const usersObj = usersSnap.exists() ? usersSnap.val() : {};

        // Convert users object to array
        const users = Object.entries(usersObj).map(([id, user]) => ({
            id,
            ...user
        }));

        return { success: true, data: { tasks, users } };

    } catch (error) {
        console.error("Error fetching tasks and users:", error);
        return { success: false, error: "Something went wrong." };
    }
};


export const getTaskWithUserById = async (taskId) => {
    try {
        // Fetch the task
        const taskRef = ref(database, `tasks/${taskId}`);
        const taskSnapshot = await get(taskRef);

        if (!taskSnapshot.exists()) {
            return { success: false, message: "Task not found." };
        }

        const taskData = taskSnapshot.val();
        const task = { id: taskId, ...taskData };

        // Fetch the corresponding user
        const userRef = ref(database, `users/${task.userId}`);
        const userSnapshot = await get(userRef);

        let user = null;
        if (userSnapshot.exists()) {
            user = { id: task.userId, ...userSnapshot.val() };
        }

        return {
            success: true,
            data: {
                task,
                user,
            },
        };
    } catch (error) {
        console.error("Error fetching task with user:", error);
        return { success: false, message: "Something went wrong." };
    }
};

export const markTaskAsCompleted = async (taskId) => {
    try {
        const taskRef = ref(database, `tasks/${taskId}`);

        await update(taskRef, { status: "completed" });

        return { success: true, message: "Task marked as completed." };
    } catch (error) {
        console.error("Error updating task status:", error);
        return { success: false, message: "Failed to update task status." };
    }
};