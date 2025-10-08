"use client";

import { Fragment } from "react";
import { Dialog as HeadlessDialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  full: "max-w-7xl",
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  size = "lg",
}: DialogProps) {
  return (
    <Transition show={open} as={Fragment}>
      <HeadlessDialog onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        {/* Full-screen container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <HeadlessDialog.Panel
                className={clsx(
                  "w-full transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all",
                  sizeClasses[size]
                )}
              >
                {/* Header */}
                {(title || description) && (
                  <div className="border-b border-gray-100 bg-gradient-to-r from-primary-50 to-mint-pale/30 px-6 py-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {title && (
                          <HeadlessDialog.Title className="text-xl font-bold text-charcoal flex items-center gap-2">
                            {title}
                          </HeadlessDialog.Title>
                        )}
                        {description && (
                          <HeadlessDialog.Description className="mt-2 text-sm text-gray-600">
                            {description}
                          </HeadlessDialog.Description>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={onClose}
                        className="ml-4 rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="px-6 py-6">{children}</div>
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  );
}
