"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function StaffSettingsPage() {
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-white italic">STAFF PROFILE</h1>

      <Card className="bg-slate-900 border-slate-800 text-white rounded-3xl">
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">
              Email Address
            </label>
            <Input
              disabled
              defaultValue="staff@netra.com"
              className="bg-slate-800 border-slate-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">
              Employee Role
            </label>
            <Input
              disabled
              defaultValue="Data Entry Staff"
              className="bg-slate-800 border-slate-700"
            />
          </div>
          <hr className="border-slate-800 my-4" />
          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">
              Change Password
            </label>
            <Input
              type="password"
              placeholder="Enter new password"
              className="bg-slate-800 border-slate-700"
            />
          </div>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl"
            onClick={() => toast.success("Profile updated!")}
          >
            Update Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
