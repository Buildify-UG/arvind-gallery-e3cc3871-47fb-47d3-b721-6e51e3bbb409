import React, { useState } from 'react';
import { Settings, Moon, Sun, Monitor, Grid3x3, Calendar, Type, HardDrive } from 'lucide-react';

interface SettingsScreenProps {
  theme: 'light' | 'dark' | 'auto';
  onThemeChange: (theme: 'light' | 'dark' | 'auto') => void;
  gridColumns: 2 | 3 | 4;
  onGridColumnsChange: (cols: 2 | 3 | 4) => void;
  sortBy: 'date' | 'name' | 'size';
  onSortByChange: (sort: 'date' | 'name' | 'size') => void;
  autoScan: boolean;
  onAutoScanChange: (enabled: boolean) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  theme,
  onThemeChange,
  gridColumns,
  onGridColumnsChange,
  sortBy,
  onSortByChange,
  autoScan,
  onAutoScanChange,
}) => {
  return (
    <div className="h-full flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 sticky top-0 z-20">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Settings
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Appearance */}
        <div className="px-4 py-6 border-b border-border">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Appearance
          </h2>

          {/* Theme */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'auto', label: 'Auto', icon: Monitor },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onThemeChange(id as any)}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 smooth ${
                    theme === id
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:bg-muted'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid Size */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
              <Grid3x3 className="w-4 h-4" />
              Grid Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 4].map(cols => (
                <button
                  key={cols}
                  onClick={() => onGridColumnsChange(cols as any)}
                  className={`p-3 rounded-lg border-2 font-medium smooth ${
                    gridColumns === cols
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card hover:bg-muted'
                  }`}
                >
                  {cols}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Organization */}
        <div className="px-4 py-6 border-b border-border">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Organization
          </h2>

          {/* Sort By */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Sort By
            </label>
            <div className="space-y-2">
              {[
                { id: 'date', label: 'Date', icon: Calendar },
                { id: 'name', label: 'Name', icon: Type },
                { id: 'size', label: 'Size', icon: HardDrive },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onSortByChange(id as any)}
                  className={`w-full p-3 rounded-lg border flex items-center gap-3 smooth ${
                    sortBy === id
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{label}</span>
                  {sortBy === id && (
                    <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scanning */}
        <div className="px-4 py-6 border-b border-border">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Scanning
          </h2>

          {/* Auto Scan */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Auto-scan</p>
              <p className="text-sm text-muted-foreground">
                Automatically scan for new photos
              </p>
            </div>
            <button
              onClick={() => onAutoScanChange(!autoScan)}
              className={`relative w-12 h-6 rounded-full smooth ${
                autoScan ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full smooth ${
                  autoScan ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* About */}
        <div className="px-4 py-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            About
          </h2>

          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">App Name</span>
              <span className="font-medium text-foreground">Arvind Gallery</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium text-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Build</span>
              <span className="font-medium text-foreground">Premium</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            © 2024 Arvind Gallery. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
