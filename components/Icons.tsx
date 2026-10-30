const PATHS: Record<string, JSX.Element> = {
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 6.5 12 13l8.5-6.5" /></>,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10.5V17M8 7.2v.1M11.5 17v-6.5M11.5 13.2c0-1.6 1-2.7 2.5-2.7s2.5 1 2.5 2.7V17" /></>,
  instagram: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17 7v.1" /></>,
  facebook: <path d="M14 21v-7.5h2.6l.4-3H14V8.7c0-.9.3-1.5 1.6-1.5H17V4.5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.7 1.4-3.7 3.9v2.2H8.5v3H11V21" />,
  phone: <path d="M6.6 3.8 9 3.5l1.6 4-2 1.3a11 11 0 0 0 6.6 6.6l1.3-2 4 1.6-.3 2.4c-.1 1-1 1.7-2 1.6C10.7 18.2 5.8 13.3 5 6.8c-.1-1 .6-1.9 1.6-2Z" />,
  pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>,
};

export function Icon({ kind }: { kind: keyof typeof PATHS | string }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{PATHS[kind]}</svg>;
}

export function IconLink({ kind, label, url }: { kind: string; label: string; url: string }) {
  const ext = url.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {};
  return (
    <a className="icon" href={url} aria-label={label} title={label} {...ext}>
      <Icon kind={kind} />
    </a>
  );
}

export function Arrow() {
  return <span className="arr" aria-hidden="true">&rarr;</span>;
}
