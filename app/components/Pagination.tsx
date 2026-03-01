interface PaginationProps {
    page: number;
    totalItems: number;
    itemsPerPage: number;
    onNext: () => void;
    onPrev: () => void;
}

export default function Pagination({
    page,
    totalItems,
    itemsPerPage,
    onNext,
    onPrev,
}: PaginationProps) {
    return (
        <div className="flex gap-2 mt-4 items-center">
            <button
                onClick={onPrev}
                disabled={page === 0}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-black cursor-pointer hover:bg-gray-300"
            >
                &lt;
            </button>
            <span>
                {page + 1} / {Math.ceil(totalItems / itemsPerPage)}
            </span>
            <button
                onClick={onNext}
                disabled={(page + 1) * itemsPerPage >= totalItems}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-black cursor-pointer hover:bg-gray-300"
            >
                &gt;
            </button>
        </div>
    );
}
