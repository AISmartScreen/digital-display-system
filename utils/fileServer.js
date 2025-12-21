// Enhanced Persistent File Server with Cross-Route Support

export class PersistentFileServer {
  static STORAGE_KEY = "persistent-folder-handles";
  static CHANNEL_NAME = "folder-manager-channel";
  static channel = null;
  static listeners = new Map();
  static fileCache = new Map(); // In-memory cache for quick access

  // Initialize the file server
  static async initialize() {
    // Setup cross-tab communication
    if ("BroadcastChannel" in window) {
      this.channel = new BroadcastChannel(this.CHANNEL_NAME);

      this.channel.onmessage = (event) => {
        this.handleBroadcastMessage(event.data);
      };
    }

    // Request persistent storage
    await this.requestStoragePersistence();

    // Setup message handler for file requests from other routes
    this.setupFileRequestHandler();
  }

  // Setup handler for file requests from other routes/windows
  static setupFileRequestHandler() {
    window.addEventListener("message", async (event) => {
      if (event.data.type === "REQUEST_FILE") {
        try {
          const fileName = event.data.fileName;
          console.log("Received file request for:", fileName);

          // Get the file
          const fileData = await this.getFileUrl(fileName);

          // Send back via port (if available) or postMessage
          if (event.ports && event.ports[0]) {
            event.ports[0].postMessage({
              url: fileData.url,
              type: fileData.type,
              size: fileData.size,
              name: fileData.name,
              lastModified: fileData.lastModified,
            });
          } else {
            event.source.postMessage(
              {
                type: "SEND_FILE",
                fileName: fileName,
                url: fileData.url,
                fileType: fileData.type,
                size: fileData.size,
                lastModified: fileData.lastModified,
              },
              "*"
            );
          }
        } catch (error) {
          console.error("Failed to handle file request:", error);
          if (event.ports && event.ports[0]) {
            event.ports[0].postMessage({
              error: error.message,
            });
          }
        }
      }
    });
  }

  // Request persistent storage
  static async requestStoragePersistence() {
    if (navigator.storage && navigator.storage.persist) {
      try {
        const isPersisted = await navigator.storage.persist();
        console.log("Persistent storage:", isPersisted ? "Granted" : "Denied");
        return isPersisted;
      } catch (error) {
        console.error("Failed to request persistent storage:", error);
        return false;
      }
    }
    return false;
  }

  // Store folder handle with metadata
  static async storeFolderHandle(handle, metadata = {}) {
    try {
      const db = await this.openDB();
      const tx = db.transaction("handles", "readwrite");

      const handleWithMeta = {
        handle: handle,
        metadata: {
          name: handle.name,
          grantedAt: Date.now(),
          lastAccessed: Date.now(),
          ...metadata,
        },
      };

      await tx.objectStore("handles").put(handleWithMeta, "primary");

      // Notify other tabs
      this.broadcast({
        type: "FOLDER_GRANTED",
        folderName: handle.name,
        timestamp: Date.now(),
      });

      return true;
    } catch (error) {
      console.error("Failed to store folder handle:", error);
      return false;
    }
  }

  // Restore folder handle
  static async restoreFolderHandle() {
    try {
      const db = await this.openDB();
      const tx = db.transaction("handles", "readonly");
      const stored = await tx.objectStore("handles").get("primary");

      if (stored && stored.handle) {
        // Verify permission still exists
        try {
          const permission = await stored.handle.queryPermission({
            mode: "read",
          });
          if (permission === "granted") {
            // Update last accessed time
            await this.updateLastAccessed();
            return stored.handle;
          }
        } catch (error) {
          console.log("Stored handle is invalid, removing...");
          await this.clearStoredHandle();
        }
      }
      return null;
    } catch (error) {
      console.error("Failed to restore folder handle:", error);
      return null;
    }
  }

  // Get file as blob URL for sharing across routes
  static async getFileUrl(fileName, handleOverride = null) {
    // Check in-memory cache first
    if (this.fileCache.has(fileName)) {
      const cached = this.fileCache.get(fileName);
      if (Date.now() - cached.timestamp < 300000) {
        // 5 minutes cache
        return cached.data;
      }
    }

    const handle = handleOverride || (await this.restoreFolderHandle());
    if (!handle) {
      throw new Error("No folder access available");
    }

    try {
      const fileHandle = await handle.getFileHandle(fileName);
      const file = await fileHandle.getFile();
      const blobUrl = URL.createObjectURL(file);

      const fileData = {
        url: blobUrl,
        name: fileName,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
      };

      // Store in memory cache
      this.fileCache.set(fileName, {
        data: fileData,
        timestamp: Date.now(),
      });

      // Store reference for cleanup
      await this.trackBlobUrl(fileName, blobUrl);

      return fileData;
    } catch (error) {
      console.error(`Failed to get file "${fileName}":`, error);
      throw error;
    }
  }

  // Get file list from folder
  static async getFileList(handleOverride = null) {
    const handle = handleOverride || (await this.restoreFolderHandle());
    if (!handle) return [];

    const files = [];

    for await (const entry of handle.values()) {
      if (entry.kind === "file") {
        const file = await entry.getFile();
        files.push({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          kind: entry.kind,
          isVideo: file.type.startsWith("video/"),
          isText: file.type.startsWith("text/"),
        });
      }
    }

    // Sort by name
    files.sort((a, b) => a.name.localeCompare(b.name));

    // Notify other tabs about the file list refresh
    this.broadcast({
      type: "FILE_LIST_REFRESHED",
      count: files.length,
      timestamp: Date.now(),
    });

    return files;
  }

  // Delete file from folder
  static async deleteFile(fileName, handleOverride = null) {
    const handle = handleOverride || (await this.restoreFolderHandle());
    if (!handle) {
      throw new Error("No folder access available");
    }

    try {
      await handle.removeEntry(fileName);

      // Clear from cache
      this.fileCache.delete(fileName);

      // Broadcast deletion
      this.broadcast({
        type: "FILE_DELETED",
        fileName: fileName,
        timestamp: Date.now(),
      });

      return true;
    } catch (error) {
      console.error(`Failed to delete file "${fileName}":`, error);
      throw error;
    }
  }

  // Upload files to folder
  static async uploadFiles(files, handleOverride = null) {
    const handle = handleOverride || (await this.restoreFolderHandle());
    if (!handle) {
      throw new Error("No folder access available");
    }

    const uploaded = [];

    for (const file of files) {
      try {
        const fileHandle = await handle.getFileHandle(file.name, {
          create: true,
        });
        const writable = await fileHandle.createWritable();
        await writable.write(file);
        await writable.close();

        uploaded.push(file.name);
      } catch (error) {
        console.error(`Failed to upload "${file.name}":`, error);
      }
    }

    if (uploaded.length > 0) {
      this.broadcast({
        type: "FILES_UPLOADED",
        files: uploaded,
        timestamp: Date.now(),
      });
    }

    return uploaded;
  }

  // Broadcast message to other tabs
  static broadcast(message) {
    if (this.channel) {
      this.channel.postMessage(message);
    }
  }

  // Handle broadcast messages
  static handleBroadcastMessage(message) {
    switch (message.type) {
      case "FOLDER_GRANTED":
        console.log(`Folder "${message.folderName}" granted in another tab`);
        this.notifyListeners("folderGranted", message);
        break;

      case "FILE_LIST_REFRESHED":
        this.notifyListeners("fileListRefreshed", message);
        break;

      case "FILE_DELETED":
        console.log(`File "${message.fileName}" deleted in another tab`);
        this.fileCache.delete(message.fileName);
        this.notifyListeners("fileDeleted", message);
        break;

      case "FILES_UPLOADED":
        console.log(`${message.files.length} files uploaded in another tab`);
        this.notifyListeners("filesUploaded", message);
        break;
    }
  }

  // Event listener system
  static addListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    // Return cleanup function
    return () => {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  static notifyListeners(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  // Helper methods
  static async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("PersistentFileServerDB", 2);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains("handles")) {
          db.createObjectStore("handles");
        }

        if (!db.objectStoreNames.contains("blobUrls")) {
          db.createObjectStore("blobUrls");
        }
      };
    });
  }

  static async updateLastAccessed() {
    try {
      const db = await this.openDB();
      const tx = db.transaction("handles", "readwrite");
      const stored = await tx.objectStore("handles").get("primary");

      if (stored) {
        stored.metadata.lastAccessed = Date.now();
        await tx.objectStore("handles").put(stored, "primary");
      }
    } catch (error) {
      console.error("Failed to update last accessed:", error);
    }
  }

  static async trackBlobUrl(fileName, blobUrl) {
    try {
      const db = await this.openDB();
      const tx = db.transaction("blobUrls", "readwrite");
      await tx.objectStore("blobUrls").put({ blobUrl, fileName }, fileName);
    } catch (error) {
      console.error("Failed to track blob URL:", error);
    }
  }

  static async clearStoredHandle() {
    try {
      const db = await this.openDB();
      const tx = db.transaction("handles", "readwrite");
      await tx.objectStore("handles").delete("primary");
      this.fileCache.clear();
    } catch (error) {
      console.error("Failed to clear stored handle:", error);
    }
  }

  // Cleanup blob URLs
  static async cleanup() {
    try {
      const db = await this.openDB();
      const tx = db.transaction("blobUrls", "readwrite");
      const store = tx.objectStore("blobUrls");

      const allKeys = await store.getAllKeys();
      for (const key of allKeys) {
        const item = await store.get(key);
        if (item && item.blobUrl) {
          URL.revokeObjectURL(item.blobUrl);
        }
      }

      await store.clear();
      this.fileCache.clear();
    } catch (error) {
      console.error("Failed to cleanup blob URLs:", error);
    }
  }
}

// Shared File Server Utility for Share Links
class SharedFileServer {
  static DB_NAME = "SharedFileServerDB";
  static DB_VERSION = 3;
  static STORAGE_KEY = "share-links";

  // Initialize database
  static async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create stores if they don't exist
        if (!db.objectStoreNames.contains("shareLinks")) {
          db.createObjectStore("shareLinks", { keyPath: "token" });
        }

        if (!db.objectStoreNames.contains("fileCache")) {
          db.createObjectStore("fileCache", { keyPath: "fileName" });
        }
      };
    });
  }

  // Store a share link
  static async storeShareLink(token, fileName, expiresInHours = 24) {
    try {
      const db = await this.initDB();
      const tx = db.transaction("shareLinks", "readwrite");
      const store = tx.objectStore("shareLinks");

      const shareData = {
        token,
        fileName,
        created: Date.now(),
        expiresAt: Date.now() + expiresInHours * 60 * 60 * 1000,
      };

      await store.put(shareData);

      // Also store in localStorage for quick access
      localStorage.setItem(`share_${token}`, JSON.stringify(shareData));

      return shareData;
    } catch (error) {
      console.error("Failed to store share link:", error);
      throw error;
    }
  }

  // Get file name from token
  static async getFileNameFromToken(token) {
    try {
      // First try localStorage
      const localData = localStorage.getItem(`share_${token}`);
      if (localData) {
        const parsed = JSON.parse(localData);
        if (Date.now() < parsed.expiresAt) {
          return parsed.fileName;
        } else {
          // Clean up expired
          localStorage.removeItem(`share_${token}`);
        }
      }

      // Then try IndexedDB
      const db = await this.initDB();
      const tx = db.transaction("shareLinks", "readonly");
      const store = tx.objectStore("shareLinks");
      const data = await store.get(token);

      if (data && Date.now() < data.expiresAt) {
        return data.fileName;
      } else if (data) {
        // Clean up expired
        const deleteTx = db.transaction("shareLinks", "readwrite");
        await deleteTx.objectStore("shareLinks").delete(token);
      }

      throw new Error("Share link expired or invalid");
    } catch (error) {
      console.error("Failed to get file name from token:", error);
      throw error;
    }
  }

  // Cache file data
  static async cacheFileData(fileName, fileData) {
    try {
      const db = await this.initDB();
      const tx = db.transaction("fileCache", "readwrite");
      const store = tx.objectStore("fileCache");

      const cacheEntry = {
        fileName,
        data: fileData,
        cachedAt: Date.now(),
      };

      await store.put(cacheEntry);
      return true;
    } catch (error) {
      console.error("Failed to cache file data:", error);
      return false;
    }
  }

  // Get cached file data
  static async getCachedFile(fileName) {
    try {
      const db = await this.initDB();
      const tx = db.transaction("fileCache", "readonly");
      const store = tx.objectStore("fileCache");
      const cached = await store.get(fileName);

      if (cached && Date.now() - cached.cachedAt < 3600000) {
        // 1 hour cache
        return cached.data;
      }
      return null;
    } catch (error) {
      console.error("Failed to get cached file:", error);
      return null;
    }
  }

  // Clean up expired data
  static async cleanupExpired() {
    try {
      const db = await this.initDB();

      // Clean up share links
      const shareTx = db.transaction("shareLinks", "readwrite");
      const shareStore = shareTx.objectStore("shareLinks");
      const shareKeys = await shareStore.getAllKeys();

      for (const key of shareKeys) {
        const item = await shareStore.get(key);
        if (item && Date.now() > item.expiresAt) {
          await shareStore.delete(key);
          localStorage.removeItem(`share_${key}`);
        }
      }

      // Clean up old file cache
      const cacheTx = db.transaction("fileCache", "readwrite");
      const cacheStore = cacheTx.objectStore("fileCache");
      const cacheKeys = await cacheStore.getAllKeys();

      for (const key of cacheKeys) {
        const item = await cacheStore.get(key);
        if (item && Date.now() - item.cachedAt > 3600000) {
          // 1 hour
          await cacheStore.delete(key);
        }
      }
    } catch (error) {
      console.error("Failed to cleanup expired data:", error);
    }
  }
}

export default SharedFileServer;
