import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSettingsStore } from '@/stores/settingsStore';
import { AIProvider, getProviderName } from '@/lib/aiProvider';
import {
  checkOllamaStatus,
  RECOMMENDED_MODELS,
  DEFAULT_OLLAMA_URL,
} from '@/lib/ollama';
import * as AppleIntelligence from '@/modules/apple-intelligence/src';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

export function AISettingsSection() {
  const {
    aiProvider,
    apiKey,
    isEnvKey,
    ollamaUrl,
    ollamaModel,
    setAIProvider,
    setOllamaUrl,
    setOllamaModel,
    loadAISettings,
  } = useSettingsStore();

  const [ollamaStatus, setOllamaStatus] = useState<{
    running: boolean;
    models: string[];
    checking: boolean;
  }>({ running: false, models: [], checking: true });

  const [appleStatus, setAppleStatus] = useState<{
    status: string;
    message: string;
    checking: boolean;
  }>({ status: 'unknown', message: '', checking: true });

  const [showOllamaConfig, setShowOllamaConfig] = useState(false);
  const [tempUrl, setTempUrl] = useState(ollamaUrl);

  // Load AI settings on mount
  useEffect(() => {
    loadAISettings();
  }, []);

  // Check Apple Intelligence availability
  const checkAppleStatus = useCallback(async () => {
    setAppleStatus((s) => ({ ...s, checking: true }));
    const status = await AppleIntelligence.getAvailabilityStatus();
    const message = AppleIntelligence.getStatusMessage(status);
    setAppleStatus({ status, message, checking: false });
  }, []);

  useEffect(() => {
    if (aiProvider === 'apple') {
      checkAppleStatus();
    }
  }, [aiProvider, checkAppleStatus]);

  // Check Ollama status when provider changes or URL changes
  const checkStatus = useCallback(async () => {
    setOllamaStatus((s) => ({ ...s, checking: true }));
    const status = await checkOllamaStatus(ollamaUrl);
    setOllamaStatus({ ...status, checking: false });
  }, [ollamaUrl]);

  useEffect(() => {
    if (aiProvider === 'ollama') {
      checkStatus();
    }
  }, [aiProvider, ollamaUrl, checkStatus]);

  const handleProviderChange = async (provider: AIProvider) => {
    await setAIProvider(provider);
    if (provider === 'ollama') {
      checkStatus();
    } else if (provider === 'apple') {
      checkAppleStatus();
    }
  };

  const handleSaveUrl = async () => {
    await setOllamaUrl(tempUrl);
    setShowOllamaConfig(false);
    checkStatus();
  };

  const handleModelSelect = async (modelId: string) => {
    await setOllamaModel(modelId);
  };

  return (
    <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 mb-6">
      <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        AI Provider
      </Text>

      {/* Provider Selection */}
      <View className="flex-row gap-3 mb-4">
        {Platform.OS === 'ios' && (
          <ProviderButton
            provider="apple"
            currentProvider={aiProvider}
            label="Apple"
            icon="apple"
            onPress={() => handleProviderChange('apple')}
          />
        )}
        <ProviderButton
          provider="claude"
          currentProvider={aiProvider}
          label="Claude"
          icon="cloud"
          onPress={() => handleProviderChange('claude')}
        />
        <ProviderButton
          provider="ollama"
          currentProvider={aiProvider}
          label="Ollama"
          icon="server"
          onPress={() => handleProviderChange('ollama')}
        />
      </View>

      {/* Apple Intelligence Configuration */}
      {aiProvider === 'apple' && (
        <View className="mt-2">
          <View className="flex-row items-center mb-3">
            {appleStatus.checking ? (
              <ActivityIndicator size="small" color="#ec4899" />
            ) : (
              <FontAwesome
                name={appleStatus.status === 'available' ? 'check-circle' : 'info-circle'}
                size={16}
                color={appleStatus.status === 'available' ? '#22c55e' : '#f59e0b'}
              />
            )}
            <Text className="text-gray-600 dark:text-gray-400 ml-2 text-sm flex-1">
              {appleStatus.checking ? 'Checking availability...' : appleStatus.message}
            </Text>
            <Pressable
              onPress={checkAppleStatus}
              className="p-2"
              disabled={appleStatus.checking}
            >
              <FontAwesome name="refresh" size={14} color="#9ca3af" />
            </Pressable>
          </View>
          <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <Text className="text-xs text-blue-600 dark:text-blue-400">
              Runs entirely on-device using Apple Intelligence. No API key or internet required. Requires iPhone 16+, iPad M1+, or Mac M1+ with iOS 26+.
            </Text>
          </View>
        </View>
      )}

      {/* Claude Configuration */}
      {aiProvider === 'claude' && (
        <View className="mt-2">
          <View className="flex-row items-center">
            <FontAwesome
              name={apiKey ? 'check-circle' : 'times-circle'}
              size={16}
              color={apiKey ? '#22c55e' : '#ef4444'}
            />
            <Text className="text-gray-600 dark:text-gray-400 ml-2 text-sm">
              {apiKey
                ? isEnvKey
                  ? 'API key configured (from .env)'
                  : 'API key configured'
                : 'API key required - add to .env or onboarding'}
            </Text>
          </View>
        </View>
      )}

      {/* Ollama Configuration */}
      {aiProvider === 'ollama' && (
        <View className="mt-2">
          {/* Status */}
          <View className="flex-row items-center mb-3">
            {ollamaStatus.checking ? (
              <ActivityIndicator size="small" color="#ec4899" />
            ) : (
              <FontAwesome
                name={ollamaStatus.running ? 'check-circle' : 'times-circle'}
                size={16}
                color={ollamaStatus.running ? '#22c55e' : '#ef4444'}
              />
            )}
            <Text className="text-gray-600 dark:text-gray-400 ml-2 text-sm">
              {ollamaStatus.checking
                ? 'Checking Ollama...'
                : ollamaStatus.running
                ? `Connected (${ollamaStatus.models.length} models)`
                : 'Ollama not running'}
            </Text>
            <Pressable
              onPress={checkStatus}
              className="ml-auto p-2"
              disabled={ollamaStatus.checking}
            >
              <FontAwesome name="refresh" size={14} color="#9ca3af" />
            </Pressable>
          </View>

          {/* URL Configuration */}
          {showOllamaConfig ? (
            <View className="bg-white dark:bg-gray-700 rounded-xl p-4 mb-3">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ollama URL
              </Text>
              <Input
                value={tempUrl}
                onChangeText={setTempUrl}
                placeholder={DEFAULT_OLLAMA_URL}
                autoCapitalize="none"
              />
              <View className="flex-row gap-2 mt-3">
                <View className="flex-1">
                  <Button
                    title="Cancel"
                    variant="outline"
                    onPress={() => {
                      setTempUrl(ollamaUrl);
                      setShowOllamaConfig(false);
                    }}
                  />
                </View>
                <View className="flex-1">
                  <Button
                    title="Save"
                    onPress={handleSaveUrl}
                  />
                </View>
              </View>
            </View>
          ) : (
            <Pressable
              onPress={() => setShowOllamaConfig(true)}
              className="flex-row items-center py-2 mb-3"
            >
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                URL: {ollamaUrl}
              </Text>
              <FontAwesome name="pencil" size={12} color="#9ca3af" className="ml-2" />
            </Pressable>
          )}

          {/* Model Selection */}
          {ollamaStatus.running && (
            <View>
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Model
              </Text>
              <View className="gap-2">
                {RECOMMENDED_MODELS.map((model) => {
                  const isInstalled = ollamaStatus.models.some(
                    (m) => m.startsWith(model.id.split(':')[0])
                  );
                  const isSelected = ollamaModel === model.id;

                  return (
                    <Pressable
                      key={model.id}
                      onPress={() => handleModelSelect(model.id)}
                      className={`flex-row items-center p-3 rounded-xl border ${
                        isSelected
                          ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20'
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <View className="flex-1">
                        <View className="flex-row items-center">
                          <Text
                            className={`font-medium ${
                              isSelected
                                ? 'text-sakura-600'
                                : 'text-gray-900 dark:text-white'
                            }`}
                          >
                            {model.name}
                          </Text>
                          {isInstalled && (
                            <View className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded">
                              <Text className="text-xs text-green-700 dark:text-green-400">
                                Installed
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {model.size} • Japanese: {model.japanese}
                        </Text>
                      </View>
                      {isSelected && (
                        <FontAwesome name="check" size={16} color="#ec4899" />
                      )}
                    </Pressable>
                  );
                })}
              </View>
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Run <Text className="font-mono">ollama pull {ollamaModel}</Text> to install
              </Text>
            </View>
          )}

          {/* Not Running Help */}
          {!ollamaStatus.running && !ollamaStatus.checking && (
            <View className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
              <Text className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-2">
                Ollama Not Running
              </Text>
              <Text className="text-xs text-amber-600 dark:text-amber-500">
                1. Install Ollama from ollama.ai{'\n'}
                2. Run: <Text className="font-mono">ollama serve</Text>{'\n'}
                3. Pull a model: <Text className="font-mono">ollama pull qwen2.5:3b</Text>
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

function ProviderButton({
  provider,
  currentProvider,
  label,
  icon,
  onPress,
}: {
  provider: AIProvider;
  currentProvider: AIProvider;
  label: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  onPress: () => void;
}) {
  const isSelected = provider === currentProvider;

  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${
        isSelected
          ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20'
          : 'border-gray-200 dark:border-gray-600'
      }`}
    >
      <FontAwesome
        name={icon}
        size={16}
        color={isSelected ? '#ec4899' : '#9ca3af'}
      />
      <Text
        className={`ml-2 font-medium ${
          isSelected ? 'text-sakura-600' : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
