"use client";

import { useState, type FormEvent } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const inputClass =
  "bg-canvas border border-line rounded-xl px-3 py-2 text-sm text-fg outline-none focus:border-bronze";
const labelClass = "text-sm font-medium text-fg-soft";

export default function CreateVendorModal({
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
      title="Create Vendor"
      description="Add a new vendor to your master data."
      size="lg"
    >
      <form id="create-vendor-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="vend-name" className={labelClass}>
              Vendor Name <span className="text-danger">*</span>
            </label>
            <input
              id="vend-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sharma Supplies"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="vend-gstin" className={labelClass}>
              GSTIN
            </label>
            <input id="vend-gstin" placeholder="27ABCDE1234F1Z5" className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="vend-contact" className={labelClass}>
              Contact Person
            </label>
            <input id="vend-contact" placeholder="Vikram Sharma" className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="vend-email" className={labelClass}>
              Email
            </label>
            <input
              id="vend-email"
              type="email"
              placeholder="vikram@sharmasupplies.com"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="vend-phone" className={labelClass}>
              Phone
            </label>
            <input id="vend-phone" placeholder="+91 98765 43210" className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="vend-city" className={labelClass}>
              City
            </label>
            <input id="vend-city" placeholder="Mumbai, Maharashtra" className={inputClass} />
          </div>
        </div>
      </form>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="bronze"
          type="submit"
          form="create-vendor-form"
          disabled={name.trim() === ""}
        >
          Create Vendor
        </Button>
      </div>
    </Modal>
  );
}
