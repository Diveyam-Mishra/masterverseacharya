export default function Avatar({ name = 'U' }) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center text-white font-bold text-lg shadow-md">
      {initial}
    </div>
  );
}
