import { ReturnRequest } from "../../types";

...

// Update status sent
onClick={() => updateReturnStatus(detailReturn.id, "received")}

...

// Comparison for received
{detailReturn.status === "received" && (
  <Button
    ...
</Button>
)}