// components/DisplayStats.tsx
"use client";

import React from "react";
import {
  Loader2,
  BarChart3,
  Zap,
  FileImage,
  HardDrive,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useDisplayStats } from "@/hooks/useDisplayStats";

interface StatItem {
  label: string;
  value: string | number;
  icon: typeof BarChart3;
  color: string;
  bgColor: string;
}

export default function DisplayStats() {
  const { stats, loading, error, isRefreshing, refetch } = useDisplayStats();

  // Format bytes to GB/MB
  const formatStorage = (bytes: number): string => {
    if (bytes === 0) return "0 MB";
    const gb = bytes / (1024 * 1024 * 1024);
    return gb < 0.1
      ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
      : `${gb.toFixed(1)} GB`;
  };

  const items: StatItem[] = [
    {
      label: "Total Displays",
      value: stats.totalDisplays,
      icon: BarChart3,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Active",
      value: stats.activeDisplays,
      icon: Zap,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Media Files",
      value: stats.mediaFiles,
      icon: FileImage,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Storage Used",
      value: formatStorage(stats.storageUsed),
      icon: HardDrive,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ];

  if (loading && !isRefreshing) {
    return (
      <div
        className="flex items-center justify-center p-8 mb-8"
        role="status"
        aria-label="Loading statistics"
      >
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="sr-only">Loading statistics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-slate-900/50 border-slate-800 mb-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <XCircle className="h-12 w-12 text-red-400" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Failed to Load Statistics
            </h3>
            <p className="text-red-400" role="alert">
              {error}
            </p>
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Retry
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-50">Overview</h2>
          <p className="text-slate-400 text-sm mt-1">
            Your display statistics at a glance
          </p>
        </div>
        <button
          onClick={refetch}
          disabled={isRefreshing || loading}
          className="p-2 hover:bg-slate-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          aria-label="Refresh statistics"
          title="Refresh statistics"
        >
          <RefreshCw
            className={`h-4 w-4 text-slate-400 ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="p-6 bg-slate-900/50 border-slate-800 hover:bg-slate-900/70 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium text-slate-400">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-50">
                    {typeof stat.value === "number"
                      ? stat.value.toLocaleString()
                      : stat.value}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg ${stat.bgColor}`}
                  aria-hidden="true"
                >
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {stats.totalDisplays === 0 && !loading && (
        <Card className="p-6 bg-slate-900/30 border-slate-800 border-dashed mt-4">
          <div className="text-center text-slate-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-3 text-slate-600" />
            <p className="text-sm">
              No displays found. Create your first display to get started.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
