export default async function Home() {

  const post = await fetcPosts()

  return (
    <div>
      <h1 className='ut-text-4xl'>Home</h1>
    </div>
  );
}
