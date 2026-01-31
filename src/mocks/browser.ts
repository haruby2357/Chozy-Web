import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
import { searchHandlers } from './searchHandlers'

export const worker = setupWorker(...searchHandlers, ...handlers)