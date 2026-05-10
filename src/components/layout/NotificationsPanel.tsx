import { Bell, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const NOTIFICATIONS = [
  {
    id: 1,
    title: "SAE Reported",
    description: "New adverse event from AIIMS Delhi requires urgent audit.",
    type: "critical",
    time: "2 mins ago"
  },
  {
    id: 2,
    title: "Licensing Approval",
    description: "Vaccine Batch #778 has passed Phase III validation.",
    type: "success",
    time: "1 hour ago"
  },
  {
    id: 3,
    title: "System Update",
    description: "Compliance Oversight Node v4.3 deployment scheduled.",
    type: "info",
    time: "3 hours ago"
  }
];

export function NotificationsPanel() {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon" className="relative group">
            <Bell className="size-5 text-slate-700 group-hover:text-primary transition-colors" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm" />
          </Button>
        }
      />
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-bold text-sm">Notifications</h3>
          <Badge variant="secondary" className="text-[10px]">3 New</Badge>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {NOTIFICATIONS.map((n) => (
            <div key={n.id} className="p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex gap-3">
                <div className={`mt-1 size-2 rounded-full shrink-0 ${
                  n.type === 'critical' ? 'bg-red-500' : 
                  n.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                }`} />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-900">{n.title}</p>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{n.description}</p>
                  <p className="text-[10px] text-slate-700 font-bold">{n.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-slate-50/50 border-t border-slate-100">
          <Button variant="ghost" className="w-full text-[10px] uppercase tracking-widest font-black h-8">
            View All Notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
