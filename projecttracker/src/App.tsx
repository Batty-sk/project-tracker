import React, { useEffect, useState } from "react";
import ClockLoader from "react-spinner";
import { Project } from "./components/Project";
import Button from "./components/Button";

export interface Task {
  title: string;
  description: string | "";
  points: number;
  completedlink: string;
}

interface Project {
  _id: string;
  title: string;
  description?: string;
  tasks: Task[];
  accepted?: boolean;
  completed?: boolean;
}
const App = () => {
  const [tabArea, updateTabArea] = useState<"New" | "Accepted" | "Track">("New");
  const [loading, updateLoading] = useState<boolean>(false);
  const [data, updateData] = useState<Project[]>([]);

  useEffect(() => {
    console.log("tab area is being re-runn ...");
    if (loading == true) {
      return; 
    }
    updateLoading(true);
    if (tabArea == "New") {
      (async () => {
        const data = await fetch(
          "http://localhost:8080/api/candidate/67610c6f0ecac7a8989ad8c3/projects/0",
          {
            method: "GET",
          }
        ); //fetching the user with id 101..
        const res = await data.json();
        console.log("result", res);
        updateLoading(false);
        updateData(res);
      })();
      return;
    }
    else if (tabArea == "Track") {
      (async () => {
        const data = await fetch(
          "http://localhost:8080/api/candidate/67610c6f0ecac7a8989ad8c3/projects/1",
          {
            method: "GET",
          }
        ); //fetching the user with id 101..
        const res = await data.json();
        console.log("result", res);
        updateLoading(false);
        updateData(res);
      })();
      return;
    } 
    else {
      (async () => {
        const data = await fetch(
          "http://localhost:8080/api/candidate/67610c6f0ecac7a8989ad8c3/projects/1",
          {
            method: "GET",
          }
        ); //fetching the user with id 101..
        const res = await data.json();
        console.log("pending request",res)
        updateLoading(false);
        updateData(res);
      })();
    }
  }, [tabArea]);

  const handleAcceptProject = (projectid: string) => {
    fetch(`http://localhost:8080/api/candidate/67610c6f0ecac7a8989ad8c3/project/${projectid}/accept`)
      .then((res) => res.json())
      .then((data) => alert("accepted! successfully!"))
      .catch((err) => console.log("something went wrong!"));
  };

  const handleUpdateClick = (args:{
    projectid: string,
    currentUpdates: { tasks: string[]; completed: boolean }
  }
  ) => {
    console.log("oon clicking on the update the args are coming up....",args)
    fetch(`http://localhost:8080/api/candidate/67610c6f0ecac7a8989ad8c3/project/${args.projectid}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", 
      },
      body:JSON.stringify(args.currentUpdates),
    })
      .then((res) => res.json())
      .then((data) => alert("successfully updated the project!"))
      .catch((err) => console.log("error while updating the project..."));
  };

  return (
    <div className="h-fit min-h-lvh overflow-auto overflow-x-hidden flex flex-col justify-center items-center bg-zinc-900">
    
     {tabArea == "Track"?<div className="flex w-full flex-col items-center justify-center">
            <h1 className="font-mono font-bold text-3xl text-white">
              Track Projects
            </h1>
            <span className="mt-2 h-2 w-9/12 block bg-white"></span>
            <div className="flex flex-col w-full mt-5">
            {data.map((x, i) => (
              <div className="flex justify-center w-full mt-2" key={i}>
                <Project
                  title={x.title}
                  projectid={x._id}
                  subtasks={x.tasks}
                  projectstatus= {x.completed?"Completed":"In-Progress"}
                  updateProjectHandler={
                 undefined
                  }
                  track={true}
                />
 
              </div>
            ))}
          </div>
          </div>:
          <>
      <div className="flex justify-center text-white font-mono text-3xl font-bold">
       
        <div>
          {" "}
          <h1
            className="cursor-pointer"
            onClick={() => {
              updateTabArea("New");
            }}
          >
            New Requests
          </h1>
          {tabArea == "New" && (
            <span className="mt-2 h-2 w-9/12 block bg-white"></span>
          )}
        </div>
        <span className="mx-5">|</span>

        <div className="flex flex-col items-end">
          <h1
            className="cursor-pointer"
            onClick={() => {
              updateTabArea("Accepted");
            }}
          >
            Accepted Projects
          </h1>
          {tabArea == "Accepted" && (
            <span className="mt-2 h-2 w-9/12 block bg-white"></span>
          )}
        </div>
      </div>
      <div className="md:mt-8 mt-5 w-full">
        {loading ? (
          <ClockLoader />
        ) : (
          <div className="flex flex-col w-full">
            {data.map((x, i) => (
              <div className="flex justify-center w-full mt-5" key={i}>
                <Project
                  title={x.title}
                  projectid={x._id}
                  subtasks={x.tasks}
                  projectstatus= {tabArea =="Accepted"?x.completed?"Completed":"In-Progress":"Not Started"}
                  updateProjectHandler={
                    tabArea === "Accepted"
                      ? handleUpdateClick
                      : undefined
                  }

                />
                {tabArea == "New" && <Button
                  className="px-3 py-1 font-mono bg-green-500 text-white"
                  text="Accept"
                  onClickListner={() => handleAcceptProject(x._id)}
                />}
 
              </div>
            ))}
          </div>
        )}
      </div>
      </>}
      <div className="font-mono mt-10 font-bold text-3xl text-white outline-double p-3 cursor-pointer hover:bg-zinc-800"
      onClick={()=>{
        updateTabArea(tabArea =="Track"?"Accepted":"Track")
      }}
      >
      { tabArea =="Track"?"<-- Back": "Track Project"}

      </div>
    </div>
  );
};

export default App;
