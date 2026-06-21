"use client";

import { useState, type FormEvent } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const labelCls = "text-sm font-medium text-fg-soft";
const inputCls =
  "bg-canvas border border-line rounded-xl px-3 py-2 text-sm text-fg outline-none focus:border-bronze transition";

export default function CreateAccountModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Account"
      description="Add a new ledger to your chart of accounts."
    >
      <form id="create-account-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="acc-code" className={labelCls}>
              Account Code
            </label>
            <input id="acc-code" type="text" placeholder="e.g. 1008" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="acc-type" className={labelCls}>
              Type
            </label>
            <select id="acc-type" className={inputCls} defaultValue="Asset">
              <option value="Asset">Asset</option>
              <option value="Liability">Liability</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="acc-name" className={labelCls}>
            Account Name
          </label>
          <input
            id="acc-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Office Supplies"
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="acc-subtype" className={labelCls}>
            Subtype
          </label>
          <input id="acc-subtype" type="text" placeholder="e.g. Current Assets" className={inputCls} />
        </div>
      </form>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="bronze" type="submit" form="create-account-form" disabled={name.trim() === ""}>
          Create Account
        </Button>
      </div>
    </Modal>
  );
}
