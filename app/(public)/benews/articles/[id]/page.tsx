import { notFound } from 'next/navigation';
import { newsArticles } from '@/data/newsArticles';
import ArticleDetail from '../ArticleDetail';
import type { Metadata } from 'next';

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (id === '1') {
    return {
      title: 'how to transfer money internationally',
      description: 'Buyex Forex helps study abroad consultancies with fast, secure, and transparent student fee transfers across India.',
    };
  }
  if (id === '2') {
    return {
      title: 'how to pay university fees abroad from india',
      description: 'Fast, secure way to pay tuition abroad. Learn RBI rules, SWIFT process, and why students trust Buyex Forex.',
    };
  }
  const article = newsArticles.find(a => a.id.toString() === id);
  return {
    title: article ? article.title : 'Article',
    description: article?.imageAlt,
  };
}

// Generate static params for all articles
export async function generateStaticParams() {
  return newsArticles.map(article => ({
    id: article.id.toString(),
  }));
}