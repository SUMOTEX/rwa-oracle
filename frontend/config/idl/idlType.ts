export type Oracle = {
  version: "0.1.0"; // Version of the IDL
  name: "oracle_anchor"; // Name of the program
  address: string; // Program address (This is missing in your current definition)
  metadata: {
    name: string; // Name of the program (could match `oracle_anchor`)
    version: string; // Version of the program or IDL
    spec: string; // Specification version
    description: string; // A description for the program
  };
  instructions: Array<{
    name: "initialize_oracle" | "read_latest_oracle" | "update_oracle" | "read_oracle_by_round_id";
    accounts: Array<{
      name: string;
      isMut: boolean;
      isSigner: boolean;
    }>;
    args: Array<{
      name: string;
      type: "u64" | "u8";
    }>;
  }>;
  accounts: Array<{
    name: "Oracle";
    type: {
      kind: "struct";
      fields: Array<{
        name: "asset_value" | "verifiers" | "approvals" | "required_verifications" | "history";
        type: string | { vec: string } | { vec: { defined: string } };
      }>;
    };
  }>;
  types: Array<{
    name: "OracleHistoryEntry";
    type: {
      kind: "struct";
      fields: Array<{
        name: "round_id" | "asset_value" | "timestamp";
        type: "u64";
      }>;
    };
  }>;
  errors: Array<{
    code: number;
    name: string;
    msg: string;
  }>;
};
