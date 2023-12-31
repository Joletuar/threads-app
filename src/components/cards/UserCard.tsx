'use client';

import { type FC } from 'react';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Button } from '../ui/button';

interface Props {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  personType: string;
}

export const UserCard: FC<Props> = ({
  id,
  name,
  username,
  imgUrl,
  personType,
}) => {
  const router = useRouter();

  const isCommunity = personType === 'Community';

  return (
    <article className='user-card'>
      <div className='user-card_avatar'>
        <Image
          src={imgUrl}
          alt={name}
          width={48}
          height={48}
          className='rounded-full'
        />

        <div className='flex-1 text-ellipsis'>
          <h4 className='text-base-semibold text-light-1'>{name}</h4>
          <p className='text-small-medium text-gray-1'>@{username}</p>
        </div>
      </div>

      <Button
        className='user-card_btn'
        onClick={() => {
          if (isCommunity) {
            router.push(`/communities/${id}`);
          } else {
            router.push(`/profile/${id}`);
          }
        }}
      >
        Ver
      </Button>
    </article>
  );
};
