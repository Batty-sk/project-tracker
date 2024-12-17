const mongoose = require('mongoose');


const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  tasks: [{
    title: { type: String, required: true },
    description: { type: String },
    points: { type: Number, required: true },
    completedlink: { type: String}
  }],
  accepted: { type: Boolean, default: false },
  completed:{type:Boolean,default:false}
});

const Project = mongoose.model('Project', projectSchema);

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = {
  Candidate,
  Project,
};
