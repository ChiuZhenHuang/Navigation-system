import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  // update
  // push,
  // child,
  get,
} from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

// 註冊
export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    // 可以同時將用戶資料存入 Realtime Database
    const newKey = user.uid; // 使用 Firebase Auth 的 uid 作為 key
    await set(ref(db, "users/" + newKey), {
      name: name,
      email: email,
      id: newKey,
    });
    return { success: true, user };
  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, error };
  }
};

// 登入
export const loginUser = async (email: string, password: string) => {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return { success: true, user };
  } catch (error: any) {
    console.error("Error logging in:", error);
    return { success: false, error };
  }
};

// 更新user資料
// export const updateUserData = async (userId: string) => {
//   try {
//     await update(ref(db, "users/" + userId), {
//       name: data.name,
//       email: data.email,
//       password: data.password,
//       id: userId,
//     });
//     return { data: { id: userId, success: true } };
//   } catch (error) {
//     console.error("Error updating user data:", error);
//     return { data: { success: false, error } };
//   }
// };

// 讀取所有user資料
export const getUsersData = async () => {
  try {
    const snapshot = await get(ref(db, "users"));
    const usersObject = snapshot.val() || {};
    const usersArray = Object.entries(usersObject).map(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        return { ...value, id: key };
      }
      throw new Error("Unexpected data format");
    });
    return { data: usersArray };
  } catch (error) {
    console.error("Error reading data:", error);
    throw error;
  }
};
