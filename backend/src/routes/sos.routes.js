const router=require('express').Router(); const {sos}=require('../services/dataStore'); const {v4:uuid}=require('uuid');
router.post('/',(req,res)=>{ const item={id:uuid(),createdAt:new Date().toISOString(),status:'sent',...req.body}; sos.unshift(item); res.status(201).json({message:'SOS alert sent to emergency contacts',alert:item}); });
router.get('/',(_,res)=>res.json(sos));
module.exports=router;
