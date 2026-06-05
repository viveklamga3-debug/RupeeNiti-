import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  image?: string;
  schemaList?: any[];
  breadcrumb?: Array<{name: string, item: string}>;
}

export function SEO({ 
  title, 
  description, 
  path, 
  type = 'website', 
  image = 'https://rupeeniti.in/icon.svg', 
  schemaList = [], 
  breadcrumb 
}: SEOProps) {
  const url = `https://rupeeniti.in${path}`;
  
  const schemas = [...schemaList];
  
  if (breadcrumb && breadcrumb.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumb.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": `https://rupeeniti.in${crumb.item}`
      }))
    });
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="RupeeNiti" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:domain" content="rupeeniti.in" />
      <meta name="twitter:url" content={url} />
      
      {schemas.map((schema, index) => (
         <script key={index} type="application/ld+json">
           {JSON.stringify(schema)}
         </script>
      ))}
    </Helmet>
  );
}
