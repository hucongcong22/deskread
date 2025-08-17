import { ElectronAPI } from '@electron-toolkit/preload'

interface Novel {
  id: number
  title: string
  author: string
  description: string
  status: string
  cover?: string
  lastRead?: Date
  origin?: string
  bookUrl?: string
  durChapterIndex?: number
}

interface Api {
  createReaderWindow: (novelData: Novel) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}