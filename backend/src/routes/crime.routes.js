const router=require('express').Router(); const store=require('../services/dataStore');
router.get('/summary',(_,res)=>res.json(store.summary()));
router.get('/areas',(_,res)=>res.json(store.buildAreas()));
router.get('/heatmap',(_,res)=>res.json(store.heatmap()));
router.get('/area/:name',(req,res)=>res.json(store.areaDetails(req.params.name)));
router.get('/route',(req,res)=>res.json(store.route(req.query.from,req.query.to)));
router.get('/reports',(_,res)=>res.json(store.reports));
router.post('/reports',(req,res)=>res.status(201).json(store.addReport(req.body)));
router.get('/criminals',(_,res)=>res.json([
{id:1,name:'Unknown Gang A',area:'Dhanmondi',riskScore:92,cases:18,category:'Robbery',status:'Wanted'},
{id:2,name:'Snatching Group B',area:'Mirpur 10',riskScore:88,cases:14,category:'Theft',status:'Under Watch'},
{id:3,name:'Narcotics Ring C',area:'Gazipur Sadar',riskScore:81,cases:11,category:'Narcotics',status:'Wanted'}]));
module.exports=router;
