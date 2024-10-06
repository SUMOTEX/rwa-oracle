'use client';

import {
  getOracleSimpleProgram,
  getOracleSimpleProgramId,
} from '@oracle-simple/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useOracleSimpleProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getOracleSimpleProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getOracleSimpleProgram(provider);

  const accounts = useQuery({
    queryKey: ['oracle-simple', 'all', { cluster }],
    queryFn: () => program.account.oracleSimple.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['oracle-simple', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ oracleSimple: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useOracleSimpleProgramAccount({
  account,
}: {
  account: PublicKey;
}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useOracleSimpleProgram();

  const accountQuery = useQuery({
    queryKey: ['oracle-simple', 'fetch', { cluster, account }],
    queryFn: () => program.account.oracleSimple.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['oracle-simple', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ oracleSimple: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['oracle-simple', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ oracleSimple: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['oracle-simple', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ oracleSimple: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['oracle-simple', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ oracleSimple: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}
