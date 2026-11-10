import os from "os";
import mongoose from "mongoose";

class SystemMonitor {
  constructor(serviceName, maxLogs = 150) {
    this.serviceName = serviceName;
    this.maxLogs = maxLogs;
    this.logs = [];
    this.logId = 0;
    this.lastCpuUsage = process.cpuUsage();
    this.lastCpuTime = Date.now();
    this.initLogger();
  }

  initLogger() {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    console.log = (...args) => {
      this.addLog("info", args.map(a => (typeof a === "object" ? JSON.stringify(a) : a)).join(" "));
      originalLog.apply(console, args);
    };

    console.info = (...args) => {
      this.addLog("info", args.map(a => (typeof a === "object" ? JSON.stringify(a) : a)).join(" "));
      originalInfo.apply(console, args);
    };

    console.error = (...args) => {
      this.addLog("error", args.map(a => (typeof a === "object" ? JSON.stringify(a) : a)).join(" "));
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      this.addLog("warn", args.map(a => (typeof a === "object" ? JSON.stringify(a) : a)).join(" "));
      originalWarn.apply(console, args);
    };
  }

  // Stream adapter for morgan logging
  get morganStream() {
    return {
      write: (message) => {
        if (message && message.trim()) {
          this.addLog("http", message.trim());
        }
      },
    };
  }

  addLog(level, message) {
    this.logId++;
    this.logs.push({
      id: this.logId,
      timestamp: new Date().toISOString(),
      level,
      message,
    });
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  clearLogs() {
    this.logs = [];
    return true;
  }

  calculateCpuPercent() {
    const currentCpu = process.cpuUsage(this.lastCpuUsage);
    const now = Date.now();
    const timeDeltaMs = (now - this.lastCpuTime) || 1;
    this.lastCpuUsage = process.cpuUsage();
    this.lastCpuTime = now;

    // Total CPU time spent in microseconds converted to ms
    const totalCpuMs = (currentCpu.user + currentCpu.system) / 1000;
    const numCores = os.cpus().length || 1;
    // Percentage relative to single core or total capacity
    const percent = Math.min(100, Math.max(0, +((totalCpuMs / (timeDeltaMs * numCores)) * 100).toFixed(1)));
    return percent;
  }

  getMetrics() {
    const mem = process.memoryUsage();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const rssMB = +(mem.rss / (1024 * 1024)).toFixed(1);
    const heapUsedMB = +(mem.heapUsed / (1024 * 1024)).toFixed(1);
    const heapTotalMB = +(mem.heapTotal / (1024 * 1024)).toFixed(1);
    const externalMB = +(mem.external / (1024 * 1024)).toFixed(1);
    
    // Render free-tier container RAM limit is 512 MB
    const containerLimitMB = 512;
    const percentUsed = Math.min(100, +((rssMB / containerLimitMB) * 100).toFixed(1));

    const uptimeSec = Math.floor(process.uptime());
    const hours = Math.floor(uptimeSec / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);
    const seconds = uptimeSec % 60;
    const uptimeFormatted = `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${seconds}s`;

    const dbState = mongoose.connection ? mongoose.connection.readyState : 0;
    const dbStatusMap = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };

    return {
      service: this.serviceName,
      status: "awake",
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: uptimeSec,
        formatted: uptimeFormatted,
      },
      memory: {
        rssMB,
        heapUsedMB,
        heapTotalMB,
        externalMB,
        containerLimitMB,
        percentUsed,
        systemTotalMB: +(totalMem / (1024 * 1024)).toFixed(1),
        systemFreeMB: +(freeMem / (1024 * 1024)).toFixed(1),
      },
      cpu: {
        percent: this.calculateCpuPercent(),
        cores: os.cpus().length,
        model: os.cpus()[0]?.model || "Generic CPU",
        loadAvg: os.loadavg().map(v => +v.toFixed(2)),
      },
      database: {
        status: dbStatusMap[dbState] || "unknown",
        connected: dbState === 1,
        name: mongoose.connection?.name || null,
        host: mongoose.connection?.host || null,
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid,
        env: process.env.NODE_ENV || "development",
      },
      logs: this.logs.slice(-100),
    };
  }

  // Route handlers helper
  attachRoutes(app, prefix = "/api/monitoring") {
    app.get(`${prefix}`, (req, res) => {
      res.json({
        success: true,
        data: this.getMetrics(),
      });
    });

    app.post(`${prefix}/test-log`, (req, res) => {
      const msg = req.body?.message || `Test log entry triggered from Admin Dashboard at ${new Date().toLocaleTimeString()}`;
      const level = req.body?.level || "info";
      this.addLog(level, `[TEST] ${msg}`);
      res.json({ success: true, message: "Test log emitted", timestamp: new Date() });
    });

    app.delete(`${prefix}/logs`, (req, res) => {
      this.clearLogs();
      res.json({ success: true, message: "Logs cleared successfully" });
    });
  }
}

export default SystemMonitor;

