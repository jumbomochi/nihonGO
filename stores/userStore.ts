import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type LearningStyle = 'detailed' | 'conversational';
export type ProficiencyLevel = 'complete_beginner' | 'beginner' | 'elementary' | 'intermediate';

interface UserProfile {
  nativeLanguage: string;
  priorLanguages: string[];
  knowsChinese: boolean;
  proficiencyLevel: ProficiencyLevel;
  learningGoals: string[];
  learningStyle: LearningStyle;
  onboardingComplete: boolean;
}

interface UserState {
  profile: UserProfile;
  setProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
  resetProfile: () => void;
}

const defaultProfile: UserProfile = {
  nativeLanguage: '',
  priorLanguages: [],
  knowsChinese: false,
  proficiencyLevel: 'complete_beginner',
  learningGoals: [],
  learningStyle: 'detailed',
  onboardingComplete: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      setProfile: (newProfile) =>
        set((state) => ({
          profile: { ...state.profile, ...newProfile },
        })),
      completeOnboarding: () =>
        set((state) => ({
          profile: { ...state.profile, onboardingComplete: true },
        })),
      resetProfile: () => set({ profile: defaultProfile }),
    }),
    {
      name: 'nihongo-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
