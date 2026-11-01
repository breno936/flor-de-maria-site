/** The play triangle on the film covers and their text actions. */
export default function PlayIcon({ small = false }: { small?: boolean }) {
  const size = small ? 9 : 14;
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true" className="translate-x-[1px]">
      <path d="M2.5 1.5v9l7-4.5-7-4.5Z" fill="currentColor" />
    </svg>
  );
}
