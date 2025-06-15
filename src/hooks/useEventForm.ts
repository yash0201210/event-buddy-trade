
import { useState } from 'react';
import { EventFormData } from '@/types/event';
import { useEventFormState } from './useEventFormState';
import { useEventOperations } from './useEventOperations';

export const useEventForm = () => {
  const formState = useEventFormState();
  const operations = useEventOperations();

  return {
    ...formState,
    ...operations
  };
};
