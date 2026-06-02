export default function BlogCard({ post }) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-4">
      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt ?? post.body?.slice(0, 120) + '...'}</p>
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
        <span>{post.author?.name ?? 'Anonymous'}</span>
      </div>
    </article>
  );
}
