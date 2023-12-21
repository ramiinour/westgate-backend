const Response = require('../../../configuration/config.response'),
    bcrypt = require('bcrypt'),
    { PrismaClient } = require('@prisma/client'),
    Prisma = new PrismaClient(),
    jwt = require("jsonwebtoken");

   

const getAllLeads = async (req, res, next) => {
    try{
        console.log("test");
        console.log(req.user);
        const {count,page,sort} = req.params;
        const {id} = req.user;

        let where = {}
        
        if(id != 1) {
            where = {
                teamMemberId:parseInt(id)
            }
            
        }
        const data = await Prisma.lead.findMany({
            take: parseInt(count),
            skip: (parseInt(page) - 1) * parseInt(count),
            where:where,
            orderBy:{
                createdAt:sort
            },
            include:{
                teamMember:true
            }
        })

        const leadCount = await Prisma.lead.findMany({
            where:where
        });

        let totalPages = (parseInt(leadCount.length) / parseInt(count))
        totalPages = Number.isInteger(totalPages) ? totalPages : parseInt(totalPages) + 1
        
        return Response.sendResponse(res, {
            msg: '2000',
            data: {
                data: data,
                count: leadCount.length,
                page: page,
                totalPages: totalPages
            },
            lang: req.params.lang
        });
    }catch(err){
        console.log(err);
        return next({ msg: 3067 })
    }
}

const postLead = async (req, res, next) => {
    try{
        const {id} = req.params;
        const {name,email,phoneNum,message} = req.body;

        if(!name || !email || !phoneNum) next({msg:2100})

        const data = await Prisma.lead.create({
            data:{
                name,
                email,
                phoneNum,
                message:message??"",
                teamMemberId:parseInt(id),
                status:"Pending"
            }
        })

        return Response.sendResponse(res, {
            msg: '2001',
            data: {
                data: data,
            },
            lang: req.params.lang
        });

        
    }catch(err){
        console.log(err);
        return next({ msg: 3067 })
    }
}

const getLeadByIdByAgent = async (req,res,next) => {
    try{
        const {id} = req.user;
        const {id:leadId} = req.params;

        let where = {
            
        };

        if(id != 1){
            where = {
                teamMemberId:parseInt(id)
            }
        }

        const data = await Prisma.lead.findFirst({
            where:{
                id:parseInt(leadId),
                ...where
            },
            include:{
                comments:true
            }
        })

        return Response.sendResponse(res, {
            msg: '2002',
            data: {
                data: data,
            },
            lang: req.params.lang
        });
    }catch(err){
        console.log(err);
        return next({ msg: 3067 })
    }
    
}

const addLeadCommentForAgent = async (req, res, next) => {
    try{
        const {id} = req.user;
        const {comment} = req.body;
        const {id:leadId} = req.params;

        const isLeadForAgent = await Prisma.lead.findFirst({
            where:{
                id:parseInt(leadId),
                teamMemberId:parseInt(id)
            }
        })

        if(!isLeadForAgent) next({ msg: 3067 })

        const data = await Prisma.leadComment.create({
            data:{
                comment,
                leadId:parseInt(leadId)
            }
        })

        return Response.sendResponse(res, {
            msg: '2001',
            data: {
                data: data,
            },
            lang: req.params.lang
        });

        
    }catch(err){
        console.log(err);
        return next({ msg: 3067 })
    }
}

const deleteCommentForAgent = async(req,res,next) => {
    try{
        const {id} = req.user;
        const {id:leadId,commentId} = req.params;

        const isLeadExistsForAgent = await Prisma.lead.findFirst({
            where:{
                id:parseInt(leadId),
                teamMemberId:parseInt(id),
                comments:{some:{id:parseInt(commentId)}}
            }
        })

        if(!isLeadExistsForAgent)
            next({ msg: 3067 })

        const data = await Prisma.leadComment.delete({
            where:{
                id:parseInt(commentId)
            }
        });

        return Response.sendResponse(res, {
            msg: '2003',
            data: {
                data: data,
            },
            lang: req.params.lang
        });
        
    }catch(err){
        console.log(err);
        return next({ msg: 3067 })
    }
}

const updateLeadStatus = async(req,res,next) => {
    try{
        const {id} = req.user;
        const {status} = req.body;
        const {id:leadId} = req.params;

        if(!status)next({ msg: 3067 })

        if(id!=1){
            const isLeadExistsForAgent = await Prisma.lead.findFirst({
                where:{
                    id:parseInt(leadId),
                    teamMemberId:parseInt(id),
                   
                }
            })

            if(!isLeadExistsForAgent) next({ msg: 3067 })
        }
       
        const data = await Prisma.lead.update({
            where:{
                id:parseInt(leadId),
            },
            data:{
                status
            }
        })

        return Response.sendResponse(res, {
            msg: '2004',
            data: {
                data: data,
            },
            lang: req.params.lang
        });
    }catch(err){
        console.log(err);
        return next({ msg: 3067 })
    }
}

module.exports = {
    postLead,
    getLeadByIdByAgent,
    addLeadCommentForAgent,
    deleteCommentForAgent,
    updateLeadStatus,
    getAllLeads
}