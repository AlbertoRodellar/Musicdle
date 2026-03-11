import {
    Pagination as ShadcnPagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

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
    const isFirst = page === 0;
    const isLast = (page + 1) * itemsPerPage >= totalItems;

    return (
        <ShadcnPagination className="mt-4">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={isFirst ? undefined : onPrev}
                        className={isFirst ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        text="Anterior"
                    />
                </PaginationItem>
                <PaginationItem>
                    <span className="px-4 py-2 text-sm">
                        {page + 1} / {Math.ceil(totalItems / itemsPerPage)}
                    </span>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext
                        onClick={isLast ? undefined : onNext}
                        className={isLast ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        text="Siguiente"
                    />
                </PaginationItem>
            </PaginationContent>
        </ShadcnPagination>
    );
}