"use client";

import { useState, type FormEvent } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { Customer } from "@/data/customers";

const inputClass =
  "bg-canvas border border-line rounded-xl px-3 py-2 text-sm text-fg outline-none focus:border-bronze";
const labelClass = "text-sm font-medium text-fg-soft";

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function CreateCustomerModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (customer: Customer) => void;
}) {
  const [name, setName] = useState("");
  const [gstin, setGstin] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  function reset() {
    setName("");
    setGstin("");
    setContactName("");
    setEmail("");
    setPhone("");
    setCity("");
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (name.trim() === "") return;
    onCreate({
      name: name.trim(),
      initials: initialsOf(name),
      vip: false,
      gstin: gstin.trim() || "—",
      city: city.trim() || "—",
      contactName: contactName.trim() || "—",
      email: email.trim() || "—",
      phone: phone.trim() || "—",
      revenue: "₹0",
      revenuePct: "0% of total",
      outstanding: "₹0",
      outstandingNote: "No invoices",
      status: "Active",
      isNew: true,
    });
    reset();
    onClose();
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
            <input
              id="cust-gstin"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              placeholder="27ABCDE1234F1Z5"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="cust-contact" className={labelClass}>
              Contact Person
            </label>
            <input
              id="cust-contact"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Rajesh Kumar"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="cust-email" className={labelClass}>
              Email
            </label>
            <input
              id="cust-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rajesh@acme.com"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="cust-phone" className={labelClass}>
              Phone
            </label>
            <input
              id="cust-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="cust-city" className={labelClass}>
              City
            </label>
            <input
              id="cust-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Mumbai, Maharashtra"
              className={inputClass}
            />
          </div>
        </div>
      </form>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={handleClose}>
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
