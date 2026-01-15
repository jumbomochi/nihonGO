// Custom error classes for better error handling and user feedback

export class AppError extends Error {
  constructor(
    message: string,
    public readonly userMessage: string,
    public readonly recoverable: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(
      message,
      'Invalid API key. Please check your API key in Settings.',
      true
    );
    this.name = 'AuthError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(
      message,
      'Too many requests. Please wait a moment and try again.',
      true
    );
    this.name = 'RateLimitError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed') {
    super(
      message,
      'Unable to connect. Please check your internet connection.',
      true
    );
    this.name = 'NetworkError';
  }
}

export class ApiError extends AppError {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(
      message,
      `Something went wrong. Please try again.`,
      true
    );
    this.name = 'ApiError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, userMessage?: string) {
    super(message, userMessage || message, true);
    this.name = 'ValidationError';
  }
}

// Helper to extract user-friendly message from any error
export function getUserErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.userMessage;
  }
  if (error instanceof Error) {
    // Sanitize error message - don't expose API keys or internal details
    const message = error.message.toLowerCase();
    if (message.includes('api') || message.includes('key')) {
      return 'Authentication error. Please check your API key.';
    }
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network error. Please check your connection.';
    }
    return 'Something went wrong. Please try again.';
  }
  return 'An unexpected error occurred.';
}

// Helper to check if error is recoverable
export function isRecoverableError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.recoverable;
  }
  return true;
}

// Helper to check if error is a network error
export function isNetworkError(error: unknown): boolean {
  if (error instanceof NetworkError) {
    return true;
  }
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('connection') ||
      message.includes('offline') ||
      message.includes('timeout')
    );
  }
  return false;
}

// Helper to get retry suggestion based on error type
export function getRetryMessage(error: unknown): string | null {
  if (error instanceof RateLimitError) {
    return 'Wait a few seconds and try again.';
  }
  if (isNetworkError(error)) {
    return 'Check your internet connection and try again.';
  }
  if (error instanceof AuthError) {
    return 'Update your API key in Settings.';
  }
  return null;
}
