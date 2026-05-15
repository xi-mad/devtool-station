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
import { QuickPreview } from '../tools/QuickPreview';
import { JsonFormatter } from '../tools/JsonFormatter';
import { SqlFormatter } from '../tools/SqlFormatter';
import { TimestampTool } from '../tools/TimestampTool';
import { ColorTool } from '../tools/ColorTool';
import { Base64Tool } from '../tools/Base64Tool';
import { HashGenerator } from '../tools/HashGenerator';
import { UrlEncoder } from '../tools/UrlEncoder';
import { NumberBase } from '../tools/NumberBase';
import { DiffViewer } from '../tools/DiffViewer';
import { TextInspector } from '../tools/TextInspector';
import { UuidGenerator } from '../tools/UuidGenerator';
import { RandomStringGenerator } from '../tools/RandomStringGenerator';
import { UnicodeConverter } from '../tools/UnicodeConverter';
import { JwtDecoder } from '../tools/JwtDecoder';
import { QrCodeGenerator } from '../tools/QrCodeGenerator';
import { FullscreenColor } from '../tools/FullscreenColor';

// Central registry of all tools — single source of truth for tool metadata + component
export const TOOLS: ToolDefinition[] = [
  { id: ToolId.QUICK_PREVIEW, name: 'Quick Preview', description: 'Auto-detect & Convert', icon: Zap, component: QuickPreview, category: 'Converter' },
  { id: ToolId.JSON_FORMATTER, name: 'JSON Formatter', description: 'Validate & Format JSON', icon: Braces, component: JsonFormatter, category: 'Formatter' },
  { id: ToolId.SQL_FORMATTER, name: 'SQL Formatter', description: 'Format SQL Queries', icon: Database, component: SqlFormatter, category: 'Formatter' },
  { id: ToolId.TIMESTAMP, name: 'Timestamp', description: 'Unix & ISO Dates', icon: Clock, component: TimestampTool, category: 'Converter' },
  { id: ToolId.COLOR_PALETTE, name: 'Color Palette', description: 'Picker & Generator', icon: Palette, component: ColorTool, category: 'Generator' },
  { id: ToolId.BASE64, name: 'Base64 Converter', description: 'Encode & Decode', icon: Binary, component: Base64Tool, category: 'Converter' },
  { id: ToolId.HASH_GENERATOR, name: 'Hash Generator', description: 'MD5, SHA-256, etc.', icon: Shield, component: HashGenerator, category: 'Generator' },
  { id: ToolId.URL_ENCODER, name: 'URL Encoder', description: 'Encode & Decode URLs', icon: Link, component: UrlEncoder, category: 'Converter' },
  { id: ToolId.NUMBER_BASE, name: 'Number Base', description: 'Hex, Bin, Oct, Dec', icon: Hash, component: NumberBase, category: 'Converter' },
  { id: ToolId.DIFF_VIEWER, name: 'Diff Viewer', description: 'Compare Text', icon: GitCompare, component: DiffViewer, category: 'Formatter' },
  { id: ToolId.TEXT_INSPECTOR, name: 'Text Inspector', description: 'Case & Statistics', icon: Type, component: TextInspector, category: 'Formatter' },
  { id: ToolId.UUID_GENERATOR, name: 'UUID Generator', description: 'Generate Unique IDs', icon: Fingerprint, component: UuidGenerator, category: 'Generator' },
  { id: ToolId.RANDOM_STRING, name: 'Random String', description: 'Passwords & Tokens', icon: Type, component: RandomStringGenerator, category: 'Generator' },
  { id: ToolId.UNICODE_CONVERTER, name: 'Unicode Converter', description: 'Text ↔ Unicode', icon: Languages, component: UnicodeConverter, category: 'Converter' },
  { id: ToolId.JWT_DECODER, name: 'JWT Decoder', description: 'Decode & Encode JWT', icon: Fingerprint, component: JwtDecoder, category: 'Converter' },
  { id: ToolId.QR_CODE_GENERATOR, name: 'QR Code', description: 'Generate QR Codes', icon: QrCode, component: QrCodeGenerator, category: 'Generator' },
  { id: ToolId.FULLSCREEN_COLOR, name: 'Fullscreen Color', description: 'Display Color Fullscreen', icon: Maximize2, component: FullscreenColor, category: 'Generator' },
];

// Deprecated Component
export const Sidebar: React.FC<any> = () => null;
