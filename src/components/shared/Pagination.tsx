import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    basePath: string;
    className?: string;
}

export function Pagination({ currentPage, totalPages, basePath, className }: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const renderPageNumbers = () => {
        const pageNumbers = [];
        // Adaptive max pages based on screen width (simulated via smaller default)
        const maxPagesToShow = 3; 
        const half = Math.floor(maxPagesToShow / 2);

        let startPage = Math.max(1, currentPage - half);
        let endPage = Math.min(totalPages, currentPage + half);

        if (currentPage - half < 1) {
            endPage = Math.min(totalPages, maxPagesToShow);
        }

        if (currentPage + half > totalPages) {
            startPage = Math.max(1, totalPages - maxPagesToShow + 1);
        }

        if (startPage > 1) {
            pageNumbers.push(
                <Button key={1} asChild variant="outline" size="icon">
                    <Link href={`${basePath}?page=1`}>1</Link>
                </Button>
            );
            if (startPage > 2) {
                pageNumbers.push(<span key="start-ellipsis" className="px-2">...</span>);
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <Button
                    key={i}
                    asChild
                    variant={i === currentPage ? 'default' : 'outline'}
                    size="icon"
                >
                    <Link href={`${basePath}?page=${i}`}>{i}</Link>
                </Button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbers.push(<span key="end-ellipsis" className="px-2">...</span>);
            }
            pageNumbers.push(
                <Button key={totalPages} asChild variant="outline" size="icon">
                    <Link href={`${basePath}?page=${totalPages}`}>{totalPages}</Link>
                </Button>
            );
        }

        return pageNumbers;
    };
    
    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    return (
        <div className={cn("flex flex-wrap items-center justify-center gap-2 mt-8 px-4", className)}>
             <Button
                asChild
                variant="outline"
                size="sm"
                className={cn("h-10 px-3 xs:px-4", !hasPreviousPage && 'pointer-events-none opacity-50')}
              >
                <Link href={`${basePath}?page=${currentPage - 1}`}>
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    <span className="hidden xs:inline">Prev</span>
                </Link>
            </Button>
            
            <div className="flex items-center gap-1.5 xs:gap-2">
                {renderPageNumbers()}
            </div>
            
            <Button
                asChild
                variant="outline"
                size="sm"
                className={cn("h-10 px-3 xs:px-4", !hasNextPage && 'pointer-events-none opacity-50')}
             >
                <Link href={`${basePath}?page=${currentPage + 1}`}>
                    <span className="hidden xs:inline">Next</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
            </Button>
        </div>
    );
}
