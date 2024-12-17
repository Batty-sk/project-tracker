import React, { useState } from "react";
import Button from "./Button";
import { Task } from "../App";

interface SubTaskProps {
  title: string;
  description: string;
  points: number;
  link: string;
  onLinkChange: (newLink: string) => void;
}

interface ProjectProps {
  title: string;
  projectid:string,
  projectstatus:"Not Started"| "Completed" | "In-Progress",
  subtasks:Task[];
  track?:boolean;
  updateProjectHandler?:(args: {
    projectid: string;
    currentUpdates: {
        tasks: string[];
        completed: boolean;
    };
}) => void 
}
const SubTask: React.FC<SubTaskProps> = ({
  title,
  description,
  points,
  link,
  onLinkChange,
}) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-4 shadow-md">
      <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
      <p className="text-gray-600 mt-2">{description}</p>
      <span className="block mt-2 font-bold text-blue-600">
        Points: {points}
      </span>
      <div className="mt-4">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor={`link-input-${title}`}
        >
          Submit your work link:
        </label>
        <input
          id={`link-input-${title}`}
          type="url"
          placeholder="Enter the link here"
          value={link}
          onChange={(e) => onLinkChange(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
    </div>
  );
};



export const Project: React.FC<ProjectProps> = ({ title, projectid, updateProjectHandler, projectstatus, subtasks, track}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [links, setLinks] = useState<string[]>(subtasks.map(val=>val.completedlink));
  const [projectStatus,updateProjectStatus] = useState<"Not Started"| "Completed" | "In-Progress">(projectstatus)

  const handleLinkChange = (index: number, newLink: string) => {
    const updatedLinks = [...links];
    updatedLinks[index] = newLink;
    setLinks(updatedLinks);
  };

  const handleToggle = () => {
    if (projectStatus === "In-Progress") {
      updateProjectStatus("Completed");
    } else if (projectStatus === "Completed") {
      updateProjectStatus("In-Progress");
    }
  };


  return (
    <div className="w-full max-w-3xl  p-6 bg-zinc-700 shadow-md shadow-blue-400">
      <h2 className="text-2xl font-mono
       text-teal-50">{title}</h2>
    <div className="flex justify-between">
      <Button
        onClickListner={() => setIsExpanded(!isExpanded)}
        text={isExpanded ? "View Less" : "View More"}
        className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      />


      {/* mechanism to calculate the points..*/}
      {track?<div className="flex font-mono border-b border-green-500">
        <span className="text-white">Total Tasks Done:{subtasks.filter(x=>x.completedlink!=="").length} / {subtasks.length}</span>
        <span className="text-white ms-3">|</span>
        <span className="ms-3 text-white">Total Score: {subtasks.reduce((total, task) => total + task.points, 0)}</span>
      </div>:
      updateProjectHandler && <Button text="Update" className="bg-yellow-300 rounded-lg text-black px-5  " onClickListner={()=>updateProjectHandler({projectid,currentUpdates:{
        tasks:links,
        completed:projectStatus=="Completed"?true:false,
      }})} />
    }
    {projectStatus !== "Not Started" && (
        <div className="mt-4 flex items-center space-x-2">
          <label className="text-lg text-white font-mono">Completed?</label>
          <button
            onClick={handleToggle}
            className={`${
              projectStatus === "Completed" ? "bg-green-500" : "bg-gray-500"
            } relative inline-flex items-center p-2 rounded-full cursor-pointer transition-all duration-300 ease-in-out`}
          >
            <span
              className={`${
                projectStatus === "Completed" ? "translate-x-6" : "translate-x-1"
              } inline-block w-6 h-6 bg-white rounded-full transition-transform duration-300 ease-in-out`}
            ></span>
          </button>
        </div>
      )}
</div>
      {isExpanded && (
        <div className="mt-6 space-y-4">
          {subtasks.map((subtask, index) => (
            <SubTask
              key={index}
              title={subtask.title}
              description={subtask.description}
              points={subtask.points}
              link={links[index]}
              onLinkChange={(newLink) => handleLinkChange(index, newLink)}
            />
          ))}
        </div>
      )}


    </div>
  );
};
