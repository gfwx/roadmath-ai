//@ts-nocheck
"use client"
import { useState, useEffect } from "react";
import { FileWarning } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type Message =
  | { success: string }
  | { error: string }
  | { message: string };


export function FormMessage({ message }: { message: Message }) {
  if (message.error) {
    return (
      <Alert variant="destructive">
        <FileWarning className="h-4 w-4 my-auto" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message.error}</AlertDescription>
      </Alert>
    );
  }

  if (message.success) {
    return (
      <div className="flex flex-col gap-2 w-full max-w-md text-sm py-3 bg-muted px-4 rounded-sm">
        {message.success}
      </div>
    );
  }

  if (message.message) {
    return (
      <div className="flex flex-col gap-2 w-full max-w-md text-sm py-3 bg-muted px-4 rounded-sm">
        {message.message}
      </div>
    );
  }
}
