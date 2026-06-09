export { toast } from 'sonner'
export const useToast = () => ({ toast: (msg: string) => console.log(msg) })
