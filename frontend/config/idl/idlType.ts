export type Oracle = {
  version: "0.1.0";
  name: "oracle_anchor";
  instructions: Array<{
    name: "initialize_oracle" | "read_oracle" | "update_oracle";
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
        name: "asset_value" | "timestamp";
        type: "u64";
      }>;
    };
  }>;
};
