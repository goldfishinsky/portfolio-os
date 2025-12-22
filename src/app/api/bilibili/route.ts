import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mid = searchParams.get('mid') || '11321390';
  const season_id = searchParams.get('season_id') || '2860765';
  const page_num = searchParams.get('page_num') || '1';
  const page_size = searchParams.get('page_size') || '30';

  const targetUrl = `https://api.bilibili.com/x/polymer/web-space/seasons_archives_list?mid=${mid}&season_id=${season_id}&page_num=${page_num}&page_size=${page_size}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'Referer': 'https://space.bilibili.com/11321390',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Bilibili API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from Bilibili:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
