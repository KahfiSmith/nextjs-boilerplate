"use client";

import { useSessions } from "@/hooks/auth";
import { Button } from "@/components/ui";

export function SessionsManager() {
  const {
    sessions,
    isLoading,
    revokeSession,
    isRevokingSession,
    revokeOtherSessions,
    isRevokingOtherSessions,
  } = useSessions();

  if (isLoading) {
    return <p className="text-xs text-muted-foreground">Loading active sessions...</p>;
  }

  if (!sessions.length) {
    return null;
  }

  const hasOtherSessions = sessions.some((s) => !s.current);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Active Sessions</h2>
        {hasOtherSessions && (
          <Button
            disabled={isRevokingOtherSessions}
            onClick={() => revokeOtherSessions()}
            size="sm"
            variant="outline"
          >
            {isRevokingOtherSessions ? "Revoking..." : "Revoke other sessions"}
          </Button>
        )}
      </div>

      <ul className="divide-y rounded-lg border text-xs">
        {sessions.map((s) => (
          <li className="flex items-center justify-between p-3" key={s.session_id}>
            <div className="space-y-0.5">
              <p className="font-medium text-foreground">
                {s.user_agent || "Unknown browser"}
                {s.current && (
                  <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 font-normal text-primary">
                    Current session
                  </span>
                )}
              </p>
              <p className="text-muted-foreground">
                IP: {s.ip_address || "Unknown"} • Last active:{" "}
                {new Date(s.last_used_at).toLocaleString()}
              </p>
            </div>
            {!s.current && (
              <Button
                disabled={isRevokingSession}
                onClick={() => revokeSession(s.session_id)}
                size="sm"
                variant="ghost"
              >
                Revoke
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
