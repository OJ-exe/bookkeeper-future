"use client";

import { useState, type FormEvent } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const inputClass =
  "bg-canvas border border-line rounded-xl px-3 py-2 text-sm text-fg outline-none focus:border-bronze";
const labelClass = "text-sm font-medium text-fg-soft";

export default function CreateCustomerModal({
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
      title="Create Customer"
      description="Add a new customer to your master data."
      size="lg"
    >
      <form id="create-customer-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="cust-name" className={labelClass}>
              Customer Name <span className="text-danger">*</span>
            </label>
            <input
              id="cust-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Pvt Ltd"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="cust-gstin" className={labelClass}>
              GSTIN
            </label>
            <input id="cust-gstin" placeholder="27ABCDE1234F1Z5" className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="cust-contact" className={labelClass}>
              Contact Person
            </label>
            <input id="cust-contact" placeholder="Rajesh Kumar" className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="cust-email" className={labelClass}>
              Email
            </label>
            <input
              id="cust-email"
              type="email"
              placeholder="rajesh@acme.com"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="cust-phone" className={labelClass}>
              Phone
            </label>
            <input id="cust-phone" placeholder="+91 98765 43210" className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="cust-city" className={labelClass}>
              City
            </label>
            <input id="cust-city" placeholder="Mumbai, Maharashtra" className={inputClass} />
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
          form="create-customer-form"
          disabled={name.trim() === ""}
        >
          Create Customer
        </Button>
      </div>
    </Modal>
  );
}
