"use client";

import { useCallback, useSyncExternalStore } from "react";

import { customers as customersSeed } from "@/data/customers";
import { vendors as vendorsSeed } from "@/data/vendors";
import { invoices as invoicesSeed } from "@/data/salesDocuments";
import { accounts as accountsSeed } from "@/data/accounts";
import { payments as paymentsSeed } from "@/data/payments";
import { orders as ordersSeed } from "@/data/orders";
import { employees as employeesSeed } from "@/data/employees";
import { payrollRuns as payrollSeed } from "@/data/payroll";
import { bankTxns as bankTxnsSeed } from "@/data/banking";

/**
 * A tiny client-side persistence layer. It seeds collections from the static
 * mock data, persists every change to localStorage, and exposes them through
 * `useSyncExternalStore` so reads are SSR-safe (server + first paint use the
 * seed, then the client hydrates from localStorage) and writes never use
 * setState-in-effect (which the react-compiler lint rule forbids).
 */

export type CollectionKey =
  | "customers"
  | "vendors"
  | "invoices"
  | "bills"
  | "accounts"
  | "payments"
  | "orders"
  | "employees"
  | "payroll"
  | "bankTxns";

type Store = Record<CollectionKey, unknown[]>;

const SEED: Store = {
  customers: customersSeed,
  vendors: vendorsSeed,
  invoices: invoicesSeed,
  bills: [],
  accounts: accountsSeed,
  payments: paymentsSeed,
  orders: ordersSeed,
  employees: employeesSeed,
  payroll: payrollSeed,
  bankTxns: bankTxnsSeed,
};

const STORAGE_KEY = "bftf-data-v1";

// Clone the seed so `memory` never aliases the imported seed arrays — keeps the
// pristine seed safe even if a future mutation ever writes in place.
function freshSeed(): Store {
  return Object.fromEntries(
    (Object.entries(SEED) as [CollectionKey, unknown[]][]).map(([k, v]) => [k, [...v]])
  ) as Store;
}

let memory: Store = freshSeed();
let initialized = false;
const listeners = new Set<() => void>();

function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<Store>;
      memory = { ...freshSeed(), ...saved };
    }
  } catch {
    /* corrupt/unavailable storage — fall back to seed */
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } catch {
    /* ignore quota/private-mode errors */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): Store {
  ensureInit();
  return memory;
}

function getServerSnapshot(): Store {
  return SEED;
}

function setCollection(key: CollectionKey, rows: unknown[]) {
  memory = { ...memory, [key]: rows };
  persist();
  emit();
}

/** Replace the entire store with the original seed data. */
export function resetStore() {
  memory = freshSeed();
  persist();
  emit();
}

export function useCollection<T>(key: CollectionKey) {
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const items = (store[key] ?? []) as T[];

  const setItems = useCallback(
    (rows: T[]) => setCollection(key, rows as unknown[]),
    [key]
  );

  // Prepend a new record so it appears at the top of the list.
  const add = useCallback(
    (item: T) => setCollection(key, [item, ...(memory[key] as T[])]),
    [key]
  );

  // Remove by object identity (callers hold the row reference).
  const remove = useCallback(
    (item: T) =>
      setCollection(
        key,
        (memory[key] as T[]).filter((x) => x !== item)
      ),
    [key]
  );

  // Replace a row (by identity) with a patched copy.
  const update = useCallback(
    (item: T, patch: Partial<T>) =>
      setCollection(
        key,
        (memory[key] as T[]).map((x) => (x === item ? { ...x, ...patch } : x))
      ),
    [key]
  );

  return { items, setItems, add, remove, update };
}
