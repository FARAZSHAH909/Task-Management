import { ref, get, child } from "firebase/database";
import { database } from "../config/firebaseconfig.js"; // import configured database instance

export const verifyAdminLogin = async (email, password) => {
    console.log('sdf')
    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `admin`));

        if (snapshot.exists()) {
            const data = snapshot.val();
            if (data.email === email && data.password === password) {
                return { success: true, message: "You have been logged in successFully" }
            }
        } else {
            return { success: false, message: "Credentials not matched" }
        }
    } catch (error) {
        console.error("Error verifying login:", error);
        return { success: false, message: "Something went wrong" }
    }
};
