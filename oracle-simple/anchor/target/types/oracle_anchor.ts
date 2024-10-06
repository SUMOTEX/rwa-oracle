/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/oracle_anchor.json`.
 */
export type OracleAnchor = {
  "address": "D4cJpMwYznwqVC1dT4ARA5egbAwaxqjbBgsAqWyetymC",
  "metadata": {
    "name": "oracleAnchor",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initializeOracle",
      "discriminator": [
        144,
        223,
        131,
        120,
        196,
        253,
        181,
        99
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "oracle",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  99,
                  108,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "initialValue",
          "type": "u64"
        },
        {
          "name": "requiredVerifications",
          "type": "u8"
        },
        {
          "name": "verifierCount",
          "type": "u8"
        }
      ]
    },
    {
      "name": "readLatestOracle",
      "discriminator": [
        150,
        208,
        25,
        41,
        251,
        106,
        206,
        235
      ],
      "accounts": [
        {
          "name": "oracle"
        }
      ],
      "args": []
    },
    {
      "name": "readOracleByRoundId",
      "discriminator": [
        2,
        150,
        129,
        121,
        157,
        159,
        88,
        208
      ],
      "accounts": [
        {
          "name": "oracle"
        }
      ],
      "args": [
        {
          "name": "roundId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateOracle",
      "discriminator": [
        112,
        41,
        209,
        18,
        248,
        226,
        252,
        188
      ],
      "accounts": [
        {
          "name": "oracle",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "newAssetValue",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "oracle",
      "discriminator": [
        139,
        194,
        131,
        179,
        140,
        179,
        229,
        244
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "roundIdOutOfBounds",
      "msg": "The provided round ID is out of bounds."
    }
  ],
  "types": [
    {
      "name": "oracle",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "assetValue",
            "type": "u64"
          },
          {
            "name": "verifiers",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "approvals",
            "type": {
              "vec": "bool"
            }
          },
          {
            "name": "requiredVerifications",
            "type": "u8"
          },
          {
            "name": "history",
            "type": {
              "vec": {
                "defined": {
                  "name": "oracleHistoryEntry"
                }
              }
            }
          },
          {
            "name": "roundIdCounter",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "oracleHistoryEntry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "roundId",
            "type": "u64"
          },
          {
            "name": "assetValue",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
