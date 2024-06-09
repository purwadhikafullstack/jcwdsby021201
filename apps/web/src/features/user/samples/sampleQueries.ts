import { useQuery } from '@tanstack/react-query';
import { getSamples } from './sampleFetchers';

export const useGetSamples = () => {
  return useQuery({
    queryKey: ['samples'],
    queryFn: () => getSamples(),
  });
};
