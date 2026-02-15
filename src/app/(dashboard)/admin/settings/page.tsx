"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function SettingsPage() {
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-white italic">ACCOUNT SETTINGS</h1>

      <Card className="bg-slate-900 border-slate-800 text-white rounded-3xl">
        <CardHeader>
          <CardTitle className="text-lg">Update Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-bold">
              Email Address
            </label>
            <Input
              disabled
              defaultValue="admin@netra.com"
              className="bg-slate-800 border-slate-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-bold">
              New Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              className="bg-slate-800 border-slate-700"
            />
          </div>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => toast.success("Settings saved!")}
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
