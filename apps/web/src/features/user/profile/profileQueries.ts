import { useQuery } from '@tanstack/react-query';
import { getProfileById } from './profileFetchers';

export const useGetProfileById = (token: string) => {
  return useQuery({
    queryKey: ['profile', token],
    queryFn: () => getProfileById(token!),
    enabled: !!token,
  });
};
