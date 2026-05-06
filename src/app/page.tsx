import RegistrationForm from "@/components/RegistrationForm";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-24 bg-gradient-to-br from-indigo-50 via-white to-slate-50 text-slate-900">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-200/50 blur-3xl" />
      </div>

      <RegistrationForm />
      
      <footer className="mt-12 text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} Sistema de Coleta de Dados
      </footer>
    </main>
  );
}
