/* eslint-disable no-console */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios'

//
// ---- 1. 创建单例实例 ----
//
const apiInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/reader3', // 可在 .env 配置
  timeout: 15_000, // 15 秒
  withCredentials: true, // 需要携带 Cookie 的情况
  headers: {
    'Content-Type': 'application/json'
  }
})

//
// ---- 2. 拦截器：请求 ----
//
apiInstance.interceptors.request.use(
  (config) => {
    // ① 统一加入 token
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers!['Authorization'] = `Bearer ${token}`
    }

    // ② 这里可以做 loading 显示等
    // 例如 Vue3 <el-loading> 或 React 状态管理
    // if (config.meta?.showLoading) showLoading()

    return config
  },
  (error) => Promise.reject(error)
)

//
// ---- 3. 拦截器：响应 ----
//
apiInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // ① 可在这里统一处理业务码
    // 例如后端统一返回 { code, msg, data }
    const { isSuccess, data, errorMsg } = response.data
    if (!isSuccess) {
      // 统一错误日志或提示
      // 在生产环境可去掉 console
      console.error('API Error: ', errorMsg || 'Unknown error')
      return Promise.reject({ isSuccess, errorMsg, data })
    }
    return data // 直接返回业务层 data，调用者省去 data.xxx
  },
  (error) => {
    // ② 网络错误、后端 500 等
    if (error.response) {
      console.error('HTTP Error:', error.response.status, error.response.data)
    } else if (error.request) {
      console.warn('No response received:', error.request)
    } else {
      console.error('Request setup error:', error.message)
    }
    return Promise.reject(error)
  }
)

//
// ---- 4. 公共请求方法封装 ----
//
interface RequestParams extends AxiosRequestConfig {
  // 扩展你自己的 meta字段
  meta?: {
    showLoading?: boolean
    // 其它自定义字段，例如权限校验等
  }
}

// 通用请求方法
async function request<T = unknown, R = T>(config: RequestParams): Promise<R> {
  const res = await apiInstance.request<T, R>({
    ...config
  })
  return res
}

// 快捷方法
export const req = {
  get: <T = unknown>(url: string, args?: RequestParams) =>
    request<T>({ method: 'GET', url, ...args }),
  post: <T = unknown>(url: string, data?: unknown, args?: RequestParams) =>
    request<T>({ method: 'POST', url, data, ...args }),
  put: <T = unknown>(url: string, data?: unknown, args?: RequestParams) =>
    request<T>({ method: 'PUT', url, data, ...args }),
  del: <T = unknown>(url: string, args?: RequestParams) =>
    request<T>({ method: 'DELETE', url, ...args }),

  // 文件上传
  upload: async <R = unknown>(
    url: string,
    file: File | Blob,
    fieldName = 'file',
    args?: RequestParams
  ) => {
    const form = new FormData()
    form.append(fieldName, file)
    return request<R>({
      method: 'POST',
      url,
      data: form,
      headers: { 'Content-Type': 'multipart/form-data' },
      ...args
    })
  },

  // 文件下载（返回 Blob）
  download: async (
    url: string,
    params?: Record<string, unknown>,
    filename?: string
  ): Promise<void> => {
    const blob = await request<Blob>({
      method: 'GET',
      url,
      params,
      responseType: 'blob',
      transformResponse: undefined // 防止 axios 再次解析
    })
    // 自动下载
    const urlObj = window.URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = urlObj
    anchor.download = filename || 'download'
    anchor.click()
    window.URL.revokeObjectURL(urlObj)
  },

  // 请求取消
  cancel: <T = unknown>(config: RequestParams) => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source()
    const newConfig = { ...config, cancelToken: cancelTokenSource.token }
    request<T>(newConfig).catch(err => {
      if (axios.isCancel(err)) {
        console.warn('请求已取消:', err.message)
      }
    })
    // 你可以把 cancelTokenSource 暴露给外部，用来在组件卸载时调用 cancel()
    return cancelTokenSource.cancel
  }
}

//
// ---- 5. 导出 apiInstance（可作全局配置） ----
//
export default apiInstance
