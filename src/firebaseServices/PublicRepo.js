import { ref, get, remove } from "firebase/database";
import { database } from "../config/firebaseconfig.js";


export const getAllPublicRep = async () => {
    try {
        const publicRepRef = ref(database, "publicrep");
        const snapshot = await get(publicRepRef);

        if (snapshot.exists()) {
            const data = snapshot.val();

            // Convert object to array
            const publicReps = Object.entries(data).map(([id, rep]) => ({
                id,
                ...rep,
            }));

            return { success: true, data: publicReps };
        } else {
            return { success: false, error: "No public reports found." };
        }
    } catch (error) {
        console.error("Error fetching public reports:", error);
        return { success: false, error: error.message };
    }
};


export const getPublicRepById = async (id) => {
    try {
        const repRef = ref(database, `publicrep/${id}`);
        const snapshot = await get(repRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            return { success: true, data: { id, ...data } };
        } else {
            return { success: false, error: "No public report found with this ID." };
        }
    } catch (error) {
        console.error("Error fetching public report:", error);
        return { success: false, error: "Something went wrong." };
    }
};

export const deleteCommentFromPublicRep = async (projectId, commentId) => {
    try {
        const commentRef = ref(database, `publicrep/${projectId}/comments/${commentId}`);
        await remove(commentRef);
        return { success: true, message: "Comment deleted successfully." };
    } catch (error) {
        console.error("Error deleting comment:", error);
        return { success: false, error: "Failed to delete comment." };
    }
};

export const deletePublicRepById = async (id) => {
    try {
        const repRef = ref(database, `publicrep/${id}`);
        await remove(repRef);
        return { success: true, message: "Public report deleted successfully." };
    } catch (error) {
        console.error("Error deleting public report:", error);
        return { success: false, error: "Failed to delete public report." };
    }
};