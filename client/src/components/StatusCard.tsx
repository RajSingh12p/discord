import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { discordApi } from "@/lib/discord";
import { queryClient } from "@/lib/queryClient";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export function StatusCard() {
  const { toast } = useToast();
  
  const { data: botStatus, isLoading } = useQuery({
    queryKey: ['/api/bot/status'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });
  
  const restartMutation = useMutation({
    mutationFn: discordApi.restartBot,
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Bot restarted",
          description: "The bot has been successfully restarted",
        });
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['/api/bot/status'] });
        queryClient.invalidateQueries({ queryKey: ['/api/logs'] });
      } else {
        toast({
          title: "Failed to restart bot",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to restart the bot: " + String(error),
        variant: "destructive",
      });
    }
  });
  
  const handleRestartBot = () => {
    restartMutation.mutate();
  };
  
  return (
    <Card className="bg-[#36393F] rounded-lg shadow-lg overflow-hidden border-[#2F3136]">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Bot Status</h3>
        <div className="space-y-4">
          {/* Status Items */}
          <div className="flex justify-between items-center">
            <span className="text-[#72767D]">Status</span>
            {isLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${botStatus?.status === 'online' ? 'bg-[#43B581]' : 'bg-[#ED4245]'}`}></div>
                <span className="text-white">{botStatus?.status === 'online' ? 'Online' : 'Offline'}</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-[#72767D]">Uptime</span>
            {isLoading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <span className="text-white">{botStatus?.uptime || 'N/A'}</span>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-[#72767D]">Server</span>
            {isLoading ? (
              <Skeleton className="h-6 w-40" />
            ) : (
              <span className="text-white">{botStatus?.server || 'N/A'}</span>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-[#72767D]">API Latency</span>
            {isLoading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <span className="text-white">{botStatus?.latency || 'N/A'}</span>
            )}
          </div>
          
          {/* Restart Button */}
          <div className="mt-6">
            <Button 
              variant="outline" 
              className="w-full px-4 py-2 bg-[#2F3136] hover:bg-[#1E1F22] text-white rounded-md flex items-center justify-center space-x-2 border-[#1E1F22]"
              onClick={handleRestartBot}
              disabled={restartMutation.isPending}
            >
              {restartMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              <span>{restartMutation.isPending ? "Restarting..." : "Restart Bot"}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
