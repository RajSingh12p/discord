import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getClient, sendDMToRole, startClient, restartClient, getBotStatus } from "./discord";
import { readLogs, addLogEntry, LogType } from "./handlers/events";
import { getRoles, getServerInfo, getRoleMembers } from "./handlers/commands";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Discord bot
  await startClient();
  
  // Ping endpoint for uptime monitoring
  app.get("/ping", (req, res) => {
    res.status(200).send("Bot is online!");
  });
  
  // Bot status endpoint
  app.get("/api/bot/status", async (req, res) => {
    try {
      const status = await getBotStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bot status" });
    }
  });
  
  // Restart bot endpoint
  app.post("/api/bot/restart", async (req, res) => {
    try {
      await restartClient();
      res.json({ success: true, message: "Bot successfully restarted" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to restart bot" });
    }
  });
  
  // Get logs endpoint
  app.get("/api/logs", (req, res) => {
    try {
      const filter = req.query.filter as LogType | undefined;
      const logs = readLogs(filter);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve logs" });
    }
  });
  
  // Get servers
  app.get("/api/servers", async (req, res) => {
    try {
      const client = getClient();
      const servers = Array.from(client.guilds.cache.values()).map(guild => ({
        id: guild.id,
        name: guild.name
      }));
      res.json(servers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get servers" });
    }
  });
  
  // Get roles for a server
  app.get("/api/roles", async (req, res) => {
    try {
      const roles = await getRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: "Failed to get roles" });
    }
  });
  
  // Get members with a specific role
  app.get("/api/roles/:roleId/members", async (req, res) => {
    try {
      const roleId = req.params.roleId;
      const members = await getRoleMembers(roleId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to get role members" });
    }
  });
  
  // Send DM to role
  app.post("/api/dm", async (req, res) => {
    try {
      const { roleId, message } = req.body;
      
      if (!roleId || !message) {
        return res.status(400).json({ 
          success: false, 
          message: "Role ID and message are required" 
        });
      }
      
      const result = await sendDMToRole(roleId, message);
      
      res.json({ 
        success: true, 
        message: `Successfully sent DM to ${result.successCount} members. ${result.failedCount} failed.` 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: `Failed to send DMs: ${error instanceof Error ? error.message : String(error)}` 
      });
    }
  });
  
  // Update config
  app.post("/api/config", (req, res) => {
    try {
      const { port, prefix, logLevel } = req.body;
      
      // In a real implementation, these would be saved to a configuration file or database
      // For now, we'll just log them and return success
      addLogEntry("info", `Configuration updated: port=${port}, prefix=${prefix}, logLevel=${logLevel}`);
      
      res.json({ success: true, message: "Configuration updated successfully" });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: `Failed to update configuration: ${error instanceof Error ? error.message : String(error)}` 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
