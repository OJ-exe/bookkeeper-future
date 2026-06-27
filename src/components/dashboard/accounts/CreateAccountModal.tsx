"use client";

import { useState, type FormEvent } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { Account, AccountType } from "@/data/accounts";

const labelCls = "text-sm font-medium text-fg-soft";
const inputCls =
  "bg-canvas border border-line rounded-xl px-3 py-2 text-sm text-fg outline-none focus:border-bronze transition";

export default function CreateAccountModal({
  open,
  onClose,
  onCreate,
  editing,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (account: Account) => void;
  editing?: Account | null;
  onUpdate?: (item: Account, patch: Partial<Account>) => void;
}) {
  const isEdit = !!editing;
  const [code, setCode] = useState(editing?.code ?? "");
  const [name, setName] = useState(editing?.name ?? "");
  const [type, setType] = useState<AccountType>(editing?.type ?? "Asset");
  const [subtype, setSubtype] = useState(editing?.subtype ?? "");

  function reset() {
    setCode("");
    setName("");
    setType("Asset");
    setSubtype("");
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (name.trim() === "") return;
    if (isEdit && editing && onUpdate) {
      onUpdate(editing, {
        code: code.trim(),
        name: name.trim(),
        type,
        subtype: subtype.trim() || "Current Assets",
      });
      onClose();
      return;
    }
    onCreate({
      code: code.trim(),
      name: name.trim(),
      type,
      subtype: subtype.trim() || "Current Assets",
      balance: "₹0.00",
      linked: 0,
      note: "Default account",
    });
    reset();
    onClose();
  }

  function handleClose() {
    if (!isEdit) reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? "Edit Account" : "Create Account"}
      description={
        isEdit
          ? "Update this ledger in your chart of accounts."
          : "Add a new ledger to your chart of accounts."
      }
    >
      <form id="create-account-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="acc-code" className={labelCls}>
              Account Code
            </label>
            <input
              id="acc-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. 1008"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="acc-type" className={labelCls}>
              Type
            </label>
            <select
              id="acc-type"
              className={inputCls}
              value={type}
              onChange={(e) => setType(e.target.value as AccountType)}
            >
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
          <input
            id="acc-subtype"
            type="text"
            value={subtype}
            onChange={(e) => setSubtype(e.target.value)}
            placeholder="e.g. Current Assets"
            className={inputCls}
          />
        </div>
      </form>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="bronze" type="submit" form="create-account-form" disabled={name.trim() === ""}>
          {isEdit ? "Save Changes" : "Create Account"}
        </Button>
      </div>
    </Modal>
  );
}
