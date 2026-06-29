import { useRef, useState, useCallback, useEffect } from 'react'
// import { Box, Typography, Button, IconButton, Dialog } from '@mui/material'
import { Box, Typography, Button, IconButton } from '@mui/material'
import { Camera, Upload, X, FileText } from 'lucide-react'

const ACCEPTED = '.jpg,.jpeg,.png,.pdf'
const IMAGE_ACCEPT = 'image/*'
const CAMERA_DIALOG_Z = 2000

const FileUpload = ({
  label,
  value,
  onChange,
  accept = ACCEPTED,
  enableCamera = true,
  captureMode = 'environment',
}) => {
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const streamAttachedRef = useRef(false)
  const listenerCleanupRef = useRef(null)

  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState('')

  const imageOnly = accept === IMAGE_ACCEPT || !accept.includes('pdf')

  const previewSrc = value?.preview || value?.existingUrl
  const isPdf = value?.type === 'application/pdf' || value?.name?.toLowerCase().endsWith('.pdf')
  const hasSelection = Boolean(previewSrc || value?.file)

  const applySelection = useCallback((file, previewUrl) => {
    if (!file || !previewUrl) return
    onChange({
      file,
      name: file.name,
      type: file.type || 'image/jpeg',
      preview: previewUrl,
    })
  }, [onChange])

  const handleFile = (file) => {
    if (!file) return
    const isImage =
      file.type?.startsWith('image/') ||
      /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(file.name ?? '')
    if (isImage) {
      const previewUrl = URL.createObjectURL(file)
      applySelection(file, previewUrl)
    } else {
      onChange({ file, name: file.name, type: file.type, preview: null })
    }
  }

  const handleRemove = () => {
    onChange(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const openFilePicker = () => fileInputRef.current?.click()
  const openNativeCamera = () => { setCameraError(''); cameraInputRef.current?.click() }

  const stopStream = useCallback(() => {
    if (listenerCleanupRef.current) {
      listenerCleanupRef.current()
      listenerCleanupRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    streamAttachedRef.current = false
    setCameraReady(false)
  }, [])

  useEffect(() => () => stopStream(), [stopStream])

  const videoRefCallback = useCallback((el) => { videoRef.current = el }, [])

  const attachStreamToVideo = useCallback(() => {
    if (streamAttachedRef.current || !streamRef.current) return
    const videoEl = videoRef.current
    if (!videoEl) return

    streamAttachedRef.current = true
    setCameraReady(false)
    setCameraError('')

    const checkReady = () => {
      if (videoEl.videoWidth > 0 && videoEl.videoHeight > 0) {
        setCameraReady(true)
        return true
      }
      return false
    }

    const onReady = () => checkReady()
    videoEl.addEventListener('loadedmetadata', onReady)
    videoEl.addEventListener('loadeddata', onReady)
    videoEl.addEventListener('canplay', onReady)

    const timeoutId = setTimeout(() => {
      if (!checkReady()) {
        setCameraError(
          'Camera is taking too long to start. Please close and try again, or use "Choose File" instead.',
        )
      }
    }, 6000)

    listenerCleanupRef.current = () => {
      clearTimeout(timeoutId)
      videoEl.removeEventListener('loadedmetadata', onReady)
      videoEl.removeEventListener('loadeddata', onReady)
      videoEl.removeEventListener('canplay', onReady)
    }

    videoEl.srcObject = streamRef.current
    videoEl.play().catch(() => checkReady())
  }, [])

  const openCamera = async () => {
    setCameraError('')
    if (!navigator.mediaDevices?.getUserMedia) { openNativeCamera(); return }
    try {
      stopStream()
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: captureMode === 'user' ? 'user' : 'environment' },
        audio: false,
      })
      streamRef.current = mediaStream
      streamAttachedRef.current = false
      setCameraOpen(true)
    } catch (err) {
      const isDenied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
      setCameraError(isDenied
        ? 'Camera permission denied. Please allow camera access in your browser settings.'
        : 'Camera unavailable. Using device camera instead.')
      openNativeCamera()
    }
  }

  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) {
      setCameraError('Camera not ready. Please wait a moment and try again.')
      return
    }
    if (!video.videoWidth || !video.videoHeight) {
      setCameraError('Camera is still loading. Please wait a moment and try again.')
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)

    canvas.toBlob((blob) => {
      if (!blob) {
        setCameraError('Failed to capture photo. Please try again.')
        return
      }

      const file = new File([blob], `${label || 'photo'}-${Date.now()}.jpg`, {
  type: 'image/jpeg',
})

const previewUrl = URL.createObjectURL(file)

onChange({
  file,
  name: file.name,
  type: file.type || 'image/jpeg',
  preview: previewUrl,
})

if (document.activeElement instanceof HTMLElement) {
  document.activeElement.blur()
}

setTimeout(() => {
  stopStream()
  setCameraOpen(false)
  setCameraError('')
}, 100)
      // const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' })
      
      // Route the captured file exactly through the same function that "Choose File" uses
      // handleFile(file)
      
      // Close the dialog
      // stopStream()
      // setCameraOpen(false)
      // setCameraError('')
    }, 'image/jpeg', 0.92)
  }

  const closeCamera = () => { stopStream(); setCameraOpen(false); setCameraError('') }

  return (
    <Box sx={{ minWidth: 0, maxWidth: '100%' }}>
      <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569', mb: 1 }}>
        {label}
      </Typography>

      <input ref={fileInputRef} type="file" accept={accept} hidden
        onChange={(e) => handleFile(e.target.files?.[0])} />
      {enableCamera && (
        <input ref={cameraInputRef} type="file" accept="image/*" capture={captureMode} hidden
          onChange={(e) => handleFile(e.target.files?.[0])} />
      )}
      <canvas ref={canvasRef} hidden />

      {!hasSelection ? (
        <Box sx={{ border: '2px dashed #cbd5e1', borderRadius: 2, p: 2, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, justifyContent: 'center' }}>
            {enableCamera && (
              <Button type="button" variant="contained" startIcon={<Camera size={16} />} onClick={openCamera}
                sx={{ bgcolor: '#0B1F4D', '&:hover': { bgcolor: '#0a1a3d' }, height: 40 }}>
                Take Photo
              </Button>
            )}
            <Button type="button" variant="outlined" startIcon={<Upload size={16} />} onClick={openFilePicker} sx={{ height: 40 }}>
              Choose File
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            JPG, JPEG, PNG{!imageOnly ? ', PDF' : ''}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, p: 2, bgcolor: '#f8fafc' }}>
          {previewSrc && !isPdf && (
            <Box component="img" key={previewSrc} src={previewSrc} alt={label}
              sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 1, mb: 1, bgcolor: '#f1f5f9', display: 'block' }}
            />
          )}
          {isPdf && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, p: 1.5, bgcolor: '#fff', borderRadius: 1 }}>
              <FileText size={28} className="text-red-500" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>PDF Document</Typography>
            </Box>
          )}
          <Typography variant="caption" sx={{ display: 'block', color: '#64748b', mb: 1, wordBreak: 'break-all' }}>
            {value?.name || 'Captured photo'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {enableCamera && (
              <Button type="button" size="small" variant="outlined" startIcon={<Camera size={14} />} onClick={openCamera}>
                Retake
              </Button>
            )}
            <Button type="button" size="small" variant="outlined" onClick={openFilePicker}>Replace</Button>
            <IconButton size="small" color="error" onClick={handleRemove}><X size={16} /></IconButton>
          </Box>
        </Box>
      )}

{cameraOpen && (
  <Box
    sx={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      bgcolor: 'rgba(0,0,0,0.55)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
    }}
  >
    <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 2, width: '100%', maxWidth: 620 }}>
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
        {label}
      </Typography>

      <Box
        component="video"
        ref={(el) => {
          videoRef.current = el
          if (el && streamRef.current && !streamAttachedRef.current) {
            attachStreamToVideo()
          }
        }}
        autoPlay
        playsInline
        muted
        sx={{
          width: '100%',
          borderRadius: 1,
          bgcolor: '#000',
          maxHeight: 360,
          minHeight: 200,
          display: 'block',
        }}
      />

      {cameraError && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
          {cameraError}
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
        <Button type="button" onClick={closeCamera}>Cancel</Button>
        <Button
          type="button"
          variant="contained"
          onClick={capturePhoto}
          sx={{ bgcolor: '#0B1F4D', '&:hover': { bgcolor: '#0a1a3d' } }}
        >
          Capture
        </Button>
      </Box>
    </Box>
  </Box>
)}
      {/* <Dialog
      open={cameraOpen}
  onClose={closeCamera}
  maxWidth="sm"
  fullWidth
  disableRestoreFocus
  disableAutoFocus
  disableEnforceFocus
        // open={cameraOpen}
        // onClose={closeCamera}
        // maxWidth="sm"
        // fullWidth
        sx={{ zIndex: CAMERA_DIALOG_Z }}
        slotProps={{
          root: { sx: { zIndex: CAMERA_DIALOG_Z } },
          backdrop: { sx: { zIndex: CAMERA_DIALOG_Z - 1 } },
          transition: { onEntered: attachStreamToVideo },
        }}
        // disableEnforceFocus
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>{label}</Typography>

          <Box
            component="video"
            ref={videoRefCallback}
            autoPlay
            playsInline
            muted
            sx={{ width: '100%', borderRadius: 1, bgcolor: '#000', maxHeight: 360, minHeight: 200, display: 'block' }}
          />

          {cameraError && (
            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>{cameraError}</Typography>
          )}
          {!cameraReady && !cameraError && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Starting camera…
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
            <Button type="button" onClick={closeCamera}>Cancel</Button>
            <Button type="button" variant="contained" onClick={capturePhoto}
              sx={{ bgcolor: '#0B1F4D', '&:hover': { bgcolor: '#0a1a3d' } }}>
              Capture
            </Button>
          </Box>
        </Box>
      </Dialog> */}
    </Box>
  )
}

export default FileUpload