'use client';
import { useEffect, useState } from 'react';
import { sound } from '@/lib/sound';

export default function SoundToggle() {
  const [on, setOn] = useState(false);
  useEffect(() => sound.subscribe(setOn), []);
  return (
    <button type="button" className={`sound-btn${on ? ' on' : ''}`} aria-pressed={on} onClick={() => sound.toggle()}
      title={on ? 'Turn the sound of the hills off' : 'Turn on the sound of the hills'}>
      <span className="bars" aria-hidden="true"><i /><i /><i /><i /></span>
      <span className="lbl">{on ? 'Sound on' : 'Sound off'}</span>
    </button>
  );
}
