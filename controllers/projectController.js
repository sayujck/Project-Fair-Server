const projects = require('../models/projectModel')

// add project
exports.addProjectController = async(req,res)=>{
    console.log("Inside addProjectController");
    const userId = req.userId
    console.log(userId);
    console.log(req.body);
    console.log(req.file);
    const {title,languages,overview,github,website} = req.body
    const projectImage = req.file.filename
    try{
        const existingProject = await projects.findOne({github})
        if(existingProject){
            res.status(406).json("Project Already exists... Please Upload another")
        }
        else{
            const newProject = new projects({
                title,languages,overview,github,website,projectImage,userId
            })
            await newProject.save()
            res.status(200).json(newProject)
        }
    }catch(err){
        res.status(401).json(err)
    }
}

// get home projects - guest user
exports.getHomeProjectController = async(req,res)=>{
    console.log("Inside getHomeProjectController");
    try{
        const allHomeProjects = await projects.find().limit(3)
        res.status(200).json(allHomeProjects)
    }catch(err){
        res.status(401).json(err)
    }
}

// get user projects - authorised user
exports.getUserProjectController = async(req,res)=>{
    console.log("Inside getUserProjectController");
    const userId = req.userId
    try{
        const allUserProjects = await projects.find({userId})
        res.status(200).json(allUserProjects)
    }catch(err){
        res.status(401).json(err)
    }
}

// get all projects - authorised user
exports.getAllProjectController = async(req,res)=>{
    console.log("Inside getAllProjectController");
    // to get query parameter from url - use req.query
    const searchKey = req.query.search
    const query = {
        languages : {
            $regex:searchKey,$options:"i"
        }
    }
    try{
        // to get document from model which matches search query in languages
        const allProjects = await projects.find(query)
        res.status(200).json(allProjects)
    }catch(err){
        res.status(401).json(err)
    }
}

// edit project
exports.editProjectController = async(req,res)=>{
    console.log("Inside editProjectController");
    // get project id from request form
    const {id} = req.params
    // req.body contain only text type data
    const {title,languages,overview,github,website,projectImage} = req.body
    // to get file data - req.file
    const reUploadImageFilename = req.file ? req.file.filename:projectImage
    // to get userId - use jwt middleware
    const userId = req.userId
    console.log(id,title,languages,overview,github,website,reUploadImageFilename,userId);
    try {
        const updatedProject = await projects.findByIdAndUpdate({_id:id},{
            id,title,languages,overview,github,website,projectImage:reUploadImageFilename,userId
        },{new:true})
        await updatedProject.save()
        res.status(200).json(updatedProject)
    } 
    catch(err) {
        res.status(401).json(err)
    }
}

// remove project
exports.removeProjectController = async(req,res)=>{
    console.log("Inside removeProjectController");
    const {id} = req.params
    try {
        const removeProject = await projects.findByIdAndDelete({_id:id})
        res.status(200).json(removeProject)
    }catch (err) {
        res.status(401).json(err)
    }
    
}