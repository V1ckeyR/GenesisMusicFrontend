import mitt from 'mitt'

type Events = {
    'open-confirm': {
        title: string
        message: string
        options?: {
            confirmButtonText?: string
            cancelButtonText?: string
        }
        resolve: (value: boolean) => void
    }
}

export const eventBus = mitt<Events>()
