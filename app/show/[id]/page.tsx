// ShowDetail component
'use client';

import React, { useEffect, useState } from 'react'
import { NextPage } from 'next';
import { getSeriesFromApiCall } from './fetchShowDetails.server';
import { Show, Episode } from '@/types/types';
import Image from 'next/image';

interface ShowDetailProps {
  params: {
    id: string;
  };
}


const ShowDetail: NextPage<ShowDetailProps> = ({ params }) => {
  const [showDetails, setShowDetails] = useState<Show>(
    {} as Show
  );
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await getSeriesFromApiCall(params.id);

      if (!data) {
        return;
      }
      setShowDetails(data);
      setIsLoading(false);
    }
  
    loadData();
  }, [params.id]);

  return (
    <div className='text-white mx-auto my-8 flex flex-col items-center w-1/2'>
    {isLoading ? (
      <div className="spinner"></div>
    ) : (
      <>
        <h1>Show: {params.id}</h1>
        <h2>Show details</h2>
        <p>{showDetails?.showName}</p>
        <Image src={showDetails?.posterUrl} alt={showDetails?.showName} width={300} height={450} priority={false}/>
      </>
    )}
  </div>
  )
}

export default ShowDetail;
