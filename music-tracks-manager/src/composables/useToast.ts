import { ElMessage } from 'element-plus'

export function useToast() {
    function showToast(type: 'success' | 'error' | 'info' | 'warning', message: string) {
        const container = document.createElement('div')
        container.setAttribute('data-testid', 'toast-container')

        const msg = ElMessage({
            type,
            message: `<span data-testid="toast-${type}">${message}</span>`,
            dangerouslyUseHTMLString: true,
            appendTo: container,
            customClass: 'custom-toast'
        })

        document.body.appendChild(container)

        // Clean up after message disappears
        setTimeout(() => container.remove(), 4000)
    }

    return {
        success: (msg: string) => showToast('success', msg),
        error: (msg: string) => showToast('error', msg),
        info: (msg: string) => showToast('info', msg),
        warning: (msg: string) => showToast('warning', msg)
    }
}
