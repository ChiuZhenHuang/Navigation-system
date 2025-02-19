import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  // update
  // child,
  get,
  push,
} from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import type { Action } from "./types/recordType";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
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
    const newKey = user.uid;
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

    const firebaseUser = userCredential.user;

    const userSnapshot = await get(ref(db, "users/" + firebaseUser.uid));
    const userData = userSnapshot.val();

    if (userData) {
      return {
        success: true,
        user: firebaseUser,
        userName: userData.name || null,
      };
    } else {
      return { success: false, error: "User data not found" };
    }
  } catch (error: any) {
    console.error("Error logging in:", error);
    return { success: false, error };
  }
};
// 登入
// export const loginUser = async (email: string, password: string) => {
//   const auth = getAuth();
//   try {
//     const userCredential = await signInWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );
//     const firebaseUser = userCredential.user;

//     const userSnapshot = await get(ref(db, "users/" + firebaseUser.uid));
//     const userData = userSnapshot.val();

//     // 讀取紀錄資料
//     const userRecords = await getUserRecords(firebaseUser.uid);

//     if (userData) {
//       return {
//         success: true,
//         user: firebaseUser,
//         userName: userData.name || null,
//         userRecords: userRecords.success ? userRecords.records : [], // 返回紀錄資料
//       };
//     } else {
//       return { success: false, error: "User data not found" };
//     }
//   } catch (error: any) {
//     console.error("Error logging in:", error);
//     return { success: false, error };
//   }
// };

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
    const snapshot = await get(ref(db, "users")); // 查詢users節點
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

// -----------------新增
// 儲存使用者的操作紀錄

export const saveUserRecord = async (
  userId: string,
  action: Action,
  timestamp: number
) => {
  try {
    const userRecordsRef = ref(db, "users/" + userId + "/records");
    const newRecordRef = push(userRecordsRef); // 使用 push 創建一個新的資料紀錄
    const recordData = {
      action,
      timestamp,
    };
    await set(newRecordRef, recordData); // 儲存資料到 Firebase
    console.log("Record saved successfully!");
  } catch (error) {
    console.error("Error saving user record:", error);
  }
};

// 讀取使用者紀錄
// export const getUserRecords = async (userId: string) => {
//   try {
//     const snapshot = await get(ref(db, "users/" + userId + "/records"));
//     const records = snapshot.val();

//     if (records) {
//       const recordsArray = Object.entries(records).map(([key, value]) => {
//         // 加入類型檢查，確保 value 是 object 且不為 null
//         if (typeof value === "object" && value !== null) {
//           return { ...value, id: key };
//         } else {
//           throw new Error("Unexpected data format");
//         }
//       });
//       return { success: true, records: recordsArray };
//     } else {
//       return { success: false, message: "No records found" };
//     }
//   } catch (error) {
//     console.error("Error reading user records:", error);
//     return { success: false, error };
//   }
// };

export const getUserRecords = async (userId: string) => {
  try {
    // 讀取該使用者的完整資料（包含 userName, email, records）
    const snapshot = await get(ref(db, `users/${userId}`));
    const userData = snapshot.val();

    if (userData) {
      const { name, email, records } = userData;

      // 確保 records 存在並且是 object
      const recordsArray =
        records && typeof records === "object"
          ? Object.entries(records).map(([key, value]) => {
              if (typeof value === "object" && value !== null) {
                return { ...value, id: key };
              } else {
                throw new Error("Unexpected data format in records");
              }
            })
          : [];

      return {
        success: true,
        name,
        email,
        records: recordsArray,
      };
    } else {
      return { success: false, message: "User not found" };
    }
  } catch (error) {
    console.error("Error reading user records:", error);
    return { success: false, error };
  }
};
