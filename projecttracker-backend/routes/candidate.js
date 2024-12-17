const express = require('express');
const { Candidate, Project } = require('../models/schema'); 
const router = express.Router();

router.get('/candidate/dummy', async (req, res) => {
  try {
    const dummyData = {
      name: 'Batman',
      email: `Batman_${Date.now()}@example.com` 
    };

    const dummyCandidate = new Candidate(dummyData);
    await dummyCandidate.save();

    res.status(201).json({ 
      message: 'Dummy candidate created successfully',
      _id: dummyCandidate._id
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error 
    });
  }
});

router.get('/project/dummy', async (req, res) => {
  try {
    const dummyProjectData = {
      title: 'Sample Project',
      description: 'This is a dummy project for testing purposes.',
      tasks: [
        {
          title: 'Task 1',
          description: 'First task of the project.',
          points: 10,
          completedlink: '' 
        },
        {
          title: 'Task 2',
          description: 'Second task of the project.',
          points: 20,
          completedlink: '' 
        },
        {
          title: 'Task 3',
          description: 'Third task of the project.',
          points: 15,
          completedlink: '' 
        }
      ],
      accepted: false,
      completed: false
    };

    const dummyProject = new Project(dummyProjectData);
    await dummyProject.save();

    res.status(201).json({
      message: 'Dummy project created successfully',
      _id: dummyProject._id,
      tasks: dummyProject.tasks
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error
    });
  }
});


router.get('/candidate/:candidateId/projects/:accepted', async (req, res) => {
  try {

    console.log("params",req.params.candidateId)
    const candidate = await Candidate.findById(req.params.candidateId).populate('projects');
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    const accepted = req.params.accepted
    if(accepted == "1"){
      return res.status(200).json(candidate.projects.filter((x)=>x.accepted == true)
    );
    }
    return res.status(200).json(candidate.projects.filter((x)=>x.accepted == false))
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/candidate/:candidateId/project/:projectId/assign', async (req, res) => {
  console.log("running the route")

  try {
    const candidate = await Candidate.findById(req.params.candidateId);
    const project = await Project.findById(req.params.projectId);

    if (!candidate || !project) {
      return res.status(404).json({ message: 'Candidate or Project not found' });
    }

    candidate.projects.push(project);
    await candidate.save(); 
    
    res.status(200).json({ message: 'Project assigned successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/candidate/:candidateId/project/:projectId/update', async (req, res) => {
  console.log("running the update route")

  try {
    const candidate = await Candidate.findById(req.params.candidateId);
    const project = await Project.findById(req.params.projectId);
    const { tasks } = req.body; 
    const {completed} = req.body;
    console.log("body",req.body)

    console.log("tasks",tasks)
    if (!candidate || !project) {
      return res.status(404).json({ message: 'Candidate or Project not found' });
    }

    if (!candidate.projects.some(p => p._id.toString() === project._id.toString())) {
      return res.status(400).json({ message: 'Project not assigned to candidate' });
    }

    if (Array.isArray(project.tasks)) {
      console.log("yes>")
      project.tasks = project.tasks.map((task,i) => ({
        ...task,
        completedlink: tasks[i]|| "",
 
      }));
    } else {
      return res.status(400).json({ message: 'Invalid tasks data format' });
    }
    console.log("projects tasks")
    project.completed = completed
    await project.save()
    //logic of updating ...    
    res.status(200).json({ message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/candidate/:candidateId/project/:projectId/accept', async (req, res) => {
  console.log("running the route acceptint the project...")

  try {
    const candidate = await Candidate.findById(req.params.candidateId);
    const project = await Project.findById(req.params.projectId);
    
    if (!candidate || !project) {
      return res.status(404).json({ message: 'Candidate or Project not found' });
    }

    // checking if  the candidate has the project assigned before accepting
    if (!candidate.projects.some(p => p._id.toString() === project._id.toString())) {
      return res.status(400).json({ message: 'Project   not assigned to candidate' });
    }

    project.accepted = true;
    await project.save();
    
    res.staus(200).json({ message: 'Project accepted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
