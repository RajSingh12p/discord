import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { discordApi, RoleMember } from "@/lib/discord";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function RoleMembersCard() {
  const [selectedRole, setSelectedRole] = useState<string>("");
  
  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ['/api/roles'],
  });
  
  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ['/api/roles', selectedRole, 'members'],
    queryFn: () => selectedRole ? discordApi.getRoleMembers(selectedRole) : Promise.resolve([]),
    enabled: !!selectedRole
  });
  
  // Auto-select first role when loaded
  useEffect(() => {
    if (roles && roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0].id);
    }
  }, [roles, selectedRole]);
  
  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
  };
  
  const getMemberStatusClass = (status: string) => {
    switch(status) {
      case 'sent': return 'bg-[#43B581]';
      case 'failed': return 'bg-[#ED4245]';
      case 'pending': return 'bg-[#FAA81A]';
      default: return 'bg-[#72767D]';
    }
  };
  
  const getMemberStatusText = (status: string) => {
    switch(status) {
      case 'sent': return 'DM Sent';
      case 'failed': return 'Failed';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };
  
  return (
    <Card className="bg-[#36393F] rounded-lg shadow-lg overflow-hidden border-[#2F3136]">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Role Members</h3>
        
        {/* Role Selection */}
        <div className="mb-4">
          {rolesLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger className="bg-[#1E1F22] text-white py-2 px-3 rounded-md w-full border border-[#2F3136]">
                <SelectValue placeholder="Select a role to view members" />
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
        </div>
        
        {/* Member List */}
        <div className="bg-[#1E1F22] rounded-md p-2 h-64 overflow-y-auto">
          {membersLoading || (selectedRole && !members) ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 rounded-md">
                <div className="flex items-center space-x-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))
          ) : !selectedRole ? (
            <div className="text-[#72767D] text-center py-4">Select a role to view members</div>
          ) : members && members.length > 0 ? (
            members.map((member, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 hover:bg-[#2F3136] rounded-md">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center text-white text-xs">
                    {member.avatarInitials}
                  </div>
                  <span className="text-white">{member.username}#{member.tag}</span>
                </div>
                <div className={cn(
                  "text-xs px-2 py-1 rounded-md",
                  getMemberStatusClass(member.status)
                )}>
                  {getMemberStatusText(member.status)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-[#72767D] text-center py-4">No members found for this role</div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="mt-4 flex justify-between">
          <span className="text-sm text-[#72767D]">
            {members ? `${members.length} members shown` : "0 members shown"}
          </span>
          <button className="text-[#5865F2] hover:underline text-sm">View All Members</button>
        </div>
      </CardContent>
    </Card>
  );
}
