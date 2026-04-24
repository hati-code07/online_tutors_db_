export default function Button({ children }) {
  return (
    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition">
      {children}
    </button>
  );
}