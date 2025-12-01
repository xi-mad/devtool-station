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
  Maximize2,
  QrCode
} from 'lucide-react';

// We keep the TOOLS array here for now as a central config, even if Sidebar component is deprecated/removed in usage.
export const TOOLS: ToolDefinition[] = [
  { id: ToolId.QUICK_PREVIEW, name: 'Quick Preview', description: 'Auto-detect & Convert', icon: Zap, category: 'Converter' },
  { id: ToolId.JSON_FORMATTER, name: 'JSON Formatter', description: 'Validate & Format JSON', icon: Braces, category: 'Formatter' },
  { id: ToolId.SQL_FORMATTER, name: 'SQL Formatter', description: 'Format SQL Queries', icon: Database, category: 'Formatter' },
  { id: ToolId.TIMESTAMP, name: 'Timestamp', description: 'Unix & ISO Dates', icon: Clock, category: 'Converter' },
  { id: ToolId.COLOR_PALETTE, name: 'Color Palette', description: 'Picker & Generator', icon: Palette, category: 'Generator' },
  { id: ToolId.BASE64, name: 'Base64 Converter', description: 'Encode & Decode', icon: Binary, category: 'Converter' },
  { id: ToolId.HASH_GENERATOR, name: 'Hash Generator', description: 'MD5, SHA-256, etc.', icon: Shield, category: 'Generator' },
  { id: ToolId.URL_ENCODER, name: 'URL Encoder', description: 'Encode & Decode URLs', icon: Link, category: 'Converter' },
  { id: ToolId.NUMBER_BASE, name: 'Number Base', description: 'Hex, Bin, Oct, Dec', icon: Hash, category: 'Converter' },
  { id: ToolId.DIFF_VIEWER, name: 'Diff Viewer', description: 'Compare Text', icon: GitCompare, category: 'Formatter' },
  { id: ToolId.TEXT_INSPECTOR, name: 'Text Inspector', description: 'Case & Statistics', icon: Type, category: 'Formatter' },
  { id: ToolId.UUID_GENERATOR, name: 'UUID Generator', description: 'Generate Unique IDs', icon: Fingerprint, category: 'Generator' },
  { id: ToolId.RANDOM_STRING, name: 'Random String', description: 'Passwords & Tokens', icon: Type, category: 'Generator' },
  { id: ToolId.UNICODE_CONVERTER, name: 'Unicode Converter', description: 'Text ↔ Unicode', icon: Languages, category: 'Converter' },
  { id: ToolId.JWT_DECODER, name: 'JWT Decoder', description: 'Decode & Encode JWT', icon: Fingerprint, category: 'Converter' },
  { id: ToolId.QR_CODE_GENERATOR, name: 'QR Code', description: 'Generate QR Codes', icon: QrCode, category: 'Generator' },
  { id: ToolId.FULLSCREEN_COLOR, name: 'Fullscreen Color', description: 'Display Color Fullscreen', icon: Maximize2, category: 'Generator' },
];

// Deprecated Component
export const Sidebar: React.FC<any> = () => null;