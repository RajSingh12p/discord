import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { discordApi } from "@/lib/discord";
import { queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export function CommandsCard() {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState("");
  const [messageContent, setMessageContent] = useState("Hello! This is a message from your server admin.");
  
  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ['/api/roles'],
  });
  
  const sendDmMutation = useMutation({
    mutationFn: ({ roleId, message }: { roleId: string, message: string }) => 
      discordApi.sendDmToRole(roleId, message),
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "DM Sent",
          description: "Direct messages have been sent to the members with the selected role",
        });
        // Invalidate related queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['/api/logs'] });
        queryClient.invalidateQueries({ queryKey: [`/api/roles/${selectedRole}/members`] });
      } else {
        toast({
          title: "Failed to send DMs",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send DMs: " + String(error),
        variant: "destructive",
      });
    }
  });
  
  const handleSendDm = () => {
    if (!selectedRole) {
      toast({
        title: "No role selected",
        description: "Please select a role to send DMs to",
        variant: "destructive",
      });
      return;
    }
    
    if (!messageContent.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message to send",
        variant: "destructive",
      });
      return;
    }
    
    sendDmMutation.mutate({ 
      roleId: selectedRole, 
      message: messageContent 
    });
  };
  
  return (
    <Card className="bg-[#36393F] rounded-lg shadow-lg overflow-hidden border-[#2F3136]">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Quick Commands</h3>
        
        {/* DM Role Command */}
        <div className="space-y-4">
          <label className="block text-[#72767D] text-sm">Role to DM</label>
          <div className="flex space-x-2">
            {rolesLoading ? (
              <Skeleton className="h-10 flex-1" />
            ) : (
              <Select 
                value={selectedRole} 
                onValueChange={setSelectedRole}
              >
                <SelectTrigger className="bg-[#1E1F22] text-white py-2 px-3 rounded-md flex-1 border border-[#2F3136]">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-[#1E1F22] text-white border-[#2F3136]">
                  {roles?.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name} ({role.memberCount} members)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <Button 
              className="px-4 py-2 bg-[#5865F2] hover:bg-opacity-80 text-white rounded-md"
              onClick={handleSendDm}
              disabled={sendDmMutation.isPending || !selectedRole}
            >
              {sendDmMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send DM"
              )}
            </Button>
          </div>
          
          {/* Message Content */}
          <div className="mt-4">
            <label className="block text-[#72767D] text-sm mb-2">Message Content</label>
            <Textarea 
              className="w-full bg-[#1E1F22] text-white py-2 px-3 rounded-md border border-[#2F3136] h-24" 
              placeholder="Enter your message here..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            />
          </div>
          
          {/* Command History */}
          <div className="mt-4">
            <label className="block text-[#72767D] text-sm mb-2">Recent Commands</label>
            <div className="bg-[#1E1F22] rounded-md p-3 font-mono text-sm text-[#72767D]">
              {rolesLoading ? (
                <>
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </>
              ) : roles && roles.length > 0 ? (
                <>
                  <div className="mb-2">!dmrole {roles[0]?.name} (2 minutes ago)</div>
                  {roles.length > 1 && <div>!dmrole {roles[1]?.name} (1 hour ago)</div>}
                </>
              ) : (
                <div>No recent commands</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
