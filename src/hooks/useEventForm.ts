
import { EventFormData } from '@/types/event';
import { useEventFormState } from './useEventFormState';
import { useEventOperations } from './useEventOperations';

export const useEventForm = (venues: any[], onSuccess: () => void) => {
  const formState = useEventFormState();
  const operations = useEventOperations(venues, onSuccess);

  return {
    ...formState,
    ...operations
  };
};
