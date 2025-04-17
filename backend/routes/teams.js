import express from 'express'
import Team from '../models/Teams.js'
import League from '../models/League.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const teams = await Team.find().populate('league').populate('events')
    res.json(teams)
  } catch (err) {
    console.error('Error fetching teams:', err)
    res.status(500).json({ message: 'Failed to fetch teams' })
  }
})

router.post('/create', authMiddleware, async (req, res) => {
  const { name, league, season } = req.body

  try {
    const team = new Team({ name, league, season })
    await team.save()

    if (league) {
      const leagueDoc = await League.findById(league)
      if (leagueDoc) {
        leagueDoc.teams.push(team._id)
        await leagueDoc.save()
      }
    }

    res.status(201).json(team)
  } catch (err) {
    console.error('Error creating team:', err)
    return res.status(400).json({ message: 'Failed to create team' })
  }
})

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updatedTeam) return res.status(404).json({ message: 'Team not found' })
    res.json(updatedTeam)
  } catch (err) {
    res.status(400).json({ message: 'Failed to update team' })
  }
})

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedTeam = await Team.findByIdAndDelete(req.params.id)
    if (!deletedTeam) return res.status(404).json({ message: 'Team not found' })

    await League.updateMany({ teams: req.params.id }, { $pull: { teams: req.params.id } })

    res.json({ message: 'Team deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete team' })
  }
})

export default router