export type InstagramPost = {
  id: string;
  mediaUrl: string;
  permalink: string;
  caption: string;
};

const fallbackProfile =
  process.env.NEXT_PUBLIC_INSTAGRAM_PROFILE_URL || 'https://instagram.com/anajonesdj';

const fallbackPosts: InstagramPost[] = [
  {
    id: 'fallback-1',
    mediaUrl: '/gallery/real/ana-zamna-festival.jpeg',
    permalink: fallbackProfile,
    caption: 'Ana Jones no Zamna Festival',
  },
  {
    id: 'fallback-2',
    mediaUrl: '/gallery/real/ana-dreams-release.jpg',
    permalink: fallbackProfile,
    caption: 'Lancamento do EP Dreams',
  },
  {
    id: 'fallback-3',
    mediaUrl: '/gallery/real/ana-clubinho-goiania-artwork.png',
    permalink: fallbackProfile,
    caption: 'Clubinho Room Ed. Goiania',
  },
  {
    id: 'fallback-4',
    mediaUrl: '/gallery/real/artworks-MyVfYpeTrDzKDT2m-G36AhA-t1080x1080.jpg',
    permalink: fallbackProfile,
    caption: 'Techno Connection Radio #025',
  },
  {
    id: 'fallback-5',
    mediaUrl: '/gallery/real/artworks-QAlcAWzmLyqFfcWx-MWgViQ-t1080x1080.png',
    permalink: fallbackProfile,
    caption: 'Kaluts, Ana Jones - Sente/Febre',
  },
  {
    id: 'fallback-6',
    mediaUrl: '/gallery/real/ana-soundcloud-visual.jpg',
    permalink: fallbackProfile,
    caption: 'Visual oficial da Ana Jones',
  },
];

export const getInstagramPosts = async (limit = 6): Promise<InstagramPost[]> => {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!accessToken) {
    return fallbackPosts.slice(0, limit);
  }

  try {
    const endpoint =
      `https://graph.instagram.com/me/media` +
      `?fields=id,caption,media_url,thumbnail_url,media_type,permalink` +
      `&access_token=${accessToken}`;

    const response = await fetch(endpoint, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return fallbackPosts.slice(0, limit);
    }

    const payload = (await response.json()) as {
      data?: Array<{
        id: string;
        caption?: string;
        media_url?: string;
        thumbnail_url?: string;
        media_type?: string;
        permalink?: string;
      }>;
    };

    const posts = (payload.data || [])
      .slice(0, limit)
      .map((item) => ({
        id: item.id,
        mediaUrl:
          item.media_type === 'VIDEO'
            ? item.thumbnail_url || fallbackPosts[0].mediaUrl
            : item.media_url || fallbackPosts[0].mediaUrl,
        permalink: item.permalink || fallbackProfile,
        caption: item.caption || 'Post recente da Ana Jones',
      }));

    return posts.length > 0 ? posts : fallbackPosts.slice(0, limit);
  } catch {
    return fallbackPosts.slice(0, limit);
  }
};
