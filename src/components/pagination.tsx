interface Props {
  page: number;
  isLast: boolean;
  onChange: (page: number) => void;
}

function buttonCss(disabled: boolean): string {
  const css = ['rounded-md border px-4 py-2 text-sm font-medium', disabled ? 'border-gray-200 text-gray-300' : 'border-gray-300 text-gray-700 hover:bg-gray-50'];
  return css.join(' ');
}

// 後端沒有總數欄位，只能靠「這頁數量少於 fetch」判斷最後一頁
export default function Pagination({ page, isLast, onChange }: Props) {
  const isFirst = page <= 1;
  return (
    <nav className="mt-8 flex items-center justify-center gap-4" aria-label="Pagination">
      <button type="button" className={buttonCss(isFirst)} disabled={isFirst} onClick={() => onChange(page - 1)}>
        Previous
      </button>
      <span className="text-sm text-gray-700">Page {page}</span>
      <button type="button" className={buttonCss(isLast)} disabled={isLast} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </nav>
  );
}
