import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { discordApi } from "@/lib/discord";
import { useToast } from "@/hooks/use-toast";

export function ConfigCard() {
  const { toast } = useToast();
  
  const [showToken, setShowToken] = useState(false);
  const [port, setPort] = useState("10000");
  const [prefix, setPrefix] = useState("!");
  const [logLevel, setLogLevel] = useState("info");
  const [originalValues, setOriginalValues] = useState({
    port: "10000",
    prefix: "!",
    logLevel: "info"
  });
  
  // Reset to original values
  const resetForm = () => {
    setPort(originalValues.port);
    setPrefix(originalValues.prefix);
    setLogLevel(originalValues.logLevel);
  };
  
  // Determine if form has changed
  const hasFormChanged = () => {
    return port !== originalValues.port ||
      prefix !== originalValues.prefix ||
      logLevel !== originalValues.logLevel;
  };
  
  const updateConfigMutation = useMutation({
    mutationFn: (config: {
      port: string;
      prefix: string;
      logLevel: string;
    }) => discordApi.updateConfig(config),
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Configuration Updated",
          description: "Bot configuration has been updated successfully",
        });
        // Update original values to reflect the new state
        setOriginalValues({
          port,
          prefix,
          logLevel
        });
      } else {
        toast({
          title: "Failed to update configuration",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update configuration: " + String(error),
        variant: "destructive",
      });
    }
  });
  
  const handleSaveChanges = () => {
    updateConfigMutation.mutate({
      port,
      prefix,
      logLevel
    });
  };
  
  return (
    <Card className="bg-[#36393F] rounded-lg shadow-lg overflow-hidden border-[#2F3136]">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Environment Configuration</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-[#72767D] text-sm mb-1">Discord Token</label>
            <div className="flex">
              <Input 
                type={showToken ? "text" : "password"} 
                value="••••••••••••••••••••••••••••••" 
                disabled
                className="bg-[#1E1F22] text-white py-2 px-3 rounded-l-md flex-1 border border-[#2F3136] border-r-0"
              />
              <Button
                type="button"
                variant="outline"
                className="px-3 py-2 bg-[#2F3136] hover:bg-[#1E1F22] text-white rounded-r-md border border-[#2F3136]"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-[#72767D] text-sm mb-1">Server Port</label>
            <Input 
              type="text" 
              value={port} 
              onChange={(e) => setPort(e.target.value)}
              className="bg-[#1E1F22] text-white py-2 px-3 rounded-md w-full border border-[#2F3136]"
            />
          </div>
          
          <div>
            <label className="block text-[#72767D] text-sm mb-1">Command Prefix</label>
            <Input 
              type="text" 
              value={prefix} 
              onChange={(e) => setPrefix(e.target.value)}
              className="bg-[#1E1F22] text-white py-2 px-3 rounded-md w-full border border-[#2F3136]"
            />
          </div>
          
          <div>
            <label className="block text-[#72767D] text-sm mb-1">Log Level</label>
            <Select value={logLevel} onValueChange={setLogLevel}>
              <SelectTrigger className="bg-[#1E1F22] text-white py-2 px-3 rounded-md w-full border border-[#2F3136]">
                <SelectValue placeholder="Select log level" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E1F22] text-white border-[#2F3136]">
                <SelectItem value="info">info</SelectItem>
                <SelectItem value="debug">debug</SelectItem>
                <SelectItem value="warn">warn</SelectItem>
                <SelectItem value="error">error</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-2 flex justify-end space-x-3">
            <Button 
              variant="outline"
              className="px-4 py-2 bg-[#2F3136] hover:bg-[#1E1F22] text-white rounded-md border-[#1E1F22]"
              onClick={resetForm}
              disabled={!hasFormChanged() || updateConfigMutation.isPending}
            >
              Reset
            </Button>
            <Button 
              className="px-4 py-2 bg-[#5865F2] hover:bg-opacity-80 text-white rounded-md"
              onClick={handleSaveChanges}
              disabled={!hasFormChanged() || updateConfigMutation.isPending}
            >
              {updateConfigMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
