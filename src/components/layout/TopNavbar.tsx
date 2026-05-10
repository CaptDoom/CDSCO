import { Search, Clock, HelpCircle } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { NotificationsPanel } from "./NotificationsPanel";
import { SettingsDialog } from "./SettingsDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";

export function TopNavbar() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-72 h-16 z-50 flex justify-between items-center px-8 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_8px_#46f1c5]" />
          <h1 className="font-display text-2xl font-black tracking-tighter text-slate-900 group cursor-default">
            REGULATORY <span className="text-primary font-black ml-1">SENTINEL</span>
          </h1>
        </div>
        <div className="hidden md:flex ml-4 bg-slate-50 rounded-full px-5 py-2 items-center gap-3 border border-slate-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-300">
          <Search className="size-4 text-primary" />
          <input 
            className="bg-transparent border-none focus:ring-0 text-sm w-72 placeholder:text-slate-500 font-medium outline-none" 
            placeholder="Search regulatory filings..." 
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 border-r border-slate-100 pr-4 mr-2">
           <Clock className="size-3.5 text-primary/70" />
           <span className="text-[10px] font-mono font-black tracking-tighter tabular-nums text-slate-700">
             {currentTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })} IST
           </span>
        </div>
        
        <NotificationsPanel />
        <SettingsDialog />
        
        <Popover>
          <PopoverTrigger
            render={
              <Button variant="ghost" size="icon" className="group">
                <HelpCircle className="size-5 text-slate-500 group-hover:text-secondary" />
              </Button>
            }
          />
          <PopoverContent className="w-64 p-4" align="end">
            <h3 className="font-bold text-sm mb-2">RegVision Help</h3>
            <p className="text-[11px] text-slate-500 mb-3">
              Need assistance with regulatory filings or SAE reporting? Our AI assistant is here to help.
            </p>
            <Button size="sm" className="w-full text-[10px] uppercase font-black tracking-widest">
              Contact Support
            </Button>
          </PopoverContent>
        </Popover>
        
        <UserMenu />
      </div>
    </header>
  );
}
