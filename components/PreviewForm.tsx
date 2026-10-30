'use client';
import { useRef, useState, type FormEvent, type ReactNode } from 'react';

// Forms check the fields and thank the visitor. They do not send anything
// until a form service is connected (see README).
export default function PreviewForm({ children, done }: { children: ReactNode; done: string }) {
  const [sent, setSent] = useState(false);
  const msg = useRef<HTMLParagraphElement>(null);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    setSent(true);
    setTimeout(() => msg.current?.focus(), 0);
  };
  return (
    <form noValidate onSubmit={submit}>
      {children}
      <p className="form-done" hidden={!sent} tabIndex={-1} ref={msg}>{done}</p>
    </form>
  );
}
