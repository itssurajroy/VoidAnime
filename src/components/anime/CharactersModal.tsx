'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AniListCharacterEdge } from '@/types';

interface CharactersModalProps {
  characters: AniListCharacterEdge[];
  children?: React.ReactNode;
}

const ITEMS_PER_PAGE = 10;

export function CharactersModal({ characters, children }: CharactersModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const totalPages = Math.ceil(characters.length / ITEMS_PER_PAGE);
  const paginatedCharacters = characters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const MAX_PAGES_SHOWN = 3;

    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > MAX_PAGES_SHOWN) {
        if (currentPage <= 2) {
            startPage = 1;
            endPage = 3;
        } else if (currentPage >= totalPages - 1) {
            startPage = totalPages - 2;
            endPage = totalPages;
        } else {
            startPage = currentPage - 1;
            endPage = currentPage + 1;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
    
    return (
         <div className="flex justify-center items-center gap-2 pt-4 border-t border-border -mx-6 px-6 pb-2">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="w-5 h-5"/>
            </Button>
            {pageNumbers.map(page => (
                 <Button key={page} variant={currentPage === page ? "default" : "outline"} size="icon" className="w-9 h-9" onClick={() => setCurrentPage(page)}>
                    {page}
                </Button>
            ))}
             <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="w-5 h-5"/>
            </Button>
        </div>
    )
  }

  const isValidElement = React.isValidElement(children);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {isValidElement && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl">Characters & Voice Actors</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 py-4">
                {paginatedCharacters.map((edge) => (
                    <div key={edge.node.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-16 h-16">
                                <AvatarImage src={edge.node.image.large} alt={edge.node.name.full} />
                                <AvatarFallback>{edge.node.name.full.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-white">{edge.node.name.full}</p>
                                <p className="text-sm text-muted-foreground">{edge.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center -space-x-3">
                            {edge.voiceActors.slice(0, 4).map(va => (
                                <Avatar key={va.id} className="w-10 h-10 border-2 border-card">
                                    <AvatarImage src={va.image.large} alt={va.name.full} />
                                    <AvatarFallback>{va.name.full.charAt(0)}</AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
        {renderPagination()}
      </DialogContent>
    </Dialog>
  );
}
