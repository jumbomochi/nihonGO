import { useLocalSearchParams } from 'expo-router';
import { JLPTLevel } from '@/data/jlpt/types';
import { JLPTUnitScreen } from '@/components/jlpt/JLPTUnitScreen';

export default function JLPTUnitRoute() {
  const { level, unitId } = useLocalSearchParams<{ level: string; unitId: string }>();
  const jlptLevel = level?.toUpperCase() as JLPTLevel;

  return <JLPTUnitScreen jlptLevel={jlptLevel} unitId={unitId!} />;
}
