import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { TOOLS } from './components/Sidebar'; // Importing definition
import { Layout } from './components/ui/Layout';
import { ToolId } from './types';

// Tools
import { QuickPreview } from './tools/QuickPreview';
import { JsonFormatter } from './tools/JsonFormatter';
import { DiffViewer } from './tools/DiffViewer';
import { Base64Tool } from './tools/Base64Tool';
import { UrlEncoder } from './tools/UrlEncoder';
import { TimestampTool } from './tools/TimestampTool';
import { TextInspector } from './tools/TextInspector';
import { ColorTool } from './tools/ColorTool';
import { UuidGenerator } from './tools/UuidGenerator';
import { HashGenerator } from './tools/HashGenerator';
import { NumberBase } from './tools/NumberBase';
import { SqlFormatter } from './tools/SqlFormatter';

const App: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<ToolId>(ToolId.QUICK_PREVIEW);

  const activeToolDef = TOOLS.find(t => t.id === activeToolId);

  const renderTool = () => {
    switch (activeToolId) {
      case ToolId.QUICK_PREVIEW: return <QuickPreview onSelectTool={setActiveToolId} />;
      case ToolId.JSON_FORMATTER: return <JsonFormatter />;
      case ToolId.DIFF_VIEWER: return <DiffViewer />;
      case ToolId.BASE64: return <Base64Tool />;
      case ToolId.URL_ENCODER: return <UrlEncoder />;
      case ToolId.TIMESTAMP: return <TimestampTool />;
      case ToolId.TEXT_INSPECTOR: return <TextInspector />;
      case ToolId.COLOR_PALETTE: return <ColorTool />;
      case ToolId.UUID_GENERATOR: return <UuidGenerator />;
      case ToolId.HASH_GENERATOR: return <HashGenerator />;
      case ToolId.NUMBER_BASE: return <NumberBase />;
      case ToolId.SQL_FORMATTER: return <SqlFormatter />;
      default: return <QuickPreview onSelectTool={setActiveToolId} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Navbar 
        activeTool={activeToolId} 
        onSelectTool={setActiveToolId} 
      />
      
      <Layout 
        title={activeToolId !== ToolId.QUICK_PREVIEW ? activeToolDef?.name : undefined}
        description={activeToolId !== ToolId.QUICK_PREVIEW ? activeToolDef?.description : undefined}
      >
        {renderTool()}
      </Layout>
    </div>
  );
};

export default App;