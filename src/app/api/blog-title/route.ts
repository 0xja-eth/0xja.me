import { NextResponse } from 'next/server';
import mql from '@microlink/mql';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // 对于 Notion 页面使用特殊处理
    if (url.includes('notion.site')) {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'TelegramBot (like TwitterBot)'
        }
      });
      const html = await response.text();
      
      // 提取标题
      const titleMatch = html.match(/<title>([^|]+)/);
      const title = titleMatch ? titleMatch[1].trim() : url;
      
      // 提取描述
      const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
      const description = descMatch ? descMatch[1] : '';

      return NextResponse.json({ title, description });
    }
    
    // 对于其他页面使用 microlink
    const { data } = await mql(url, {
      prerender: true,
      waitUntil: 'load',
      javascript: true
    });
    
    return NextResponse.json({ 
      ...data,
      title: data.title || url
    });
  } catch (error) {
    console.error('获取博客元数据失败:', error);
    return NextResponse.json({ title: url });
  }
}
