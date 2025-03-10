import { useGetUserRecordsQuery } from "@/services/firebaseApi";
import { useAppDispatch } from "@/stores/reduxHook";
import { setUserEmail, setUserName, setFirstName } from "@/stores/userSlice";
import { setTotalRecord } from "@/stores/recordSlice";
import { useEffect } from "react";

export const useGetUserRecord = (userId: string | undefined) => {
  const dispatch = useAppDispatch();

  const {
    data: userRecords,
    isLoading,
    error,
  } = useGetUserRecordsQuery(userId, {
    skip: !userId,
  });

  useEffect(() => {
    if (userRecords) {
      const firstName = userRecords.name
        ? String(userRecords.name).split("")[0]
        : "";

      dispatch(setUserEmail(userRecords.email));
      dispatch(setUserName(userRecords.name));
      dispatch(setFirstName(firstName));
      dispatch(setTotalRecord(userRecords.records));
    }
  }, [userRecords, dispatch]);

  return { userRecords, isLoading, error };
};
