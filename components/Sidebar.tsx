import React from 'react';
import { ToolId, ToolDefinition } from '../types';
import { 
  Braces, 
  GitCompare, 
  Binary, 
  Clock, 
  Palette, 
  Fingerprint,
  Link,
  Type, 
  Zap,
  Shield,
  Hash,
  Database,
  Languages,
  Maximize2
} from 'lucide-react';

// We keep the TOOLS array here for now as a central config, even if Sidebar component is deprecated/removed in usage.
export const TOOLS: ToolDefinition[] = [
  { id: ToolId.QUICK_PREVIEW, name: 'Quick Preview', description: 'Universal Converter', icon: Zap, category: 'General' },
  { id: ToolId.JSON_FORMATTER, name: 'JSON Formatter', description: 'Validate & Format JSON', icon: Braces, category: 'Formatter' },
  { id: ToolId.SQL_FORMATTER, name: 'SQL Formatter', description: 'Prettify SQL Queries', icon: Database, category: 'Formatter' },
  { id: ToolId.DIFF_VIEWER, name: 'Diff Viewer', description: 'Compare Text or JSON', icon: GitCompare, category: 'Formatter' },
  { id: ToolId.BASE64, name: 'Base64 Converter', description: 'Encode & Decode', icon: Binary, category: 'Converter' },
  { id: ToolId.URL_ENCODER, name: 'URL Encoder', description: 'Percent Encoding', icon: Link, category: 'Converter' },
  { id: ToolId.TIMESTAMP, name: 'Timestamp', description: 'Epoch & Date Parsing', icon: Clock, category: 'Converter' },
  { id: ToolId.NUMBER_BASE, name: 'Number Base', description: 'Hex, Bin, Oct, Dec', icon: Hash, category: 'Converter' },
  { id: ToolId.HASH_GENERATOR, name: 'Hash Generator', description: 'SHA-256, MD5, etc', icon: Shield, category: 'Generator' },
  { id: ToolId.TEXT_INSPECTOR, name: 'Text Inspector', description: 'Stats & Case Convert', icon: Type, category: 'Generator' },
  { id: ToolId.COLOR_PALETTE, name: 'Color Tools', description: 'Hex, RGB, Picker', icon: Palette, category: 'Generator' },
  { id: ToolId.UUID_GENERATOR, name: 'UUID Generator', description: 'Generate Unique IDs', icon: Fingerprint, category: 'Generator' },
  { id: ToolId.RANDOM_STRING, name: 'Random String', description: 'Passwords & Tokens', icon: Type, category: 'Generator' },
  { id: ToolId.UNICODE_CONVERTER, name: 'Unicode Converter', description: 'Text ↔ Unicode', icon: Languages, category: 'Converter' },
  { id: ToolId.FULLSCREEN_COLOR, name: 'Fullscreen Color', description: 'Display Color Fullscreen', icon: Maximize2, category: 'Generator' },
];

// Deprecated Component
export const Sidebar: React.FC<any> = () => null;