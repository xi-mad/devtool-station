import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { TOOLS } from './toolDefinitions';
import { Layout } from './components/ui/Layout';
import { ToolId } from './types';
import { useTranslation } from 'react-i18next';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [activeToolId, setActiveToolId] = useState<ToolId>(ToolId.QUICK_PREVIEW);

  const activeToolDef = TOOLS.find(t => t.id === activeToolId);

  const renderTool = () => {
    if (!activeToolDef) return null;
    const Component = activeToolDef.component;
    if (activeToolId === ToolId.QUICK_PREVIEW) {
      return <Component onSelectTool={setActiveToolId} />;
    }
    return <Component />;
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Navbar
        activeTool={activeToolId}
        onSelectTool={setActiveToolId}
      />

      <Layout
        title={activeToolId !== ToolId.QUICK_PREVIEW ? t(`tools.${activeToolId}.name`) : undefined}
        description={activeToolId !== ToolId.QUICK_PREVIEW ? t(`tools.${activeToolId}.description`) : undefined}
      >
        {renderTool()}
      </Layout>
    </div>
  );
};

export default App;
