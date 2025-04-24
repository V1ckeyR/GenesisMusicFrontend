import { eventBus } from '@/services/eventBus'

export interface ConfirmDialogOptions {
  confirmButtonText?: string
  cancelButtonText?: string
}

export function useConfirmDialog() {
  return (message: string, title = '', options: ConfirmDialogOptions = {}) => {
    return new Promise<boolean>((resolve) => {
      eventBus.emit('open-confirm', { message, title, options, resolve })
    })
  }
}
