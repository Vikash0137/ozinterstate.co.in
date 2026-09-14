import express from 'express'
import { getPublicTeamMembers, getTeamMembers, getTeamMemberById, createTeamMember, updateTeamMember, deleteTeamMember } from '../controllers/teamController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/public', getPublicTeamMembers)
router.get('/', verifyAdmin, getTeamMembers)
router.get('/:id', verifyAdmin, getTeamMemberById)
router.post('/', verifyAdmin, createTeamMember)
router.put('/:id', verifyAdmin, updateTeamMember)
router.delete('/:id', verifyAdmin, deleteTeamMember)

export default router
