import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const localesDir = join(__dirname, '..', 'src', 'locales')

const CDN = 'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh'

export const seedWebsites = [
  {
    key: 'sportsbook',
    url: 'https://88bkh.com',
    icon: '⚽',
    nameKeys: ['cards.sportsbook'],
    thumbnailMobile: [
      `${CDN}/sportsbook/mobile/v2/855-sport.webp`,
      `${CDN}/sportsbook/mobile/v2/live789-sport.webp`,
      `${CDN}/sportsbook/mobile/v2/sbc-sport.webp`,
    ],
    thumbnail: [
      `${CDN}/sportsbook/v2/855-sport.webp`,
      `${CDN}/sportsbook/v2/live789-sport.webp`,
      `${CDN}/sportsbook/v2/sbc-sport.webp`,
    ],
  },
  {
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
  },
  {
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
  },
]

export const seedSupportGroups = [
  {
    titleKey: 'support.accountTitle',
    icon: '/assets/icons/register-user.png',
    links: [
      { key: 'click_here_for_register', handle: '@KH88Play_01', handleKey: null, url: 'https://t.me/KH88Play_01' },
      { key: 'click_here_for_register', handle: '@KH88Play_02', handleKey: null, url: 'https://t.me/KH88Play_02' },
      { key: 'click_here_for_register', handle: '@KH88Play_05', handleKey: null, url: 'https://t.me/KH88Play_05' },
    ],
  },
  {
    titleKey: 'support.bettingTitle',
    icon: '/assets/icons/bet-now-icon.png',
    links: [
      { key: 'click_here_for_betting', handle: '88KH ឆ្នោត 01', handleKey: null, url: 'https://t.me/KH88Play_03' },
      { key: 'click_here_for_betting', handle: '88KH ឆ្នោត 02', handleKey: null, url: 'https://t.me/KH88Play_04' },
    ],
  },
  {
    titleKey: 'support.otherIssuesTitle',
    icon: '/assets/icons/question-help.png',
    links: [
      { key: 'click_here_for_feedback', handle: '', handleKey: 'support.customerSupport', url: 'https://t.me/Bet_988' },
    ],
  },
]

const flatten = (obj, prefix = '', out = {}) => {
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object') flatten(v, path, out)
    else out[path] = String(v)
  }
  return out
}

export const seedTranslations = () => {
  const rows = []
  for (const locale of ['en', 'km', 'vn', 'zh']) {
    const messages = JSON.parse(readFileSync(join(localesDir, `${locale}.json`), 'utf8'))
    for (const [path, value] of Object.entries(flatten(messages))) {
      rows.push({ locale, path, value })
    }
  }
  return rows
}
