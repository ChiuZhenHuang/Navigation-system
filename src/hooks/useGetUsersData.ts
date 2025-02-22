import { getUsersData } from "@/firebaseConfig";

import { setUserTotalData } from "@/stores/userSlice";
import { useDispatch } from "react-redux";

export const useGetUsersData = () => {
  const dispatch = useDispatch();
  const fetchUsersData = async () => {
    const response = await getUsersData();

    if (response.data) {
      dispatch(setUserTotalData(response.data));
    }
  };

  return { fetchUsersData };
};
