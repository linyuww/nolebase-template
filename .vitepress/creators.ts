export interface SocialEntry {
  type: 'github' | 'twitter' | 'email'
  icon: string
  link: string
}

export interface Creator {
  avatar: string
  name: string
  username?: string
  title?: string
  org?: string
  desc?: string
  links?: SocialEntry[]
  nameAliases?: string[]
  emailAliases?: string[]
}

const getAvatarUrl = (name: string) => `https://github.com/${name}.png`

export const creators: Creator[] = [
  {
    name: 'linyuww',
    avatar: '',
    username: 'linyuww',
    title: '博客作者',
    desc: '一个普普通通的摸鱼大学生',
    links: [
      { type: 'github', icon: 'github', link: 'https://github.com/linyuww' },
    ],
    nameAliases: ['nekomeowww', '绚香猫', '絢香猫', 'Neko Ayaka', 'Ayaka Neko'],
    emailAliases: ['neko@ayaka.moe'],
  },
].map<Creator>((c) => {
  c.avatar = c.avatar || getAvatarUrl(c.username)
  return c as Creator
})

export const creatorNames = creators.map(c => c.name)
export const creatorUsernames = creators.map(c => c.username || '')
