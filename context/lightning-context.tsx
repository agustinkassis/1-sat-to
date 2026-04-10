'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

import { convertToSatoshis, generateLightningInvoice } from '@/lib/lightning';

// ---- Types ----
type Status = 'idle' | 'loading' | 'pending' | 'paid' | 'error';

interface LightningState {
  amount: number;
  invoice: string | null;
  verify: string | null;
  status: Status;
  isPaid: boolean;
  error: string | null;
}

interface LightningContextValue extends LightningState {
  createInvoice: (amount: number, currency: string) => Promise<void>;
  clearInvoice: () => void;
}

// ---- Initial State ----
const INITIAL_STATE: LightningState = {
  amount: 0,
  invoice: null,
  verify: null,
  status: 'idle',
  isPaid: false,
  error: null,
};

// ---- Context ----
const LightningContext = createContext<LightningContextValue | null>(null);

// ---- Provider ----
interface LightningProviderProps {
  children: React.ReactNode;
  lnAddress: string;
  pollingInterval?: number;
}

export function LightningProvider({ children, lnAddress, pollingInterval = 1200 }: LightningProviderProps) {
  const [state, setState] = useState<LightningState>(INITIAL_STATE);

  // Ref para evitar polling si el componente se desmonta
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ---- Helpers ----
  const clearPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const updateState = useCallback((partial: Partial<LightningState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  // ---- Polling ----
  useEffect(() => {
    const { invoice, verify, isPaid } = state;

    // No hay nada que verificar
    if (!invoice || !verify || isPaid) return;

    intervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(verify);

        if (!response.ok) {
          throw new Error(`Polling failed with status: ${response.status}`);
        }

        const data: { settled: boolean } = await response.json();

        if (data?.settled) {
          clearPolling();
          updateState({ isPaid: true, status: 'paid' });
        }
      } catch (err: unknown) {
        clearPolling();
        updateState({
          status: 'error',
          error: err instanceof Error ? err.message : 'Error polling response',
        });
      }
    }, pollingInterval);

    return () => clearPolling();
  }, [state.invoice, state.verify, state.isPaid]);

  // ---- Actions ----
  const createInvoice = useCallback(
    async (amount: number, currency: string) => {
      // Limpiamos estado previo antes de generar
      clearPolling();
      updateState({ ...INITIAL_STATE, status: 'loading' });

      try {
        const valueInSats = await convertToSatoshis(amount, currency);
        const data = await generateLightningInvoice(lnAddress, valueInSats);

        if (!data.pr) {
          throw new Error('The wallet provider does not support generating Lightning payments.');
        }

        if (!data.verify) {
          throw new Error('The wallet provider does not support validating Lightning payments.');
        }

        updateState({
          amount: valueInSats,
          invoice: data.pr,
          verify: data.verify,
          status: 'pending',
          error: null,
        });
      } catch (err: unknown) {
        updateState({
          status: 'error',
          error: err instanceof Error ? err.message : 'Error generating invoice',
        });
      }
    },
    [lnAddress, clearPolling, updateState],
  );

  const clearInvoice = useCallback(() => {
    clearPolling();
    setState(INITIAL_STATE);
  }, [clearPolling]);

  // ---- Cleanup on unmount ----
  useEffect(() => {
    return () => clearPolling();
  }, []);

  const value: LightningContextValue = {
    ...state,
    createInvoice,
    clearInvoice,
  };

  return <LightningContext.Provider value={value}>{children}</LightningContext.Provider>;
}

// ---- Hook ----
export function useLightning(): LightningContextValue {
  const context = useContext(LightningContext);

  if (!context) {
    throw new Error('useLightning must be used within a <LightningProvider />');
  }

  return context;
}
