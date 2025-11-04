import { ref, get, remove } from "firebase/database";
import { database } from "../config/firebaseconfig.js";


export const fetchAllUsers = async () => {
    try {
        const dbRef = ref(database, "users");
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            const users = Object.entries(data).map(([id, user]) => ({
                id,
                ...user,
            }));

            return { success: true, data: users };
        } else {
            return { success: true, error: "No users found." };
        }
    } catch (error) {
        console.error("Error fetching users:");
        return { success: false, error: error.message };
    }
};


export const deleteUsersByEmail = async (emailToDelete) => {
    try {
        const usersRef = ref(database, "users");
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            const users = snapshot.val();
            let deletedCount = 0;

            // Iterate through all users and delete those with matching email
            for (const [userId, userData] of Object.entries(users)) {
                if (userData.email === emailToDelete) {
                    const userRef = ref(database, `users/${userId}`);
                    await remove(userRef);
                    deletedCount++;
                }
            }

            if (deletedCount > 0) {
                return { success: true, message: `${deletedCount} user(s) deleted.` };
            } else {
                return { success: false, message: "No user found with that email." };
            }
        } else {
            return { success: false, message: "Users node is empty." };
        }
    } catch (error) {
        console.error("Error deleting users:", error);
        return { success: false, message: "Something went wrong." };
    }
};

