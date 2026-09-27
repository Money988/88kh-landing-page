export interface WebsiteContent {
  id: number
  key: string
  url: string
  icon: string
  nameKeys: string[]
  thumbnail: string[]
  thumbnailMobile: string[]
  sortOrder: number
}

export interface SupportLink {
  id: number
  groupId: number
  key: string
  handle: string
  handleKey: string | null
  url: string
  sortOrder: number
}

export interface SupportGroup {
  id: number
  titleKey: string
  icon: string
  sortOrder: number
  links: SupportLink[]
}

const CDN = 'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh'

export const fallbackWebsites: WebsiteContent[] = [
  {
    id: 1,
    key: 'sportsbook',
    url: 'https://88bkh.com',
    icon: '⚽',
    nameKeys: ['cards.sportsbook'],
    thumbnailMobile: [
      `${CDN}/sportsbook/mobile/855-mockup.webp`,
      `${CDN}/sportsbook/mobile/live-mockup.webp`,
      `${CDN}/sportsbook/mobile/sbc-mockup.webp`,
    ],
    thumbnail: [
      `${CDN}/sportsbook/855-mockup.webp`,
      `${CDN}/sportsbook/live-mockup.webp`,
      `${CDN}/sportsbook/sbc-mockup.webp`,
    ],
    sortOrder: 0,
  },
  {
    id: 2,
    key: 'cockfight',
    url: 'https://88cf.live',
    icon: '🐓',
    nameKeys: ['cards.cockfight', 'cards.casino'],
    thumbnailMobile: [
      `${CDN}/cockfight-and-casino/mobile/cockfight-mockup.webp`,
      `${CDN}/cockfight-and-casino/mobile/baccarat-mockup.webp`,
      `${CDN}/cockfight-and-casino/mobile/dragon-tiger-mockup.webp`,
    ],
    thumbnail: [
      `${CDN}/cockfight-and-casino/88cockfight-mockup.webp`,
      `${CDN}/cockfight-and-casino/baccarat-mockup.webp`,
      `${CDN}/cockfight-and-casino/dragon-tiger-mockup.webp`,
    ],
    sortOrder: 1,
  },
  {
    id: 3,
    key: 'slot',
    url: 'https://88slot.live',
    icon: '🎰',
    nameKeys: ['cards.games'],
    thumbnailMobile: [
      `${CDN}/games/mobile/88slot-mockup.webp`,
      `${CDN}/games/mobile/jili-mockup.webp`,
      `${CDN}/games/mobile/joker-mockup.webp`,
      `${CDN}/games/mobile/pg-mockup.webp`,
      `${CDN}/games/mobile/pplay-mockup.webp`,
    ],
    thumbnail: [
      `${CDN}/games/88slot-mockup.webp`,
      `${CDN}/games/jili-mockup.webp`,
      `${CDN}/games/joker-mockup.webp`,
      `${CDN}/games/pg-mockup.webp`,
      `${CDN}/games/pplay-mockup.webp`,
    ],
    sortOrder: 2,
  },
]

export const fallbackSupportGroups: SupportGroup[] = [
  {
    id: 1,
    titleKey: 'support.accountTitle',
    icon: '/assets/icons/register-user.png',
    sortOrder: 0,
    links: [
      { id: 1, groupId: 1, key: 'click_here_for_register', handle: '@KH88Play_01', handleKey: null, url: 'https://t.me/KH88Play_01', sortOrder: 0 },
      { id: 2, groupId: 1, key: 'click_here_for_register', handle: '@KH88Play_02', handleKey: null, url: 'https://t.me/KH88Play_02', sortOrder: 1 },
      { id: 3, groupId: 1, key: 'click_here_for_register', handle: '@KH88Play_05', handleKey: null, url: 'https://t.me/KH88Play_05', sortOrder: 2 },
    ],
  },
  {
    id: 2,
    titleKey: 'support.bettingTitle',
    icon: '/assets/icons/bet-now-icon.png',
    sortOrder: 1,
    links: [
      { id: 4, groupId: 2, key: 'click_here_for_betting', handle: '88KH ឆ្នោត 01', handleKey: null, url: 'https://t.me/KH88Play_03', sortOrder: 0 },
      { id: 5, groupId: 2, key: 'click_here_for_betting', handle: '88KH ឆ្នោត 02', handleKey: null, url: 'https://t.me/KH88Play_04', sortOrder: 1 },
    ],
  },
  {
    id: 3,
    titleKey: 'support.otherIssuesTitle',
    icon: '/assets/icons/question-help.png',
    sortOrder: 2,
    links: [
      { id: 6, groupId: 3, key: 'click_here_for_feedback', handle: '', handleKey: 'support.customerSupport', url: 'https://t.me/Bet_988', sortOrder: 0 },
    ],
  },
]
