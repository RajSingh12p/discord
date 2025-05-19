import { apiRequest } from "./queryClient";

// Interface for Bot Status
export interface BotStatus {
  status: 'online' | 'offline';
  uptime: string;
  server: string;
  latency: string;
}

// Interface for Log Entry
export interface LogEntry {
  type: 'success' | 'error' | 'info' | 'system';
  message: string;
  timestamp: string;
}

// Interface for Role Member
export interface RoleMember {
  id: string;
  username: string;
  tag: string;
  avatarInitials: string;
  status: 'sent' | 'failed' | 'pending';
}

// Interface for Role
export interface Role {
  id: string;
  name: string;
  memberCount: number;
}

// Interface for Server
export interface Server {
  id: string;
  name: string;
}

// API functions for interacting with the bot
export const discordApi = {
  getBotStatus: async (): Promise<BotStatus> => {
    const res = await apiRequest('GET', '/api/bot/status', undefined);
    return res.json();
  },
  
  getLogs: async (filter?: 'success' | 'error' | 'info' | 'all'): Promise<LogEntry[]> => {
    const url = filter && filter !== 'all' 
      ? `/api/logs?filter=${filter}` 
      : '/api/logs';
    const res = await apiRequest('GET', url, undefined);
    return res.json();
  },
  
  getRoles: async (): Promise<Role[]> => {
    const res = await apiRequest('GET', '/api/roles', undefined);
    return res.json();
  },
  
  getRoleMembers: async (roleId: string): Promise<RoleMember[]> => {
    const res = await apiRequest('GET', `/api/roles/${roleId}/members`, undefined);
    return res.json();
  },
  
  sendDmToRole: async (roleId: string, message: string): Promise<{success: boolean, message: string}> => {
    const res = await apiRequest('POST', '/api/dm', { roleId, message });
    return res.json();
  },
  
  restartBot: async (): Promise<{success: boolean, message: string}> => {
    const res = await apiRequest('POST', '/api/bot/restart', undefined);
    return res.json();
  },
  
  getServers: async (): Promise<Server[]> => {
    const res = await apiRequest('GET', '/api/servers', undefined);
    return res.json();
  },
  
  updateConfig: async (config: {
    port?: string;
    prefix?: string;
    logLevel?: string;
  }): Promise<{success: boolean, message: string}> => {
    const res = await apiRequest('POST', '/api/config', config);
    return res.json();
  }
};
