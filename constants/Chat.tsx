export const CHAT_CONFIG = {
  // Number of messages to load per batch
  MESSAGES_PER_PAGE: 50,

  // Maximum number of messages to keep in memory (optional, for future use)
  MAX_MESSAGES_IN_MEMORY: 1000,

  // Real-time subscription settings
  REALTIME_EVENTS_PER_SECOND: 10,
} as const;

// Export individual constants for easier imports
export const { MESSAGES_PER_PAGE } = CHAT_CONFIG;
export const { MAX_MESSAGES_IN_MEMORY } = CHAT_CONFIG;
export const { REALTIME_EVENTS_PER_SECOND } = CHAT_CONFIG;
