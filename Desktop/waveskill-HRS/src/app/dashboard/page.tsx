import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-blue-50 to-purple-100 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-700">Dashboard</h1>
          <Link href="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">Logout</Link>
        </header>
        <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <section className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
            <img src="/globe.svg" alt="Stats" className="w-16 h-16 mb-4" />
            <h2 className="text-xl font-bold mb-2">Your Stats</h2>
            <p className="text-gray-600">Track your progress and achievements here.</p>
          </section>
          <section className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
            <img src="/window.svg" alt="Projects" className="w-16 h-16 mb-4" />
            <h2 className="text-xl font-bold mb-2">Projects</h2>
            <p className="text-gray-600">Manage your ongoing and completed projects.</p>
          </section>
          <section className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
            <img src="/file.svg" alt="Resources" className="w-16 h-16 mb-4" />
            <h2 className="text-xl font-bold mb-2">Resources</h2>
            <p className="text-gray-600">Access helpful guides and documentation.</p>
          </section>
        </main>
      </div>
    </div>
  );
}