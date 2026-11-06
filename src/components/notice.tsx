interface Props {
  kind: 'error' | 'success' | 'info';
  children: React.ReactNode;
}

function noticeCss(kind: Props['kind']): string {
  const color = { error: 'bg-red-50 text-red-700', success: 'bg-green-50 text-green-700', info: 'bg-blue-50 text-blue-700' };
  return `rounded-lg px-4 py-3 text-sm ${color[kind]}`;
}

export default function Notice({ kind, children }: Props) {
  return (
    <p role={kind === 'error' ? 'alert' : 'status'} className={noticeCss(kind)}>
      {children}
    </p>
  );
}
