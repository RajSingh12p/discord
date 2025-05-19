import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { discordApi, LogEntry } from "@/lib/discord";
import { queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type LogFilter = 'all' | 'success' | 'error' | 'info';

export function LogsPanel() {
  const [logFilter, setLogFilter] = useState<LogFilter>('all');
  
  const { data: logs, isLoading, refetch } = useQuery({
    queryKey: ['/api/logs', logFilter],
    queryFn: () => discordApi.getLogs(logFilter === 'all' ? undefined : logFilter),
    refetchInterval: 15000, // Refresh logs every 15 seconds
  });
  
  const handleFilterChange = (filter: LogFilter) => {
    setLogFilter(filter);
  };
  
  const handleRefresh = async () => {
    await refetch();
  };
  
  const handleDownload = () => {
    if (!logs) return;
    
    // Convert logs to text for download
    const logText = logs.map(log => 
      `[${log.timestamp}] ${log.type.toUpperCase()}: ${log.message}`
    ).join('\n');
    
    // Create a download link
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discord-dm-bot-logs-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const getLogColor = (type: string) => {
    switch(type) {
      case 'success': return 'text-[#43B581]';
      case 'error': return 'text-[#ED4245]';
      case 'info': return 'text-[#5865F2]';
      default: return 'text-white';
    }
  };
  
  const getLogIcon = (type: string) => {
    switch(type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '⚙️';
    }
  };
  
  return (
    <Card className="lg:col-span-2 bg-[#36393F] rounded-lg shadow-lg overflow-hidden border-[#2F3136]">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Logs</h3>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-[#72767D] hover:text-white"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-[#72767D] hover:text-white"
              onClick={handleDownload}
              disabled={!logs || logs.length === 0}
            >
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="bg-[#1E1F22] rounded-md p-4 h-80 overflow-y-auto font-mono text-sm">
          {isLoading ? (
            Array(10).fill(0).map((_, i) => (
              <Skeleton key={i} className={`h-4 w-${Math.floor(Math.random() * 4) + 7}/10 mb-2`} />
            ))
          ) : logs && logs.length > 0 ? (
            logs.map((log, i) => (
              <div key={i} className={cn("mb-2", getLogColor(log.type))}>
                {getLogIcon(log.type)} {log.message}
              </div>
            ))
          ) : (
            <div className="text-[#72767D] text-center py-4">No logs available</div>
          )}
        </div>
        
        {/* Log filters */}
        <div className="flex mt-4 space-x-2">
          <Button 
            className={cn(
              "px-3 py-1 text-xs rounded-md",
              logFilter === 'success' 
                ? "bg-[#43B581] bg-opacity-20 text-[#43B581] ring-2 ring-white ring-opacity-60" 
                : "bg-[#43B581] bg-opacity-20 text-[#43B581]"
            )}
            onClick={() => handleFilterChange('success')}
          >
            Success
          </Button>
          <Button 
            className={cn(
              "px-3 py-1 text-xs rounded-md",
              logFilter === 'error' 
                ? "bg-[#ED4245] bg-opacity-20 text-[#ED4245] ring-2 ring-white ring-opacity-60" 
                : "bg-[#ED4245] bg-opacity-20 text-[#ED4245]"
            )}
            onClick={() => handleFilterChange('error')}
          >
            Errors
          </Button>
          <Button 
            className={cn(
              "px-3 py-1 text-xs rounded-md",
              logFilter === 'info' 
                ? "bg-[#5865F2] bg-opacity-20 text-[#5865F2] ring-2 ring-white ring-opacity-60" 
                : "bg-[#5865F2] bg-opacity-20 text-[#5865F2]"
            )}
            onClick={() => handleFilterChange('info')}
          >
            Info
          </Button>
          <Button 
            className={cn(
              "px-3 py-1 text-xs rounded-md",
              logFilter === 'all' 
                ? "bg-[#72767D] bg-opacity-20 text-[#72767D] ring-2 ring-white ring-opacity-60" 
                : "bg-[#72767D] bg-opacity-20 text-[#72767D]"
            )}
            onClick={() => handleFilterChange('all')}
          >
            All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
