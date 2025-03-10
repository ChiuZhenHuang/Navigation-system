import { useGetCarTypesQuery } from "@/services/firebaseApi";
import { setCarTypes } from "@/stores/carTypesSlice";
import { useEffect } from "react";
import { useAppDispatch } from "@/stores/reduxHook";

export const useGetCarTypes = () => {
  const dispatch = useAppDispatch();
  const { data: carTypes, isLoading, error } = useGetCarTypesQuery();

  useEffect(() => {
    if (carTypes) {
      dispatch(setCarTypes(carTypes));
    }
  }, [carTypes, dispatch]);

  return { carTypes, isLoading, error };
};
