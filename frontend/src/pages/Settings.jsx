import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { useTheme } from "@/providers/ThemeProvider.jsx";
import { Settings as SettingsIcon, Palette, Bell, Shield, User, Moon, Sun, Mail, Smartphone, MessageSquare, Check, Sparkles } from "lucide-react";

export default function Settings() {
  const { theme, palette, setTheme, setPalette } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  });

  const palettes = [
    { id: "aurora", name: "Aurora", description: "Purple-pink cosmic vibes", colors: ["#8B5CF6", "#EC4899", "#F97316"] },
    { id: "sunset", name: "Sunset", description: "Warm orange-red energy", colors: ["#F97316", "#EF4444", "#FACC15"] },
    { id: "ocean", name: "Ocean", description: "Blue-teal depths", colors: ["#3B82F6", "#06B6D4", "#10B981"] },
    { id: "forest", name: "Forest", description: "Green-emerald nature", colors: ["#10B981", "#059669", "#84CC16"] },
    { id: "cosmic", name: "Cosmic", description: "Deep space purples", colors: ["#7C3AED", "#C026D3", "#EC4899"] },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent via-primary to-accent p-10 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl">
              <SettingsIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Settings</h1>
              <p className="text-lg text-white/90 mt-1">
                Customize your RecruitXchange experience
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appearance Card */}
          <Card className="bg-gradient-glass border-primary/20 backdrop-blur-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
                  <Palette className="w-5 h-5 text-primary" />
                </div>
                Appearance
              </CardTitle>
              <CardDescription>Customize colors and theme to match your style</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                <div className="space-y-1">
                  <Label className="text-sm font-semibold">Theme Mode</Label>
                  <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
                </div>
                <div className="flex items-center gap-3">
                  <Sun className="w-4 h-4 text-muted-foreground" />
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                  <Moon className="w-4 h-4 text-primary" />
                </div>
              </div>

              {/* Color Palette Picker */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold">Color Palette</Label>
                  <p className="text-xs text-muted-foreground mt-1">Choose your preferred color scheme</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {palettes.map((paletteOption) => (
                    <div
                      key={paletteOption.id}
                      className={`group p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        palette === paletteOption.id
                          ? "border-primary bg-gradient-to-br from-primary/10 to-accent/10 shadow-lg shadow-primary/20"
                          : "border-border/50 bg-gradient-glass/50 hover:border-primary/30 hover:shadow-md"
                      }`}
                      onClick={() => setPalette(paletteOption.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-base">{paletteOption.name}</h4>
                          <p className="text-xs text-muted-foreground">{paletteOption.description}</p>
                        </div>
                        {palette === paletteOption.id && (
                          <div className="w-6 h-6 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {paletteOption.colors.map((color, index) => (
                          <div
                            key={index}
                            className="flex-1 h-10 rounded-lg border border-border/50 shadow-sm transition-transform duration-300 group-hover:scale-105"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Card */}
          <Card className="bg-gradient-glass border-accent/20 backdrop-blur-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg">
                  <Bell className="w-5 h-5 text-accent" />
                </div>
                Notifications
              </CardTitle>
              <CardDescription>Manage how you receive updates and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "email", label: "Email Notifications", desc: "Receive updates via email", icon: Mail },
                { key: "push", label: "Push Notifications", desc: "Get real-time alerts on your device", icon: Bell },
                { key: "sms", label: "SMS Notifications", desc: "Text messages for important updates", icon: Smartphone },
                { key: "marketing", label: "Marketing Updates", desc: "News and promotional content", icon: MessageSquare },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold cursor-pointer">{item.label}</Label>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Account Stats */}
          <Card className="bg-gradient-glass border-primary/20 backdrop-blur-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Account Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Member Since", value: "Jan 2024" },
                { label: "Profile Views", value: "1,234" },
                { label: "Applications", value: "12" },
                { label: "Success Rate", value: "87%" },
              ].map((stat, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <span className="text-sm font-semibold">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="bg-gradient-glass border-warning/20 backdrop-blur-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-warning" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" size="sm">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                Two-Factor Auth
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                Privacy Settings
              </Button>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="bg-gradient-glass border-destructive/20 backdrop-blur-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10" size="sm">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}