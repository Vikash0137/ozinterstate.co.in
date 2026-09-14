import morgan from 'morgan'

export const morganLogger = morgan(':method :url :status :res[content-length] - :response-time ms')

export const logActivity = (action, module, description = '') => {
  return (req, res, next) => {
    // Log activity internally
    console.log(`[ACTIVITY LOG] Admin ID: ${req.user?.id || 'Guest'} | Action: ${action} | Module: ${module} | Desc: ${description}`)
    next()
  }
}
