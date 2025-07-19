import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonCardSubtitle,
  useIonRouter,
  IonIcon,
  IonAlert,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { api } from "../../apis/api";
import { useState } from "react";
import { createOutline, eyeOutline, timeOutline, trashOutline } from "ionicons/icons";
import EditProjectModel from "./EditProjectModel";
import EditProjectModal from "./EditProjectModel";
import "./Projects.css"

export interface Project {
  _id: string;
  name: string;
  description: string;
  owner: string;
  members: any[]; // Assuming members is an array of user objects
  deadline?: string;
}

interface Props {
  project: Project;
  onProjectUpdated?: (updatedProject: Project) => void;
}

const ProjectCard: React.FC<Props> = ({
  project,
  onProjectUpdated = () => window.location.reload(),
}) => {
  const router = useIonRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const currentUser = localStorage.getItem("userId");

  const handleView = () => {
    router.push(`/app/project/${project._id}`, "forward");
  };

 /*  const handleEdit = () => {
    router.push(`/project/edit/${project._id}`, "forward");
  }; */

  const handleDelete = async () => {
    try {
      await api
        .delete(`/projects/deleteproject/${project._id}`)
        .then((response) => {
          if (response.status === 200) {
            alert("Project deleted successfully");
            window.location.reload();
          }
        });
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  const isOwner = project.owner === currentUser;

  return (
    <>
     <IonCard className="custom-project-card">
  <IonCardHeader>
    <IonCardTitle>{project.name}</IonCardTitle>
    <IonCardSubtitle>{isOwner ? 'Owner' : 'Member'}</IonCardSubtitle>
  </IonCardHeader>

  <IonCardContent>
    <p>{project.description || 'No description provided.'}</p>
    <h6 style={{fontWeight: "600"}}>
      
                  <IonLabel>
                    <IonIcon icon={timeOutline} slot="start" />
                    Due: {project.deadline ? new Date(project.deadline).toLocaleDateString() : "No deadline"}
                  </IonLabel>
    </h6>
                  
               

    <div className="card-buttons">
      <IonButton
        fill="solid"
        color="primary"
        onClick={handleView}
      >
        <IonIcon icon={eyeOutline} slot="" />    {/* view button */}
       
      </IonButton>

      {isOwner && (
        <>
          <IonButton
            fill="outline"
            color="secondary"
            onClick={() => setShowEditModal(true)}
          >
            <IonIcon icon={createOutline} slot="" />  {/* edit button */}
           
          </IonButton>

          <IonButton
            fill="solid"
            color="danger"
            onClick={() => setShowDeleteAlert(true)}
          >
            <IonIcon icon={trashOutline} slot="" /> {/* delete button */}
           
          </IonButton>
        </>
      )}
    </div>
  </IonCardContent>
</IonCard>

      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlert(false)}
        header={"Confirm Delete"}
        message={`Are you sure you want to delete this project: ${project.name} ?`}
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Delete",
            handler: handleDelete,
          },
        ]}
      />
      <EditProjectModal
        isOpen={showEditModal}
        project={project}
        onClose={() => setShowEditModal(false)}
        onProjectUpdated={onProjectUpdated}
      />
    </>
  );
};

export default ProjectCard;
