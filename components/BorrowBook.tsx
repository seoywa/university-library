"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { borrowBook } from "@/lib/actions/book";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  bookId: string;
  borrowingEligibility: {
    isEligible: boolean;
    message: string;
  };
}

const BorrowBook = ({
  bookId,
  userId,
  borrowingEligibility: { isEligible, message },
}: Props) => {
  const router = useRouter();

  const [borrowing, setBorrowing] = useState(false);

  const handleBorrow = async () => {
    if (!isEligible) {
      toast({
        title: "error",
        description: message,
        variant: "destructive",
      });
    }

    setBorrowing(true);

    try {
      const result = await borrowBook({
        bookId,
        userId,
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Book borrowed successfully.",
        });

        router.push("/my-profile");
      } else {
        toast({
          title: "Error",
          description: "An error occurred while borrowing the book.",
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while borrowing the book",
        variant: "destructive",
      });
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <Button
      className="book-overview_btn"
      onClick={handleBorrow}
      disabled={borrowing}
    >
      <Image alt="book" src="/icons/book.svg" width={20} height={20} />

      <p className="font-bebas-neue text-xl text-dark-100">
        {borrowing ? "Borrowing" : "Borrow Book"}
      </p>
    </Button>
  );
};

export default BorrowBook;
