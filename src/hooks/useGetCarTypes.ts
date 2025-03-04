import { useGetCarTypesQuery } from "@/services/firebaseApi";
import { useDispatch } from "react-redux";
import { setCarTypes } from "@/stores/carTypesSlice";
import { useEffect } from "react";

export const useGetCarTypes = () => {
  const dispatch = useDispatch();
  const { data: carTypes, isLoading, error } = useGetCarTypesQuery();

  useEffect(() => {
    if (carTypes) {
      dispatch(setCarTypes(carTypes));
    }
  }, [carTypes, dispatch]);

  return { carTypes, isLoading, error };
};
