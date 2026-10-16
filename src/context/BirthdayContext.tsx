import React, { createContext, useContext, useState, useEffect } from 'react';
import { BirthdayConfig, DEFAULT_BIRTHDAY_DATA, loadBirthdayConfig, saveBirthdayConfig, resetBirthdayConfig } from '../data/birthdayConfig';

interface BirthdayContextType {
  config: BirthdayConfig;
  updateConfig: (newConfig: BirthdayConfig) => void;
  resetConfig: () => void;
  exportConfigJson: () => void;
  importConfigJson: (jsonString: string) => boolean;
}

const BirthdayContext = createContext<BirthdayContextType | undefined>(undefined);

export const BirthdayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<BirthdayConfig>(() => loadBirthdayConfig());

  useEffect(() => {
    const handleConfigUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<BirthdayConfig>;
      if (customEvent.detail) {
        setConfig(customEvent.detail);
      } else {
        setConfig(loadBirthdayConfig());
      }
    };

    window.addEventListener('birthday_config_updated', handleConfigUpdate);
    window.addEventListener('storage', handleConfigUpdate);
    return () => {
      window.removeEventListener('birthday_config_updated', handleConfigUpdate);
      window.removeEventListener('storage', handleConfigUpdate);
    };
  }, []);

  const updateConfig = (newConfig: BirthdayConfig) => {
    setConfig(newConfig);
    saveBirthdayConfig(newConfig);
  };

  const resetConfig = () => {
    const def = resetBirthdayConfig();
    setConfig(def);
  };

  const exportConfigJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vrushti-didu-birthday-config.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importConfigJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      const merged = { ...DEFAULT_BIRTHDAY_DATA, ...parsed };
      updateConfig(merged);
      return true;
    } catch (e) {
      console.error('Failed to import config:', e);
      return false;
    }
  };

  return (
    <BirthdayContext.Provider
      value={{
        config,
        updateConfig,
        resetConfig,
        exportConfigJson,
        importConfigJson
      }}
    >
      {children}
    </BirthdayContext.Provider>
  );
};

export const useBirthdayConfig = (): BirthdayContextType => {
  const context = useContext(BirthdayContext);
  if (!context) {
    // Graceful fallback if rendered outside provider
    return {
      config: loadBirthdayConfig(),
      updateConfig: saveBirthdayConfig,
      resetConfig: resetBirthdayConfig,
      exportConfigJson: () => {},
      importConfigJson: () => false
    };
  }
  return context;
};
