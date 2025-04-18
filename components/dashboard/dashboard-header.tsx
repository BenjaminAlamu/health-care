import { ModeToggle } from "@/components/ui/mode-toggle";
import { ActivitySquare } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <ActivitySquare className="h-6 w-6 text-primary" />
          <span className="text-lg">HealthBill Analytics</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}