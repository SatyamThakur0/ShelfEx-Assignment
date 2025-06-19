import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

function Popover({ children, ...props }) {
    return <PopoverPrimitive.Root {...props}>{children}</PopoverPrimitive.Root>;
}

Popover.Trigger = function PopoverTrigger({ children, ...props }) {
    return (
        <PopoverPrimitive.Trigger asChild {...props}>
            {children}
        </PopoverPrimitive.Trigger>
    );
};

Popover.Content = function PopoverContent({ className, children, ...props }) {
    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
                sideOffset={8}
                className={cn(
                    "z-50 min-w-[8rem] rounded-md border bg-white p-2 shadow-lg outline-none animate-in fade-in-0 zoom-in-95",
                    className
                )}
                {...props}
            >
                {children}
            </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
    );
};

export { Popover };
