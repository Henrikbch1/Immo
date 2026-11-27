import { BUILD_INFO, formatBuildZeit } from '../buildinfo.ts';

/** Fußzeile mit Build-Info (11 §2): Sprint, Commit, Build-Zeit. */
export function Fusszeile() {
  const repo = 'https://github.com/henrikbch1/Immo';
  return (
    <footer className="border-t border-border-decor px-4 py-3 text-xs text-muted erweitert:px-6 gross:px-8">
      <span>Sprint {BUILD_INFO.sprint}</span>
      {' · '}
      <span>
        Commit{' '}
        <a className="tabular text-muted underline" href={`${repo}/commit/${BUILD_INFO.commit}`}>
          {BUILD_INFO.commit}
        </a>
      </span>
      {' · '}
      <span>Build {formatBuildZeit(BUILD_INFO.zeit)}</span>
    </footer>
  );
}
