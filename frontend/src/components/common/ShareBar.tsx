import { useState } from 'react';
import { Check, Copy, Link2 } from 'lucide-react';

interface Props {
  url: string;
  title: string;
  summary: string;
  /** compact = card-style row; default = detail-page row with labels */
  compact?: boolean;
}

export function ShareBar({ url, title, summary, compact = false }: Props) {
  const [copied, setCopied] = useState(false);

  const encodedUrl     = encodeURIComponent(url);
  const encodedTitle   = encodeURIComponent(title);
  const encodedSummary = encodeURIComponent(summary);

  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedSummary}`;
  const liUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}&source=GoruKoi`;

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 border-t border-border/40 px-4 py-2">
        <span className="mr-auto text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          শেয়ার
        </span>
        <a
          href={fbUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook-এ শেয়ার করুন"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1877F2]/10 text-[#1877F2] transition-colors hover:bg-[#1877F2] hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <a
          href={liUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn-এ শেয়ার করুন"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0A66C2]/10 text-[#0A66C2] transition-colors hover:bg-[#0A66C2] hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
        <button
          type="button"
          onClick={copyLink}
          aria-label="লিংক কপি করুন"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          {copied
            ? <Check className="h-3.5 w-3.5 text-emerald-500" />
            : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
        </button>
      </div>
    );
  }

  // Detail-page variant — larger, labelled buttons
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        শেয়ার করুন:
      </span>
      <a
        href={fbUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full bg-[#1877F2]/10 px-3 py-1.5 text-xs font-semibold text-[#1877F2] transition-colors hover:bg-[#1877F2] hover:text-white"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Facebook
      </a>
      <a
        href={liUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full bg-[#0A66C2]/10 px-3 py-1.5 text-xs font-semibold text-[#0A66C2] transition-colors hover:bg-[#0A66C2] hover:text-white"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        LinkedIn
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? 'কপি হয়েছে!' : 'লিংক কপি'}
      </button>
    </div>
  );
}
