import React from "react";
import { Settings, Globe, Shield, Bell, User, Server } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SettingsDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" className="group">
            <Settings className="size-5 text-slate-500 group-hover:rotate-45 transition-transform" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="flex h-[450px]">
          <div className="w-1/3 bg-slate-50 border-r border-slate-200 p-4 pt-10">
            <h2 className="text-xl font-bold mb-6 px-2">Settings</h2>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start gap-3 bg-white shadow-sm border border-slate-200">
                <User className="size-4 text-primary" />
                <span className="text-sm font-medium">Account</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Shield className="size-4 text-slate-400" />
                <span className="text-sm font-medium">Security</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Bell className="size-4 text-slate-400" />
                <span className="text-sm font-medium">Alerts</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Globe className="size-4 text-slate-400" />
                <span className="text-sm font-medium">Region</span>
              </Button>
            </div>
          </div>
          
          <div className="flex-1 p-8 pt-10 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-4">Account Configuration</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-1">Official Role</p>
                    <p className="text-sm font-bold">Central Regulatory Officer (Admin)</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-1">Assigned Region</p>
                    <p className="text-sm font-bold">New Delhi HQ (Zone A)</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-4">System Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                    <span className="text-sm font-medium">Enable AI Auto-Audit</span>
                    <div className="w-10 h-5 bg-primary rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 size-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                    <span className="text-sm font-medium">Real-time Stream Sync</span>
                    <div className="w-10 h-5 bg-primary rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 size-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
