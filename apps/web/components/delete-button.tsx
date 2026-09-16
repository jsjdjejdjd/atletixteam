"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui";

type Props = {
  tabla: "programs" | "weeks" | "workouts";
  id: string;
  label: string;
  confirmLabel: string;
  redirectTo?: string;
  className?: string;
};

export function DeleteButton({
  tabla,
  id,
  label,
  confirmLabel,
  redirectTo,
  className,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from(tabla).delete().eq("id", id);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    if (redirectTo) {
      router.push(redirectTo);
      router.refresh();
    } else {
      router.refresh();
    }
  }

  if (confirming) {
    return (
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">¿Seguro?</span>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Eliminando…" : confirmLabel}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setConfirming(false)}
            disabled={loading}
          >
            No
          </Button>
        </div>
        {error ? (
          <p className="text-xs text-red-300">{error}</p>
        ) : null}
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="danger"
      onClick={() => setConfirming(true)}
      className={className}
    >
      {label}
    </Button>
  );
}