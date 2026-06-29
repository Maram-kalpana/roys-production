import api from '../services/api.js'

/**
 * Converts a File or Blob to a Base64 data URL string.
 */
export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })

/** Build FileUpload value from an existing stored URL (edit mode). */
export const fileStateFromUrl = (url, name = 'existing-image.jpg') => {
  if (!url || typeof url !== 'string' || url.startsWith('blob:')) return null
  return {
    file: null,
    name,
    type: 'image/jpeg',
    preview: url,
    existingUrl: url,
    isExisting: true,
  }
}

/** Convert a data URL to a File (camera capture fallback). */
export const dataUrlToFile = (dataUrl, filename = 'photo.jpg') => {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) return null
  const [header, base64] = dataUrl.split(',')
  if (!base64) return null
  const mime = header.match(/:(.*?);/)?.[1] || 'image/jpeg'
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return new File([bytes], filename, { type: mime })
}

const UPLOAD_FIELD_DIRS = {
  photo: 'customers',
  aadhaarDoc: 'identity-proofs',
  aadhaarFront: 'identity-proofs',
  aadhaarBack: 'identity-proofs',
  panDoc: 'identity-proofs',
  receipt: 'identity-proofs',
}

/**
 * Upload a single file via multipart FormData to POST /api/uploads.
 * Falls back to base64 data URL if upload API is unavailable.
 */
export const uploadImageFile = async (file, field = 'photo') => {
  if (!file) return null

  const formData = new FormData()
  formData.append('field', field)
  formData.append('file', file)

  try {
    const res = await api.post(`/uploads?field=${encodeURIComponent(field)}`, formData)
    const payload = res.data?.data ?? res.data
    const url = payload?.url ?? payload?.imageUrl ?? null
    if (url) {
      return url
    }
  } catch (err) {
    console.warn('File upload failed, falling back to base64:', err.response?.data?.message || err.message)
  }

  const base64 = await fileToBase64(file)
  return base64
}

/**
 * Resolve the URL to persist: upload new file (or base64 fallback), keep existing, or null if removed.
 */
export const resolveImageForSubmit = async (fileState, _existingUrl, field) => {
  // if (fileState === null) return null
  if (!fileState) return null

  let file = fileState?.file || null
  if (!file && fileState?.preview?.startsWith('data:image/')) {
    file = dataUrlToFile(fileState.preview, `${field}-${Date.now()}.jpg`)
  }

  if (file) {
    return uploadImageFile(file, field)
  }
  if (fileState?.existingUrl) {
    return fileState.existingUrl
  }
  if (fileState?.preview && !fileState.preview.startsWith('blob:')) {
    return fileState.preview
  }
  return null
}

/** Upload multiple identity proof images; returns array of URLs. */
export const uploadMultipleImages = async (images = []) => {
  const results = await Promise.all(
    images.map(({ file, field }) => uploadImageFile(file, field || 'identity-proofs')),
  )
  return results.filter(Boolean)
}

export { UPLOAD_FIELD_DIRS }