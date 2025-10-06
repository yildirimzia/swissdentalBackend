"use client";

import { Switch as HeadlessSwitch } from "@headlessui/react";
import { clsx } from "clsx";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <HeadlessSwitch.Group as="div" className="flex items-center gap-3">
      {label && <HeadlessSwitch.Label className="text-sm font-medium text-charcoal">{label}</HeadlessSwitch.Label>}
      <HeadlessSwitch
        checked={checked}
        onChange={onChange}
        className={clsx(
          "relative inline-flex h-6 w-11 items-center rounded-full transition",
          checked ? "bg-primary-500" : "bg-gray-200",
        )}
      >
        <span
          className={clsx(
            "inline-block h-5 w-5 transform rounded-full bg-white shadow transition",
            checked ? "translate-x-5" : "translate-x-1",
          )}
        />
      </HeadlessSwitch>
    </HeadlessSwitch.Group>
  );
}
