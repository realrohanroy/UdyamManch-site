import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const secret = req.nextUrl.searchParams.get('secret');

    if (secret !== process.env.SANITY_REVALIDATE_SECRET && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ message: 'Invalid revalidation secret' }, { status: 401 });
    }

    const body = await req.json();
    const { _type, slug } = body;

    // Revalidate index and listings
    revalidatePath('/');
    revalidatePath('/founders');
    revalidatePath('/stories');

    // Revalidate specific dynamic route if slug provided
    if (slug?.current) {
      if (_type === 'founder' || _type === 'founderJourney') {
        revalidatePath(`/founders/${slug.current}`);
      } else if (_type === 'story') {
        revalidatePath(`/stories/${slug.current}`);
      }
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      target: slug?.current ? `${_type}/${slug.current}` : 'all',
    });
  } catch (err: any) {
    return NextResponse.json({ message: 'Error revalidating', error: err.message }, { status: 500 });
  }
}
