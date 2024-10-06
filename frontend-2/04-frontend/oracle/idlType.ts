/**
 * Program IDL in camelCase format to be used in JS/TS.
 *
 * Note: This is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/oracle.json`.
 */
export type Oracle = {
    address: "9Jpt9v437CvovhwRGjdp4ppdWER7rTSvXknyDyjePXLd"; // Replace with actual program address
    metadata: {
      name: "oracle";
      version: "0.1.0";
      spec: "0.1.0";
      description: "Oracle Program";
    };
    instructions: [
      {
        name: "initializeOracle";
        discriminator: [175, 123, 89, 49, 23, 98, 11, 31];
        accounts: [
          {
            name: "oracleAccount";
            writable: true;
            signer: false;
          },
          {
            name: "payer";
            writable: true;
            signer: true;
          },
          {
            name: "systemProgram";
            address: "11111111111111111111111111111111";
          }
        ];
        args: [
          {
            name: "initialValue";
            type: "u64";
          },
          {
            name: "verifiers";
            type: { vec: "publicKey" };
          },
          {
            name: "requiredVerifications";
            type: "u8";
          }
        ];
      },
      {
        name: "updateOracle";
        discriminator: [33, 23, 100, 29, 91, 174, 122, 13];
        accounts: [
          {
            name: "oracleAccount";
            writable: true;
            signer: false;
          },
          {
            name: "payer";
            writable: false;
            signer: true;
          }
        ];
        args: [
          {
            name: "newValue";
            type: "u64";
          }
        ];
      }
    ];
    accounts: [
      {
        name: "oracleAccount";
        discriminator: [189, 77, 35, 150, 255, 145, 13, 2];
      }
    ];
    types: [
      {
        name: "OracleAccount";
        type: {
          kind: "struct";
          fields: [
            {
              name: "assetValue";
              type: "u64";
            },
            {
              name: "verifiers";
              type: { vec: "publicKey" };
            },
            {
              name: "approvals";
              type: { vec: "bool" };
            },
            {
              name: "requiredVerifications";
              type: "u8";
            },
            {
              name: "history";
              type: {
                vec: {
                  kind: "struct";
                  fields: [
                    { name: "assetValue", type: "u64" },
                    { name: "timestamp", type: "u64" }
                  ]
                }
              };
            }
          ];
        };
      }
    ];
  };
  