import { type FC } from 'react';

import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';

import { ThreadCard } from '@/components/cards/ThreadCard';

import { fetchThreadById } from '@/lib/actions/thread.actions';
import { fetchUser } from '@/lib/actions/user.actions';

interface Props {
  params: {
    id: string;
  };
}

const ThreadPage: FC<Props> = async ({ params }) => {
  if (!params.id) return null;

  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect('/onboarding');

  const threadDetails = await fetchThreadById(params.id);

  return (
    <section className='relative'>
      <div>
        <ThreadCard
          key={threadDetails.id}
          id={threadDetails.id}
          currentUserId={''}
          parentId={threadDetails.parentId?.toString()}
          content={threadDetails.text}
          author={threadDetails.author}
          community={threadDetails.community}
          createAt={threadDetails.createdAt.toLocaleString()}
          comments={threadDetails.children}
        />
      </div>
    </section>
  );
};

export default ThreadPage;
