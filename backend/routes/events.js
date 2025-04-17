import express from 'express'
import authCode from '../middleware/auth.js'
import Event from '../models/Events.js'
import Team from '../models/Teams.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('who').populate('versus')
    res.json(events)
  } catch (err) {
    console.error('Failed to load events: ', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/', authCode, async (req, res) => {
  try {
    if (typeof req.body.what === 'string') {
      req.body.what = req.body.what === 'true'
    }

    const event = new Event(req.body)
    await event.save()
    if (req.body.team) {
      await Team.findByIdAndUpdate(req.body.team, { $push: { events: event._id } }, { new: true })
    }

    res.status(201).json(event)
  } catch (err) {
    console.error('Failed to create event:', err)
    res.status(400).json({ message: 'Failed to create event' })
  }
})

router.put('/:id', authCode, async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updated) return res.status(404).json({ message: 'Event not found' })
    res.json(updated)
  } catch (err) {
    res.status(400).json({ message: 'Failed to update event' })
  }
})

router.delete('/:id', authCode, async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Event not found' })
    res.json({ message: 'Event deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete event' })
  }
})

export default router
