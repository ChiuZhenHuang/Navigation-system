import { useGetUsersDataQuery } from "@/services/firebaseApi";
import { useAppDispatch } from "@/stores/reduxHook";
import { setUserTotalData } from "@/stores/userSlice";
import { useEffect } from "react";

export const useGetUsersData = (userId: string | undefined) => {
  const dispatch = useAppDispatch();

  const {
    data: usersData,
    isLoading,
    error,
  } = useGetUsersDataQuery(undefined, {
    skip: !userId,
  });

  useEffect(() => {
    if (usersData) {
      dispatch(setUserTotalData(usersData));
    }
  }, [usersData, dispatch]);

  return { usersData, isLoading, error };
};
