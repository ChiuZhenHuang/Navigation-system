import { getUserRecords } from "@/firebaseConfig";
import { setUserEmail, setUserName } from "@/stores/userSlice";
import { setTotalRecord } from "@/stores/recordSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";

export const useGetUserRecord = () => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const fetchUserRecord = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await getUserRecords(id);

      if (res?.success) {
        console.log("res", res);
        dispatch(setUserEmail(res.email));
        dispatch(setUserName(res.name));
        dispatch(setTotalRecord(res.records));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return { fetchUserRecord, isLoading };
};
