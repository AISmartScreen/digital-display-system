"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  File,
  Video,
  ArrowLeft,
  Download,
  AlertCircle,
  Home,
  Share2,
  FileText,
  Image as ImageIcon,
  Music,
  Globe,
  Database,
  CheckCircle,
  Folder,
  Unlock,
  RefreshCw,
  Shield,
} from "lucide-react";

// Smart Permission Manager - Automatically restores permissions
class SmartPermissionManager {
  static FOLDER_PICKER_ID = "file-server-folder"; // MUST match File Manager

  static async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("FileServerDB", 3);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains("handles")) {
          db.createObjectStore("handles");
        }

        if (!db.objectStoreNames.contains("blobCache")) {
          db.createObjectStore("blobCache", { keyPath: "fileName" });
        }

        if (!db.objectStoreNames.contains("shareLinks")) {
          db.createObjectStore("shareLinks", { keyPath: "token" });
        }
      };
    });
  }

  // Ensure persistent storage (prevents browser from clearing data)
  static async ensurePersistentStorage() {
    if (navigator.storage && navigator.storage.persist) {
      try {
        const isPersisted = await navigator.storage.persist();
        console.log(
          "📦 Persistent storage:",
          isPersisted ? "✅ Enabled" : "⚠️ Not enabled"
        );
        return isPersisted;
      } catch (error) {
        console.error("Failed to enable persistent storage:", error);
        return false;
      }
    }
    return false;
  }

  // Get file name from share token
  static async getFileNameFromToken(token) {
    try {
      const localData = localStorage.getItem(`share_${token}`);
      if (localData) {
        const parsed = JSON.parse(localData);
        if (Date.now() < parsed.expiresAt) {
          return parsed.fileName;
        }
        localStorage.removeItem(`share_${token}`);
      }

      const db = await this.openDB();
      const tx = db.transaction("shareLinks", "readonly");
      const data = await tx.objectStore("shareLinks").get(token);

      if (data && Date.now() < data.expiresAt) {
        return data.fileName;
      }

      throw new Error("Share link expired or invalid (24 hour limit)");
    } catch (error) {
      throw error;
    }
  }

  // Get stored folder handle
  static async getStoredFolderHandle() {
    try {
      const db = await this.openDB();
      const tx = db.transaction("handles", "readonly");
      const stored = await tx.objectStore("handles").get("primary");

      if (stored && stored.handle) {
        console.log("📁 Found stored folder handle:", stored.metadata?.name);
        return stored.handle;
      }

      console.log("📁 No stored folder handle found");
      return null;
    } catch (error) {
      console.error("Failed to get stored handle:", error);
      return null;
    }
  }

  // Try to restore permission on existing handle
  static async attemptPermissionRestoration(handle) {
    try {
      console.log("🔄 Attempting to restore permission...");

      // First check current permission status
      const currentPermission = await handle.queryPermission({ mode: "read" });
      console.log("Current permission status:", currentPermission);

      if (currentPermission === "granted") {
        console.log("✅ Permission already granted!");
        return { success: true, handle, method: "already-granted" };
      }

      // Try to request permission (may auto-grant or show simple prompt)
      console.log("🔐 Requesting permission on stored handle...");
      const newPermission = await handle.requestPermission({ mode: "read" });

      if (newPermission === "granted") {
        console.log("✅ Permission restored successfully!");
        return { success: true, handle, method: "auto-restored" };
      } else {
        console.log("❌ Permission denied by user");
        return { success: false, reason: "denied" };
      }
    } catch (error) {
      console.error("❌ Permission restoration failed:", error);

      // Handle is invalid - need to clear it
      if (error.name === "NotFoundError" || error.message.includes("invalid")) {
        await this.clearInvalidHandle();
        return { success: false, reason: "invalid-handle" };
      }

      return { success: false, reason: "error", error };
    }
  }

  // Clear invalid handle from storage
  static async clearInvalidHandle() {
    try {
      const db = await this.openDB();
      const tx = db.transaction("handles", "readwrite");
      await tx.objectStore("handles").delete("primary");
      console.log("🗑️ Cleared invalid handle");
    } catch (error) {
      console.error("Failed to clear handle:", error);
    }
  }

  // Request new folder access
  static async requestNewFolderAccess() {
    try {
      console.log("📁 Requesting new folder access...");

      const dirHandle = await window.showDirectoryPicker({
        mode: "read",
        id: this.FOLDER_PICKER_ID, // Same ID as File Manager
        startIn: "videos",
      });

      console.log("✅ Folder access granted:", dirHandle.name);

      // Store the handle
      const db = await this.openDB();
      const tx = db.transaction("handles", "readwrite");

      await tx.objectStore("handles").put(
        {
          handle: dirHandle,
          metadata: {
            name: dirHandle.name,
            grantedAt: Date.now(),
            lastAccessed: Date.now(),
          },
        },
        "primary"
      );

      return dirHandle;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Folder selection was cancelled");
      }
      throw error;
    }
  }

  // Get file from folder handle
  static async getFileFromHandle(fileName, handle) {
    try {
      console.log(`📄 Getting file "${fileName}" from folder...`);

      const fileHandle = await handle.getFileHandle(fileName);
      const file = await fileHandle.getFile();
      const blobUrl = URL.createObjectURL(file);

      console.log(`✅ File loaded: ${file.size} bytes`);

      return {
        url: blobUrl,
        name: fileName,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
      };
    } catch (error) {
      console.error(`Failed to get file "${fileName}":`, error);
      throw new Error(`File "${fileName}" not found in selected folder`);
    }
  }

  // Try to get file from blob cache
  static async getFileFromCache(fileName) {
    try {
      console.log(`🔍 Checking blob cache for "${fileName}"...`);

      const db = await this.openDB();
      const tx = db.transaction("blobCache", "readonly");
      const cached = await tx.objectStore("blobCache").get(fileName);

      if (cached && cached.blob) {
        console.log(`✅ Found in cache: ${cached.size} bytes`);

        const blobUrl = URL.createObjectURL(cached.blob);
        return {
          url: blobUrl,
          name: fileName,
          type: cached.type,
          size: cached.size,
          fromCache: true,
        };
      }

      console.log("❌ Not found in cache");
      return null;
    } catch (error) {
      console.error("Cache lookup failed:", error);
      return null;
    }
  }
}

export default function SharedFilePage() {
  const params = useParams();
  const router = useRouter();

  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState(null);
  const [fileContent, setFileContent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [loadingSteps, setLoadingSteps] = useState([]);

  const [error, setError] = useState(null);

  const [permissionState, setPermissionState] = useState("checking"); // checking, auto-restored, needs-selection, failed
  const [requestingPermission, setRequestingPermission] = useState(false);

  const [folderHandle, setFolderHandle] = useState(null);
  const [fromCache, setFromCache] = useState(false);

  // Add loading step
  const addStep = (step, status = "progress") => {
    setLoadingSteps((prev) => [
      ...prev,
      { message: step, status, time: Date.now() },
    ]);
  };

  // Initial load - smart permission restoration
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        addStep("🔍 Retrieving share information", "progress");

        // Ensure persistent storage
        await SmartPermissionManager.ensurePersistentStorage();

        // Get filename from token
        const file = await SmartPermissionManager.getFileNameFromToken(
          params.token
        );
        setFileName(file);
        setFileData({
          name: file,
          type: getFileType(file),
          extension: file.split(".").pop().toLowerCase(),
        });
        addStep(`📄 Found file: ${file}`, "success");

        // Try cache first (instant access if available)
        addStep("💾 Checking cache", "progress");
        const cached = await SmartPermissionManager.getFileFromCache(file);
        if (cached) {
          addStep("✅ Loaded from cache!", "success");
          setFileContent(cached);
          setFromCache(true);
          setPermissionState("auto-restored");
          setLoading(false);
          return;
        }
        addStep("Cache miss - checking folder access", "info");

        // Try to get stored handle
        addStep("🔍 Looking for stored folder handle", "progress");
        const storedHandle =
          await SmartPermissionManager.getStoredFolderHandle();

        if (!storedHandle) {
          addStep("No stored folder - need selection", "info");
          setPermissionState("needs-selection");
          setLoading(false);
          return;
        }

        addStep(`📁 Found folder: ${storedHandle.name}`, "success");

        // Try to restore permission automatically
        addStep("🔐 Attempting automatic permission restoration", "progress");
        const restoration =
          await SmartPermissionManager.attemptPermissionRestoration(
            storedHandle
          );

        if (restoration.success) {
          if (restoration.method === "already-granted") {
            addStep("✅ Permission already active!", "success");
          } else {
            addStep("✅ Permission restored automatically!", "success");
          }

          setFolderHandle(restoration.handle);
          setPermissionState("auto-restored");

          // Load the file
          addStep(`📂 Loading file from folder`, "progress");
          const fileData = await SmartPermissionManager.getFileFromHandle(
            file,
            restoration.handle
          );

          addStep("✅ File loaded successfully!", "success");
          setFileContent(fileData);
          setLoading(false);
        } else {
          // Permission restoration failed
          addStep(
            `⚠️ Permission restoration failed: ${restoration.reason}`,
            "warning"
          );

          if (restoration.reason === "invalid-handle") {
            addStep("Handle is invalid - new selection needed", "info");
          } else if (restoration.reason === "denied") {
            addStep("Permission denied - new selection needed", "info");
          }

          setPermissionState("needs-selection");
          setLoading(false);
        }
      } catch (err) {
        console.error("Initialization failed:", err);
        addStep(`❌ Error: ${err.message}`, "error");
        setError(err.message || "Failed to load shared file");
        setPermissionState("failed");
        setLoading(false);
      }
    };

    if (params.token) {
      initialize();
    }
  }, [params.token]);

  // Request new folder access
  const handleRequestPermission = async () => {
    try {
      setRequestingPermission(true);
      setError(null);

      const handle = await SmartPermissionManager.requestNewFolderAccess();
      setFolderHandle(handle);

      // Try to get the file
      const fileData = await SmartPermissionManager.getFileFromHandle(
        fileName,
        handle
      );

      setFileContent(fileData);
      setPermissionState("auto-restored");
      setRequestingPermission(false);
    } catch (err) {
      console.error("Permission request failed:", err);
      setError(err.message || "Failed to access folder");
      setRequestingPermission(false);
    }
  };

  const getFileType = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    const videoExts = ["mp4", "webm", "mov", "avi", "mkv", "m4v"];
    const imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
    const audioExts = ["mp3", "wav", "ogg", "flac", "m4a"];
    const textExts = [
      "txt",
      "json",
      "md",
      "csv",
      "log",
      "js",
      "jsx",
      "ts",
      "tsx",
      "html",
      "css",
      "xml",
      "yaml",
      "yml",
    ];

    if (videoExts.includes(ext)) return "video";
    if (imageExts.includes(ext)) return "image";
    if (audioExts.includes(ext)) return "audio";
    if (textExts.includes(ext)) return "text";
    return "document";
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "video":
        return <Video className="w-8 h-8 text-purple-300" />;
      case "image":
        return <ImageIcon className="w-8 h-8 text-green-300" />;
      case "audio":
        return <Music className="w-8 h-8 text-blue-300" />;
      case "text":
        return <FileText className="w-8 h-8 text-yellow-300" />;
      default:
        return <File className="w-8 h-8 text-slate-300" />;
    }
  };

  const handleDownload = () => {
    if (fileContent && fileContent.url) {
      const link = document.createElement("a");
      link.href = fileContent.url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
      });
  };

  const formatSize = (bytes) => {
    if (!bytes) return "Unknown size";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // Loading State with Progress
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <Loader2 className="w-16 h-16 text-purple-400 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Loading Shared File
            </h2>
            <p className="text-purple-200">{loadingMessage}</p>
          </div>

          {/* Progress Steps */}
          <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Loading Progress
            </h3>
            <div className="space-y-2">
              {loadingSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 text-sm ${
                    step.status === "success"
                      ? "text-green-300"
                      : step.status === "error"
                      ? "text-red-300"
                      : step.status === "warning"
                      ? "text-yellow-300"
                      : step.status === "info"
                      ? "text-blue-300"
                      : "text-purple-200"
                  }`}
                >
                  {step.status === "success" ? (
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  ) : step.status === "error" ? (
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  ) : step.status === "progress" ? (
                    <Loader2 className="w-4 h-4 flex-shrink-0 mt-0.5 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  )}
                  <span>{step.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Permission Required State
  if (permissionState === "needs-selection") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 max-w-lg border border-white/20">
          <div className="text-center mb-6">
            <Folder className="w-20 h-20 text-purple-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-3">
              Folder Access Needed
            </h2>
            <p className="text-purple-200 mb-2">
              To view <span className="font-mono text-white">{fileName}</span>
            </p>
          </div>

          {/* Show loading steps if there were any */}
          {loadingSteps.length > 0 && (
            <div className="bg-white/5 rounded-lg p-4 mb-6 max-h-48 overflow-y-auto">
              <h3 className="text-white font-semibold mb-2 text-sm">
                What happened:
              </h3>
              <div className="space-y-1">
                {loadingSteps.slice(-5).map((step, index) => (
                  <div key={index} className="text-xs text-purple-200">
                    {step.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-200">
                <p className="font-semibold mb-1">Select the same folder</p>
                <p>
                  Choose the folder you granted access to in the File Manager.
                  The browser will remember this permission for future shares.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRequestPermission}
              disabled={requestingPermission}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              {requestingPermission ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Waiting for folder selection...
                </>
              ) : (
                <>
                  <Unlock className="w-6 h-6" />
                  Select Folder
                </>
              )}
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Home className="w-5 h-5" />
              Go to File Manager
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Error State
  if (permissionState === "failed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 max-w-md border border-white/20">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white text-center mb-3">
            Error Loading File
          </h2>
          <p className="text-purple-200 text-center mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Home className="w-5 h-5" />
              Go to File Manager
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success - File Loaded State
  const isVideo = fileData?.type === "video";
  const isImage = fileData?.type === "image";
  const isAudio = fileData?.type === "audio";
  const isText = fileData?.type === "text";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push("/")}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              File Manager
            </button>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-300 font-medium">
                  {fromCache ? "Cached" : "Live"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-xl p-6 border border-purple-400/30">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    isVideo
                      ? "bg-purple-500/20"
                      : isImage
                      ? "bg-green-500/20"
                      : isAudio
                      ? "bg-blue-500/20"
                      : "bg-slate-500/20"
                  }`}
                >
                  {getFileIcon(fileData?.type)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white truncate max-w-2xl">
                    {fileData?.name}
                  </h1>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isVideo
                          ? "bg-purple-500/30 text-purple-200"
                          : isImage
                          ? "bg-green-500/30 text-green-200"
                          : isAudio
                          ? "bg-blue-500/30 text-blue-200"
                          : "bg-slate-500/30 text-slate-200"
                      }`}
                    >
                      {fileData?.extension?.toUpperCase()}
                    </span>
                    {fileContent?.size && (
                      <span className="px-3 py-1 bg-white/10 text-white text-sm rounded-full">
                        {formatSize(fileContent.size)}
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${
                        fromCache
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-green-500/20 text-green-300"
                      }`}
                    >
                      {fromCache ? (
                        <>
                          <Database className="w-3 h-3" />
                          From Cache
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Direct Access
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  disabled={!fileContent?.url}
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handleShare}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* File Preview */}
        <div className="bg-black/50 rounded-2xl overflow-hidden mb-8">
          {fileContent?.url ? (
            isVideo ? (
              <div className="relative">
                <video
                  src={fileContent.url}
                  controls
                  autoPlay
                  className="w-full aspect-video"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : isImage ? (
              <div className="p-8 flex items-center justify-center min-h-[60vh]">
                <img
                  src={fileContent.url}
                  alt={fileData.name}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                />
              </div>
            ) : isAudio ? (
              <div className="p-12 text-center">
                <Music className="w-32 h-32 text-blue-400 mx-auto mb-6" />
                <div className="max-w-md mx-auto">
                  <audio src={fileContent.url} controls className="w-full" />
                </div>
              </div>
            ) : isText ? (
              <div className="p-6">
                <div className="bg-slate-900 rounded-lg p-6 min-h-[60vh]">
                  <pre className="text-white font-mono text-sm whitespace-pre-wrap">
                    {fileContent.text || "Text content..."}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <File className="w-32 h-32 text-slate-400 mx-auto mb-6" />
                <p className="text-white text-xl mb-4">
                  {fileData?.extension?.toUpperCase()} File
                </p>
                <p className="text-purple-200 mb-6">
                  Preview not available. Use the download button to access the
                  file.
                </p>
                <button
                  onClick={handleDownload}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download File
                </button>
              </div>
            )
          ) : null}
        </div>

        {/* Info Footer */}
        <div className="text-center">
          <div className="inline-flex items-center gap-6 bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-300">
                {fromCache ? "Loaded from cache" : "Permission auto-restored"}
              </span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="text-sm text-purple-300">
              Share link expires in 24 hours
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="text-sm text-blue-300">
              Token: {params.token.substring(0, 8)}...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
