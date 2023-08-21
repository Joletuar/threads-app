import { currentUser } from '@clerk/nextjs';

import { fetchPosts } from '@/lib/actions/thread.actions';

import { ThreadCard } from '@/components/cards/ThreadCard';

export default async function Home() {

  // obtenemos el usuario de la sesión
  const user = await currentUser();

  // obtenemos los threads
  const {posts} = await fetchPosts(1, 30);

  return (
    <div>
      <h2 className='ut-text-4xl'>Home</h2>

      <section className='mt-9 flex flex-col gap-10'>
        {posts.length === 0 ? (
          <p>No se encontraron Threads</p>
        ) : (
          <>
            {posts.map((post) => (
              <ThreadCard
                key={post._id.toString()}
                id={post._id.toString()}
                currentUserId={user?.id || ""}
                parentId={post.parentId?.toString()}
                content={post.text}
                author={post.author}
                community={post.community}
                createAt={post.createdAt.toLocaleString()}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </div>
  );
}
