import { useGetUsersDataQuery } from "@/services/firebaseApi";
import { useDispatch } from "react-redux";
import { setUserTotalData } from "@/stores/userSlice";
import { useEffect } from "react";

export const useGetUsersData = (userId: string | undefined) => {
  const dispatch = useDispatch();
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
