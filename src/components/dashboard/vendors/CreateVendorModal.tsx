"use client";

import { useState, type FormEvent } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { Vendor } from "@/data/vendors";

const inputClass =
  "bg-canvas border border-line rounded-xl px-3 py-2 text-sm text-fg outline-none focus:border-bronze";
const labelClass = "text-sm font-medium text-fg-soft";

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function CreateVendorModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (vendor: Vendor) => void;
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
      preferred: false,
      gstin: gstin.trim() || "—",
      city: city.trim() || "—",
      contactName: contactName.trim() || "—",
      email: email.trim() || "—",
      phone: phone.trim() || "—",
      spend: "₹0",
      spendPct: "0% of total",
      payable: "₹0",
      payableNote: "No bills",
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
            <input
              id="vend-gstin"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              placeholder="27ABCDE1234F1Z5"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="vend-contact" className={labelClass}>
              Contact Person
            </label>
            <input
              id="vend-contact"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Vikram Sharma"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="vend-email" className={labelClass}>
              Email
            </label>
            <input
              id="vend-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vikram@sharmasupplies.com"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="vend-phone" className={labelClass}>
              Phone
            </label>
            <input
              id="vend-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="vend-city" className={labelClass}>
              City
            </label>
            <input
              id="vend-city"
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
          form="create-vendor-form"
          disabled={name.trim() === ""}
        >
          Create Vendor
        </Button>
      </div>
    </Modal>
  );
}
