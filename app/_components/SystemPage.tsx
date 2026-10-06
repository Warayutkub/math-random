import { Header } from "./Header";

type Props = { code: string; codeClass: string; title: string; body: string; children: React.ReactNode };

/** Shared layout for 404 / 500: big code, what happened, and the way back. */
export function SystemPage({ code, codeClass, title, body, children }: Props) {
  return (
    <main className="mx-auto flex w-full max-w-240 flex-col gap-5 px-5 pt-xl pb-2xl lg:px-3xl lg:pt-3xl">
      <Header />
      <section className="mx-auto flex w-full max-w-120 flex-col items-center gap-md py-3xl text-center">
        <p className={`text-8xl leading-none font-bold ${codeClass}`}>{code}</p>
        <h2 className="text-heading-h2">{title}</h2>
        <p className="text-muted">{body}</p>
        <div className="flex w-full flex-col gap-sm pt-lg">{children}</div>
      </section>
    </main>
  );
}
