import { useState, useEffect, useRef } from 'react';
import { getTaskStatus } from '../api/lectures';
import type { AITaskResponse } from '../types';

export const useTaskPoller = (taskId: string | undefined) => {
  const [task, setTask] = useState<AITaskResponse | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!taskId) return;

    const poll = async () => {
      try {
        const res = await getTaskStatus(taskId);
        setTask(res.data);
        if (res.data.status === 'completed' || res.data.status === 'failed') {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [taskId]);

  return task;
};
