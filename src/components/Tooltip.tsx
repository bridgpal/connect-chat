import * as React from "react";
import { Tooltip as RadixTooltip } from "radix-ui";

interface SharedTooltipProps {
  title: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

export const Tooltip: React.FC<SharedTooltipProps> = ({
  title,
  children,
  side = "top",
}) => {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            sideOffset={2}
            side={side}
            className="rounded-md px-3 py-2 text-sm text-white bg-black"
          >
            {title}
            <RadixTooltip.Arrow className="fill-black" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};
