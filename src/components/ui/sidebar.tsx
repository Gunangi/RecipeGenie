"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { PanelLeft, PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const sidebarVariants = cva(
  "hidden md:flex md:flex-col md:border-r md:bg-card md:text-card-foreground transition-all duration-300 ease-in-out",
  {
    variants: {
      state: {
        open: "md:w-64",
        closed: "md:w-16",
      },
    },
    defaultVariants: {
      state: "open",
    },
  }
)

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, isOpen, children, ...props }, ref) => {
    const state = isOpen ? "open" : "closed";

    return (
      <div
        ref={ref}
        className={cn(sidebarVariants({ state }), className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

interface SidebarTriggerProps extends ButtonProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, isOpen, setIsOpen, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("hidden md:inline-flex", className)}
        onClick={() => setIsOpen((prev) => !prev)}
        {...props}
      >
        {isOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    )
  }
)
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "flex-grow overflow-y-auto",
                className
            )}
            {...props}
        />
    )
})
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "mt-auto border-t p-4",
                className
            )}
            {...props}
        />
    )
})
SidebarFooter.displayName = "SidebarFooter"

const MobileSidebar = ({ className, children }: React.HTMLAttributes<HTMLDivElement>) => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <PanelLeft />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className={cn("w-64 bg-card p-0", className)}>
        <div className="flex h-full flex-col">{children}</div>
      </SheetContent>
    </Sheet>
)
MobileSidebar.displayName = "MobileSidebar"

export {
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
  MobileSidebar,
}