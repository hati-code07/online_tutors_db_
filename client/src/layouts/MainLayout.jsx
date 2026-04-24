export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between">
        <h1 className="font-bold text-xl text-indigo-600">TutorApp</h1>
        <div className="space-x-4">
          <a href="/tutors">Tutors</a>
          <a href="/schedule">Schedule</a>
        </div>
      </nav>

      <main className="p-6">{children}</main>
    </div>
  );
}