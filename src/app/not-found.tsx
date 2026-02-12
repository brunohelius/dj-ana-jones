import Link from 'next/link';

export default function NotFound() {
  return (
    <main className='grid min-h-screen place-items-center bg-[var(--bg)] p-6 text-center text-[var(--brand-cream)]'>
      <div className='glass-card max-w-xl p-8'>
        <p className='section-kicker'>404</p>
        <h1 className='section-title'>Evento nao encontrado</h1>
        <p className='mt-4 text-sm text-[var(--muted)]'>
          O link pode estar incorreto ou o evento ja saiu da agenda ativa.
        </p>
        <Link href='/' className='btn-primary mt-6 inline-flex'>
          Voltar para Home
        </Link>
      </div>
    </main>
  );
}
