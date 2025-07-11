import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DatabaseSyncIssueProps {
  activityId: string;
  onRetry: (activityId: string) => void;
  isRetrying: boolean;
}

const DatabaseSyncIssue: React.FC<DatabaseSyncIssueProps> = ({ 
  activityId, 
  onRetry, 
  isRetrying 
}) => {
  return (
    <Alert className="border-orange-200 bg-orange-50 mb-4">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        <div className="flex justify-between items-start">
          <div>
            <strong>Sincronizzazione Database:</strong> La transazione blockchain è riuscita, 
            ma c'è stato un problema nell'aggiornamento del database locale. 
            L'attività è certificata on-chain ma potrebbe ancora apparire come "da certificare".
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onRetry(activityId)}
            disabled={isRetrying}
            className="ml-4 shrink-0"
          >
            {isRetrying ? (
              <RefreshCw className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <RefreshCw className="h-3 w-3 mr-1" />
            )}
            Riprova Sync
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DatabaseSyncIssue;