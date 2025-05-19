import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Server } from "@/lib/discord";
import { Skeleton } from "@/components/ui/skeleton";

interface HeaderProps {
  server: Server | null;
  servers: Server[];
  onServerChange: (serverId: string) => void;
  isLoading: boolean;
}

export function Header({ server, servers, onServerChange, isLoading }: HeaderProps) {
  return (
    <header className="bg-[#36393F] border-b border-[#2F3136] px-6 py-3">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Dashboard</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <span className="text-[#72767D] text-sm mr-2">Server:</span>
            {isLoading ? (
              <Skeleton className="h-8 w-40 rounded-md" />
            ) : (
              <Select 
                value={server?.id || ""} 
                onValueChange={onServerChange}
              >
                <SelectTrigger className="bg-[#1E1F22] text-white py-1 px-3 rounded-md text-sm border border-[#2F3136] w-40">
                  <SelectValue placeholder="Select a server" />
                </SelectTrigger>
                <SelectContent className="bg-[#1E1F22] text-white border-[#2F3136]">
                  {servers.map((server) => (
                    <SelectItem key={server.id} value={server.id}>{server.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <Button variant="ghost" className="flex items-center space-x-1 p-1 text-[#72767D] hover:text-white">
            <User className="h-4 w-4" />
            <span>Admin</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
