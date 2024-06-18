'use client';

import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, MouseEvent } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { ErrorComponent, Loader, StarsForBook } from '@/components';
import useGetSlug from '@/hooks/use-get-slug';
import useCustomRouter from '@/hooks/use-custom-router';
import type { Book, BookUserStatus, CustomSession, FullBookUserStatus, Review, StatusOption } from '@/app/interfaces';
import { v4 as uuidv4 } from 'uuid';

const Book = () => {
  type ExtendedStatusOption = StatusOption | 'Select status'

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [book, setBook] = useState<Book>({} as Book);
  // If user is authenticated, set book status for him
  const [status, setStatus] = useState<ExtendedStatusOption>('To read');
  // How many users have rated this book
  const [totalVotes, setTotalVotes] = useState(0);
  // Average rating for this book
  const [rating, setRating] = useState<number>(0.00);
  // Rating on the left side menu (clickable)
  const [newRating, setNewRating] = useState(0);
  // Prevent multiple votes by same user (visual effect)
  // Only need to prevent changing total user review count on right menu side
  // (non clickable) on change vote
  const [hasVoted, setHasVoted] = useState(false);
  // Rating for book prior for user
  const [priorRating, setPriorRating] = useState(0);

  const router = useCustomRouter();
  const session = useSession();
  const bookId = useGetSlug();

  const statusSelectRef = useRef<HTMLSelectElement | null>(null);

  /**
   * If status exists, update it, else create it.
   * 
   * @param {string} methodName - Whether to create or update status
   * @param {string} newStatus - Updated status from select
   * @param {string} statusId - If status exists, it's ID
   */
  const processStatus = (methodName: string, newStatus: string, statusId: string|null = null) => {
    let statusUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/book_user_statuses`
    if (methodName === 'PATCH') {
      statusUrl += `/${statusId!}`
    }

    return fetch(statusUrl, {
      method: methodName,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        book_id: book.id,
        user: getUsername(),
        status: newStatus
      })
    });
  }

  const getUsername = () =>
    (session.data as CustomSession).session?.user?.name

  /**
   * Get ID of status in the database.
   */
  const getStatusId = async (): Promise<string | null> => {
    const statusUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/book_user_statuses`

    // If status with this book_id and username exists already, update status instead
    const findStatusResponse = await fetch(`${statusUrl}?user=${getUsername()}&book_id=${book.id}`)
    // Status doesn't exist
    const findStatusData = await findStatusResponse.json() as BookUserStatus[];

    // ID of status in the database
    return findStatusData.length ? findStatusData[0].id : null
  }

  const handleChangeStatus = async (e: ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ExtendedStatusOption;
    setStatus(newStatus)

    let statusId = await getStatusId();

    // Delete status on the backend. 
    // Also delete review (if it exists)
    if (newStatus === 'Select status') {
      setHasVoted(false)
      const statusUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/book_user_statuses`
      const deleteResponse = await fetch(`${statusUrl}/${statusId}`, {
        method: 'DELETE'
      })

      if (!deleteResponse.ok) {
        setIsError(true);
      }

      const reviewUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews`

      const reviewResponse = await fetch(`${reviewUrl}?user=${getUsername()}`)

      const reviewData = await reviewResponse.json() as Review[];

      // If user has a review, delete it
      if (reviewData.length) {
        const reviewId = reviewData[0].id
        fetch(`${reviewUrl}/${reviewId}`, {
          method: 'DELETE'
        })

        setNewRating(0);
        setRating(0);
        setTotalVotes(totalVotes - 1);
      }

      return;
    }

    statusId = await getStatusId();

    if (!statusId) {
      await processStatus('POST', newStatus);
    } else {
      await processStatus('PATCH', newStatus, statusId)
    }
  }

  /**
   * When the book rating is changed, update it for the book.
   */
  const handleChangeBookRating = async (e: MouseEvent<HTMLDivElement>) => {
    // If clicked inside polygon, go up the node chain until reaching svg
    const target = e.target as SVGElement
    const targetNode = (target.tagName !== 'svg' ? target.parentNode : target) as SVGSVGElement
    const targetParent = targetNode.parentNode! as HTMLDivElement

    const newRating = Array.from(targetParent!.getElementsByTagName('svg')).indexOf(targetNode) + 1

    setNewRating(newRating)
    // If user has voted before, divide by total votes, else by (total votes + 1)
    const totalVoteCount = hasVoted ? totalVotes : totalVotes + 1
    const initialTotalRating = Math.round(book.rating * book.total_votes);
    const updatedTotalRating = initialTotalRating - priorRating + newRating;

    const updatedRating = (updatedTotalRating / totalVoteCount).toFixed(2) as unknown as number;
    setRating(updatedRating)

    if (!hasVoted) {
      setTotalVotes((totalVotes) => totalVotes + 1)
      setHasVoted(true)
    }

    const reviewUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews`
    await fetch(reviewUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'username': getUsername(),
        'book_id': book.id,
        'rating': newRating,
      })
    })
  }

  useEffect(() => {
    (async () => {
      if (session.status === 'loading') {
        return;
      }

      let bookUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/books/${bookId}`
      if (session.status === 'authenticated') {
        bookUrl += `?username=${getUsername()}`
      }

      const response = await fetch(bookUrl);

      if (!response.ok) {
        setIsError(true);

        return;
      }

      if (session.status === 'authenticated') {
        const data = await response.json() as FullBookUserStatus;

        if (data.review.rating) {
          setHasVoted(true);
          setPriorRating(data.review.rating);
        }

        setBook(data.book);
        setStatus(data.status);
        setTotalVotes(data.book.total_votes);
        setRating(data.book.rating);
        setNewRating(data.review.rating ?? 0);
      } else {
        const data = await response.json() as Book;

        setBook(data);
        setTotalVotes(data.total_votes);
        setRating(data.rating);
      }

      setIsLoading(false);
    })()
    // eslint-disable-next-line
  }, [bookId, session.status, session.data])

  useEffect(() => {
    if (!statusSelectRef.current) {
      return;
    }

    const selectOptionsArr = Array.from(statusSelectRef.current?.getElementsByTagName('option'))
    selectOptionsArr?.map((option: HTMLOptionElement) => {
      option.selected = option.value === status
    })
  }, [status])

  // Handle the time when fetched data successfully but waiting for set book
  return isLoading || (!isError && (!book || Object.keys(book).length === 0))
    ? <Loader />
    : isError
      ? <ErrorComponent />
      : (
        <div className='flex flex-col space-x-0 space-y-12 p-12 text-black sm:px-32 md:flex-row md:space-x-20 md:space-y-0 md:px-64 lg:px-80 2xl:px-96'>
          {/* Book Image and Status/New Review options */}
          <div className='row-v min-w-40 flex-col'>
            <Image
              src={book!.image_url}
              height={350}
              width={170}
              alt={`${book!.title} Image`}
            />
            {session.status === 'authenticated'
              ? (
                <>
                  <label htmlFor="status" className="mb-2 mt-4 block text-sm font-medium text-gray-900 dark:text-white">Book Status</label>
                  <select
                    ref={statusSelectRef}
                    id="status"
                    onChange={handleChangeStatus}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  >
                    <option value="Select status">Select status</option>
                    <option value="To Read">To Read</option>
                    <option value="Reading">Reading</option>
                    <option value="Read">Read</option>
                  </select>
                  {status === 'Read' && (
                    <div className="mt-3.5">
                      <StarsForBook
                        rating={newRating}
                        onClick={(e) => handleChangeBookRating(e)}
                      />
                    </div>
                  )}
                </>
              )
              : <p className='pointer mb-3 mt-5 underline' onClick={() => router.push('/auth')}>Sign In to read this book</p>
            }
          </div>
          {/* Book info and reviews */}
          <div className='md:min-w-80'>
            <h3 className='bold text-5xl'>{book.title}</h3>
            <h6 className='mb-10 mt-6 text-xl tracking-tight text-gray-600'>{book.author}</h6>
            <div className='mb-2.5 flex flex-col gap-5 md:flex-row'>
              <StarsForBook rating={rating} />
              <span>{rating}</span>
              <span>{totalVotes} review{ totalVotes !== 1 && 's' }</span>
            </div>
            <p className='bold'>{book.description}</p>
            <div className="mb-6 mt-4 flex gap-4">
              <span className='semibold text-gray-400'>Genre</span>
              <div className="flex flex-col gap-1.5">
                {book.genres.map((genre) => (
                  <span key={uuidv4()}>{genre}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
}

export default Book;
