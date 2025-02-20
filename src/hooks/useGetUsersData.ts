import { getUsersData } from "@/firebaseConfig";

export const useGetUsersData = () => {
  const fetchUsersData = async () => {
    const response = await getUsersData();

    console.log("所有資料", response);
  };

  return { fetchUsersData };
};
