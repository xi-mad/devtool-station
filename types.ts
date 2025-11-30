import React from 'react';

export enum ToolId {
  QUICK_PREVIEW = 'quick-preview',
  JSON_FORMATTER = 'json-formatter',
  DIFF_VIEWER = 'diff-viewer',
  BASE64 = 'base64',
  URL_ENCODER = 'url-encoder',
  TIMESTAMP = 'timestamp',
  TEXT_INSPECTOR = 'text-inspector',
  COLOR_PALETTE = 'color-palette',
  UUID_GENERATOR = 'uuid-generator',
  HASH_GENERATOR = 'hash-generator',
  NUMBER_BASE = 'number-base',
  SQL_FORMATTER = 'sql-formatter',
  RANDOM_STRING = 'random-string',
  UNICODE_CONVERTER = 'unicode-converter',
}

export interface ToolDefinition {
  id: ToolId;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  category: 'Converter' | 'Formatter' | 'Generator' | 'General';
}

export type DiffMode = 'chars' | 'words' | 'lines' | 'json';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}