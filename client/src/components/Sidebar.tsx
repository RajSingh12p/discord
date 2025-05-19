import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  History, 
  Settings,
  X 
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const [location] = useLocation();
  
  const { data: botStatus } = useQuery({
    queryKey: ['/api/bot/status'],
    refetchInterval: 10000, // Refresh status every 10 seconds
  });
  
  const isOnline = botStatus?.status === 'online';
  
  const navItems = [
    { 
      href: "/", 
      label: "Dashboard", 
      icon: LayoutDashboard 
    },
    { 
      href: "/messages", 
      label: "Messages", 
      icon: MessageSquare 
    },
    { 
      href: "/roles", 
      label: "Roles", 
      icon: Users 
    },
    { 
      href: "/logs", 
      label: "Logs", 
      icon: History 
    },
    { 
      href: "/settings", 
      label: "Settings", 
      icon: Settings 
    }
  ];
  
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Bot Logo & Name */}
      <div className="p-4 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center text-white">
          <i className="ri-robot-fill text-xl"></i>
        </div>
        <h1 className="hidden md:block text-white font-bold text-lg">DM Bot</h1>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            onClick={onClose}
          >
            <a 
              className={cn(
                "flex items-center p-2 rounded-md group",
                location === item.href 
                  ? "bg-[#5865F2] text-white" 
                  : "text-[#72767D] hover:bg-[#36393F] hover:text-white"
              )}
            >
              <item.icon className="text-xl h-5 w-5" />
              <span className="ml-3 hidden md:block">{item.label}</span>
            </a>
          </Link>
        ))}
      </nav>
      
      {/* Bot Status */}
      <div className="p-4 border-t border-[#36393F]">
        <div className="flex items-center space-x-2">
          <div className={cn(
            "w-3 h-3 rounded-full",
            isOnline ? "bg-[#43B581]" : "bg-[#ED4245]"
          )}></div>
          <span className="text-sm hidden md:block">
            Bot {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="w-16 md:w-64 bg-[#1E1F22] flex-shrink-0 hidden md:block">
        {sidebarContent}
      </div>
      
      {/* Mobile Sidebar as Sheet */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 w-64 bg-[#1E1F22] border-[#36393F]">
          <button 
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
}
