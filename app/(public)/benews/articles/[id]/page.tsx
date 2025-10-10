import { notFound } from 'next/navigation';
import { newsArticles } from '@/data/newsArticles';
import ArticleDetail from '../ArticleDetail';

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ArticlePage({ params }: Props) {
  // Await params in Next.js 15+
  const { id: articleId } = await params;
  const article = newsArticles.find(article => article.id.toString() === articleId);

  if (!article) {
    notFound();
  }

  return <ArticleDetail article={article} />;
}

// Generate static params for all articles
export async function generateStaticParams() {
  return newsArticles.map(article => ({
    id: article.id.toString(),
  }));
}