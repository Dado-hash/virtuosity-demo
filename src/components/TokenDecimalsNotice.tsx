import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const TokenDecimalsNotice = () => {
  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        <strong>Nota Temporanea:</strong> A causa di un bug nei decimali ERC20, i token appaiono con valori molto piccoli su PolygonScan. 
        Stiamo preparando un nuovo deploy del contratto per risolvere il problema. 
        I token sono comunque correttamente assegnati e visibili nell'app.
      </AlertDescription>
    </Alert>
  );
};

export default TokenDecimalsNotice;
