import useSWR from "swr";
import { fetcher } from "../util/fetcher";

export const useMemories = (martian: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/memory?martian=${martian}`,
    fetcher
  );
  return {
    memories: data?.memories,
    isLoading,
    error: data?.error,
    mutate,
  };
};
