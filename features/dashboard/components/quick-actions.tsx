import Link from "next/link";
import { Compass, FileBarChart, Users, Presentation } from "lucide-react";
import { Card } from "@/components/ui/card";

const actions = [
  { label: "New meeting", description: "Pitch a new idea to the board", href: "/meeting/new", icon: Compass },
  { label: "Reports", description: "Browse past board decisions", href: "/reports", icon: FileBarChart },
  { label: "Executives", description: "Manage your board's persona mix", href: "/executives", icon: Users },
  { label: "Pitch deck", description: "Generate a founder-ready deck", href: "/pitch-deck", icon: Presentation },
];

export function QuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => (
        <Link key={action.href} href={action.href}>
          <Card interactive className="flex h-full flex-col gap-3 p-4">
            <span className="flex size-9 items-center justify-center rounded-md border text-foreground">
              <action.icon className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">{action.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{action.description}</p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
