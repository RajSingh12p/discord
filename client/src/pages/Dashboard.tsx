import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { StatusCard } from "@/components/StatusCard";
import { CommandsCard } from "@/components/CommandsCard";
import { LogsPanel } from "@/components/LogsPanel";
import { RoleMembersCard } from "@/components/RoleMembersCard";
import { ConfigCard } from "@/components/ConfigCard";
import { Footer } from "@/components/Footer";
import { discordApi, Server } from "@/lib/discord";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  
  const { data: servers, isLoading: serversLoading } = useQuery({
    queryKey: ['/api/servers'],
    refetchInterval: 60000, // Refresh server list every minute
  });
  
  // Set the first server as selected when data loads
  useEffect(() => {
    if (servers && servers.length > 0 && !selectedServer) {
      setSelectedServer(servers[0]);
    }
  }, [servers, selectedServer]);
  
  // Handle server change
  const handleServerChange = (serverId: string) => {
    const server = servers?.find(s => s.id === serverId);
    if (server) {
      setSelectedServer(server);
    }
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-discord-dark-gray text-white">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <Header 
          server={selectedServer} 
          servers={servers || []} 
          onServerChange={handleServerChange} 
          isLoading={serversLoading} 
        />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatusCard />
            <CommandsCard />
            <LogsPanel />
            <RoleMembersCard />
            <ConfigCard />
          </div>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
      
      {/* Mobile Menu Toggle */}
      <div className="fixed bottom-4 right-4 md:hidden">
        <Button 
          className="w-12 h-12 rounded-full bg-[#5865F2] hover:bg-[#4752c4] flex items-center justify-center p-0"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
