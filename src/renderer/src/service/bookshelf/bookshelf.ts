import { req } from '../../api/axios'

// API接口类型定义

export interface BookInfoBean {
  bookUrl: string
  tocUrl: string
  origin: string
  originName: string
  name: string
  author: string
  kind: string
  coverUrl: string
  intro: string
  type: number
  group: number
  latestChapterTitle: string
  latestChapterTime: number
  lastCheckTime: number
  lastCheckCount: number
  totalChapterNum: number
  durChapterTitle: string
  durChapterIndex: number
  durChapterPos: number
  durChapterTime: number
  canUpdate: boolean
  order: number
  originOrder: number
  useReplaceRule: boolean
  isInShelf: boolean
}

export interface BookGroupBean {
  groupId: -1
  groupName: '全部'
  order: -10
  show: true
}

// 获取书架数据
export async function getBookshelf(refresh: number = 0): Promise<BookInfoBean[] | null> {
  try {
    const params = {
      refresh: refresh,
      v: Date.now()
    }
    return await req.get<BookInfoBean[]>('/getBookshelf', { params })
  } catch (error) {
    console.error('获取书架数据失败:', error)
    throw error
  }
}

// 保存书架数据到本地（如果需要）
export async function saveBookshelfToLocal(data: BookInfoBean[]): Promise<void> {
  try {
    localStorage.setItem('bookshelf_data', JSON.stringify(data))
  } catch (error) {
    console.error('保存书架数据到本地失败:', error)
  }
}

// 从本地获取书架数据
export function getBookshelfFromLocal(): BookInfoBean[] | null {
  try {
    const data = localStorage.getItem('bookshelf_data')
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('从本地获取书架数据失败:', error)
    return null
  }
}

// 获取书架的分组的信息
export async function getBookshelfGroups(): Promise<BookGroupBean[] | null> {
  return await req.get<BookGroupBean[]>('/getBookGroups', {})
}
