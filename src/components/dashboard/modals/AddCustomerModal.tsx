type Props = {
  onClose: () => void;
};

export default function AddCustomerModal({
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 w-[500px]">
        <h2 className="text-2xl font-bold mb-6">
          Add Customer
        </h2>

        <input
          placeholder="Customer Name"
          className="w-full border rounded-xl p-3 mb-4"
        />

        <input
          placeholder="Email"
          className="w-full border rounded-xl p-3 mb-4"
        />

        <input
          placeholder="Phone"
          className="w-full border rounded-xl p-3 mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-xl"
          >
            Cancel
          </button>

          <button className="px-4 py-2 bg-[#B08D57] text-white rounded-xl">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}