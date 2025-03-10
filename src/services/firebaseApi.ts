import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, update, get, push } from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserRecord, User } from "@/types/firebaseType";
import type { CarTypes } from "@/types/carTypes";

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

interface UserRecordsResponse {
  name: string;
  email: string;
  records: Array<UserRecord & { id: string }>;
}

export const firebaseApi = createApi({
  reducerPath: "firebaseApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["User", "CarType"],
  endpoints: (builder) => ({
    // 註冊用戶
    registerUser: builder.mutation({
      async queryFn({ name, email, password }) {
        try {
          const auth = getAuth();
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;
          const newKey = user.uid;

          await set(ref(db, "users/" + newKey), {
            name: name,
            email: email,
            id: newKey,
          });

          return {
            data: {
              success: true,
              uid: newKey,
              email: email,
              name: name,
            },
          };
        } catch (error: any) {
          return {
            error: {
              success: false,
              code: error.code,
              message: error.message,
            },
          };
        }
      },
    }),

    // 登入用戶
    loginUser: builder.mutation({
      async queryFn({ email, password }) {
        try {
          const auth = getAuth();
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const firebaseUser = userCredential.user;
          const userSnapshot = await get(ref(db, "users/" + firebaseUser.uid));
          const userData = userSnapshot.val();

          if (userData) {
            // 只返回可序列化的數據
            return {
              data: {
                success: true,
                uid: firebaseUser.uid,
                token: await firebaseUser.getIdToken(),
                userName: userData.name || null,
                email: userData.email,
              },
            };
          } else {
            return { error: { success: false, error: "User data not found" } };
          }
        } catch (error) {
          return { error: { success: false, error } };
        }
      },
    }),

    // 獲取所有用戶資料
    getUsersData: builder.query({
      async queryFn() {
        try {
          const snapshot = await get(ref(db, "users"));
          const usersObject = snapshot.val() || {};

          const usersArray = Object.entries(usersObject).map(([key, value]) => {
            if (typeof value === "object" && value !== null) {
              const userData = value as User;
              const records = userData.records
                ? Object.entries(userData.records).map(
                    ([recordKey, recordValue]) => ({
                      ...recordValue,
                      id: recordKey,
                    })
                  )
                : [];

              return {
                id: key,
                name: userData.name,
                email: userData.email,
                records: records,
              };
            }
            throw new Error("意外的資料格式");
          });

          return { data: usersArray };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["User"], // 監聽User標籤
    }),

    // 保存用戶記錄
    saveUserRecord: builder.mutation({
      async queryFn({ userId, action, timestamp }) {
        try {
          const userRecordsRef = ref(db, "users/" + userId + "/records");
          const newRecordRef = push(userRecordsRef);
          const recordData = { action, timestamp };
          await set(newRecordRef, recordData);
          return { data: { success: true } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["User"], // 清除User標籤緩存
    }),

    // 獲取用戶記錄
    getUserRecords: builder.query<
      UserRecordsResponse | null,
      string | undefined
    >({
      async queryFn(userId: string | undefined) {
        if (!userId) {
          return { data: null };
        }

        try {
          const snapshot = await get(ref(db, `users/${userId}`));
          const userData = snapshot.val();

          if (userData) {
            const { name, email, records } = userData;
            const recordsArray =
              records && typeof records === "object"
                ? Object.entries(records).map(([key, value]) => {
                    if (typeof value === "object" && value !== null) {
                      const record = value as UserRecord;
                      return {
                        ...record,
                        id: key,
                      };
                    }
                    throw new Error("Unexpected data format in records");
                  })
                : [];

            return {
              data: {
                name,
                email,
                records: recordsArray,
              },
            };
          }
          return { data: null };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["User"],
    }),

    // 添加車型
    addCarTypes: builder.mutation({
      async queryFn({ carType, oil }) {
        try {
          const cartTypeData = { carType, oil };
          const snapshot = await get(ref(db, "carTypes/" + carType));

          if (snapshot.exists()) {
            return {
              error: {
                success: false,
                message: "此車款已存在，請使用其他名稱",
              },
            };
          }

          await set(ref(db, "carTypes/" + carType), cartTypeData);
          return { data: { success: true, cartTypeData } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["CarType"],
    }),

    // 獲取所有車型
    getCarTypes: builder.query<CarTypes[], void>({
      async queryFn() {
        try {
          const snapshot = await get(ref(db, "carTypes"));
          if (snapshot.exists()) {
            const data = snapshot.val();
            const carTypesArray = Object.entries(data).map(
              ([key, value]: [string, any]) => ({
                value: key,
                carType: key,
                oil: value.oil,
              })
            );
            return { data: carTypesArray };
          }
          return { data: [] };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["CarType"],
    }),

    // 更新車型
    updateCarTypes: builder.mutation({
      async queryFn({ carType, oil }) {
        try {
          const updateData = { oil };
          await update(ref(db, "carTypes/" + carType), updateData);
          return { data: { success: true, updateData } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["CarType"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUsersDataQuery,
  useSaveUserRecordMutation,
  useGetUserRecordsQuery,
  useAddCarTypesMutation,
  useGetCarTypesQuery,
  useUpdateCarTypesMutation,
} = firebaseApi;
