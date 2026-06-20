type Props = {
  onClose: () => void;
};

export default function AskAIModal({
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 w-[600px]">
        <h2 className="text-2xl font-bold mb-6">
          AI Copilot
        </h2>

        <textarea
          rows={5}
          placeholder="Ask anything about your business..."
          className="w-full border rounded-xl p-3"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-xl"
          >
            Close
          </button>

          <button className="px-4 py-2 bg-[#B08D57] text-white rounded-xl">
            Ask AI
          </button>
        </div>
      </div>
    </div>
  );
}