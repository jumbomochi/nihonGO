import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View className="flex-1 bg-white dark:bg-gray-900 items-center justify-center px-6">
          <View className="items-center">
            <View className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full items-center justify-center mb-6">
              <FontAwesome name="exclamation-triangle" size={40} color="#ef4444" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
              Something went wrong
            </Text>
            <Text className="text-base text-gray-600 dark:text-gray-400 mb-6 text-center">
              The app encountered an unexpected error. Please try again.
            </Text>
            <Pressable
              onPress={this.handleReset}
              className="bg-sakura-500 px-8 py-4 rounded-xl active:bg-sakura-600"
            >
              <Text className="text-white font-semibold text-lg">
                Try Again
              </Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
