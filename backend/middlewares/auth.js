import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.json({ success: false, message: "No token provided" })

  // Remove 'Bearer ' prefix
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userid = decoded.userid
    next()
  } catch (error) {
    res.json({ success: false, message: "Invalid token" })
  }
}

export default auth