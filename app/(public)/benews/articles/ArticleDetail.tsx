'use client';

import Image from 'next/image';
import Topbar from '@/components/landing-content/Topbar';
import Footer from '@/components/landing-content/Footer';

interface Article {
  id: number;
  title: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  imageAlt?: string;
  sections: Array<{
    heading: string;
    content?: string[];
    subsections?: Array<{
      heading: string;
      content?: string[];
    }>;
  }>;
}

export default function ArticleDetail({ article }: { article: Article }) {
  return (
    <div>
      <Topbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-jakarta mb-4">{article.title}</h1>
          <div className="flex items-center text-sm text-gray-600 mb-6">
            <span>By {article.author}</span>
            <span className="mx-2">•</span>
            <span>{article.date}</span>
            <span className="mx-2">•</span>
            <span>{article.readTime}</span>
          </div>
          
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={article.image || "/placeholder.svg"}
              alt={article.imageAlt || article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="prose max-w-none">
            {article.sections.map((section, i) => (
              <div key={i} className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{section.heading}</h2>
                {section.content?.map((paragraph, j) => (
                  <p key={j} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
                {section.subsections?.map((subsection, k) => (
                  <div key={k} className="ml-4 mb-6">
                    <h3 className="text-xl font-medium mb-3">{subsection.heading}</h3>
                    {subsection.content?.map((paragraph, l) => (
                      <p key={l} className="mb-3 text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
