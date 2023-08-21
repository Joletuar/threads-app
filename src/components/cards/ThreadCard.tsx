import { type FC } from 'react';

interface Author {
  name: string;
  image: string;
  id: string;
}

interface Community {
  id: string;
  name: string;
  image: string;
}

interface Comment {
  author: { image: Author['image'] };
}

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null | undefined ;
  content: string;
  author: Author;
  community: Community | null;
  createAt: string;
  comments: Comment[];
  isComment?: boolean;
}

export const ThreadCard: FC<Props> = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createAt,
  comments,
}) => {
  return (
    <article className=''>
      <h2 className='text-small-regular text-light-2'>{content}</h2>
    </article>
  );
};
