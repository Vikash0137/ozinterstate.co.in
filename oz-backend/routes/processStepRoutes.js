import express from 'express'
import { getPublicProcessSteps, getProcessSteps, createProcessStep, updateProcessStep, deleteProcessStep } from '../controllers/processStepController.js'
import { verifyAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/public', getPublicProcessSteps)
router.get('/', verifyAdmin, getProcessSteps)
router.post('/', verifyAdmin, createProcessStep)
router.put('/:id', verifyAdmin, updateProcessStep)
router.delete('/:id', verifyAdmin, deleteProcessStep)

export default router
