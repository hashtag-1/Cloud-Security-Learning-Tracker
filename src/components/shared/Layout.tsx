"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Map,
  BookOpen,
  FlaskConical,
  FolderOpen,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/study", label: "Study Log", icon: BookOpen },
  { href: "/labs", label: "Labs", icon: FlaskConical },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/notes", label: "Knowledge Base", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-card flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-lg font-bold">CSTL</span>
        </Link>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t space-y-1">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
            pathname === "/settings"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        {session && (
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        )}
      </div>
    </aside>
  );
}

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between border-b bg-card px-6 py-3 sticky top-0 z-10">
      <div className="text-sm text-muted-foreground">
        Cloud Security Learning Tracker
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">
          {session?.user?.name || "User"}
        </span>
      </div>
    </header>
  );
}

function PageLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default PageLayout;
