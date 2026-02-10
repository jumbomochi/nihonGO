import { useState, useRef } from 'react';
import { useProgressStore } from '@/stores/progressStore';

export function useLessonCompletion(lessonId: string) {
  const { completeLesson, isLessonCompleted } = useProgressStore();
  const [isMarkedComplete, setIsMarkedComplete] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const wasAlreadyCompleted = isLessonCompleted(lessonId);

  const handleMarkComplete = () => {
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    completeLesson(lessonId, timeSpent);
    setIsMarkedComplete(true);
  };

  return {
    isMarkedComplete,
    wasAlreadyCompleted,
    handleMarkComplete,
  };
}
