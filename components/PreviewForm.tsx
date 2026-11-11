
'use client';

import { useRef, useState, type FormEvent, type ReactNode } from 'react';

const FORM_ID = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;

type PreviewFormProps = {
  children: ReactNode;
  done: string;
  subject?: string;
};

export default function PreviewForm({
  children,
  done,
  subject = 'New Teara website enquiry',
}: PreviewFormProps) {
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');

  const [feedback, setFeedback] = useState('');
  const sending = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity() || sending.current) return;

    if (!FORM_ID) {
      setStatus('error');
      setFeedback(
        'The contact form is not configured yet. Please email contact@teara.in directly.'
      );
      return;
    }

    sending.current = true;
    setStatus('sending');
    setFeedback('Sending your message…');

    const button = form.querySelector<HTMLButtonElement>(
      'button[type="submit"]'
    );

    if (button) button.disabled = true;

    try {
      const formData = new FormData(form);

      // Set the email subject for the Teara team.
      formData.set('subject', subject);

      const response = await fetch(
        `https://formspree.io/f/${FORM_ID}`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        }
      );

      const result = await response.json().catch(() => null) as
        | { errors?: { message?: string }[] }
        | null;

      if (!response.ok) {
        const details = result?.errors
          ?.map((item) => item.message)
          .filter(Boolean)
          .join(' ');

        throw new Error(
          details ||
            'Your message could not be sent. Please try again or email contact@teara.in.'
        );
      }

      form.reset();
      setStatus('success');
      setFeedback(done);

    } catch (error) {
      setStatus('error');

      setFeedback(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );

    } finally {
      sending.current = false;
      if (button) button.disabled = false;
    }
  }

  return (
    <form
      noValidate
      onSubmit={submit}
      aria-busy={status === 'sending'}
    >
      {/* Honeypot field for basic bot filtering */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ display: 'none' }}
      />

      {children}

      <p
        className={`form-done ${status === 'error' ? 'form-error' : ''}`}
        role={status === 'error' ? 'alert' : 'status'}
        aria-live="polite"
        hidden={status === 'idle'}
      >
        {feedback}
      </p>
    </form>
  );
}
