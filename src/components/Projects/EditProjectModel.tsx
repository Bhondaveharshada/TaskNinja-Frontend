import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonTextarea,
  IonButtons,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonLoading,
  useIonToast,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonDatetimeButton,
  IonDatetime,
  IonList,
} from "@ionic/react";
import {
  closeOutline,
  saveOutline,
  personAddOutline,
  trashOutline,
} from "ionicons/icons";
import { useEffect, useState, useRef } from "react";
import { api } from "../../apis/api";
import { Project } from "../Projects/Projects";

interface EditProjectModalProps {
  isOpen: boolean;
  project: Project;
  onClose: () => void;
  onProjectUpdated: (updatedProject: Project) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  project,
  onClose,
  onProjectUpdated,
}) => {
  const [editedProject, setEditedProject] = useState<Project>({ ...project });
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [presentToast] = useIonToast();
  let debounceTimer: any;

  // Initialize form with project data
  useEffect(() => {
    if (isOpen) {
      setEditedProject({ ...project });
      console.log("Project data initialized:", project);
      setNewMemberEmail("");
      setEmailValid(null);
    }
  }, [isOpen, project]);

  // Email validation debounce
  useEffect(() => {
    if (!newMemberEmail) {
      setEmailValid(null);
      return;
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        const res = await api.post("/user/checkemail", {
          email: newMemberEmail,
        });
        setEmailValid(res.data.exists);
      } catch (err) {
        console.error("Email validation failed:", err);
        setEmailValid(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [newMemberEmail]);

  const handleInputChange = (field: keyof Project, value: string) => {
    setEditedProject((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddMember = () => {
  if (emailValid && newMemberEmail && 
      !editedProject.members.some(m => m.email === newMemberEmail)) {
    setEditedProject(prev => ({
      ...prev,
      members: [...prev.members, { email: newMemberEmail }]
    }));
    setNewMemberEmail("");
    setEmailValid(null);
  }
};

const handleRemoveMember = (email: string) => {
  setEditedProject(prev => ({
    ...prev,
    members: prev.members.filter(m => m.email !== email)
  }));
};

  const handleSave = async () => {
    if (!editedProject?.name?.trim()) {
      presentToast({
        message: "Project name is required",
        duration: 2000,
        color: "danger",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.patch(
        `/projects/updateproject/${project._id}`,
        editedProject
      );

      if (response.status === 200) {
        presentToast({
          message: "Project updated successfully",
          duration: 2000,
          color: "success",
        });
        onProjectUpdated(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Failed to update project", error);
      presentToast({
        message: "Failed to update project",
        duration: 2000,
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <IonModal isOpen={isOpen} onDidDismiss={onClose}>
        <IonHeader>
          <IonToolbar style={{'--background': 'var(--ion-color-gradient)',
  color: 'white'}}>
            <IonButtons slot="start">
              <IonButton onClick={onClose} disabled={isLoading}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
            <IonTitle>Edit Project</IonTitle>
            <IonButtons slot="end">
              <IonButton
                strong={true}
                onClick={handleSave}
                disabled={isLoading || !editedProject.name?.trim()}
              >
                <IonIcon icon={saveOutline} slot="start" />
                Save
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonCard className="ion-padding">
    

            <IonCardContent>
              <IonLabel position="floating">Project Name *</IonLabel>
              <IonInput
                fill="outline"
                value={editedProject.name}
                onIonChange={(e) => handleInputChange("name", e.detail.value!)}
                placeholder="Enter project name"
              />

              <IonLabel position="floating">Description *</IonLabel>
              <IonTextarea
                fill="outline"
                value={editedProject.description}
                onIonChange={(e) =>
                  handleInputChange("description", e.detail.value!)
                }
                placeholder="Enter project description"
                rows={4}
                autoGrow
              />

              <IonLabel position="floating">Deadline</IonLabel>
              <IonDatetimeButton datetime="datetime">
                <IonModal keepContentsMounted={true}>
                  <IonDatetime
                    id= "datetime"
                    value={editedProject.deadline}
                    onIonChange={(e) => {
                      const value = e.detail.value;
                      if (typeof value === "string") {
                        handleInputChange("deadline", value);
                      } else if (
                        Array.isArray(value) &&
                        value.length > 0 &&
                        typeof value[0] === "string"
                      ) {
                        handleInputChange("deadline", value[0]);
                      }
                    }}
                    presentation="date"
                  ></IonDatetime>
                   
                </IonModal>
              </IonDatetimeButton>

              <IonLabel position="floating">Add Team Member</IonLabel>
              <div style={{ display: "flex", width: "100%" }}>
                <IonInput
                  fill="outline"
                  value={newMemberEmail}
                  onIonChange={(e) => setNewMemberEmail(e.detail.value!)}
                  type="email"
                  placeholder="Enter member's email"
                  style={{ flex: 1 }}
                >
                  </IonInput>
                <IonButton
                  onClick={handleAddMember}
                  fill="clear"
                  color="primary"
                  disabled={!emailValid}
                  style={{ marginLeft: "8px" }}
                >
                  <IonIcon icon={personAddOutline} />
                </IonButton>
              </div>
              {emailValid === false && (
                <IonLabel color="danger" className="ion-padding-start">
                  User not found
                </IonLabel>
              )}

              {editedProject.members.length > 0 && (
  <>
    <IonLabel>Current Team Members:</IonLabel>
    <IonList lines="none">
      {editedProject.members.map((member) => (
        <IonItem key={member._id }>
          <IonLabel>
            {member.Name || member.name} ({member.email})
          </IonLabel>
          <IonButton 
            slot="end"
            fill="clear" 
            color="danger"
            onClick={() => handleRemoveMember(member)}
          >
            <IonIcon icon={trashOutline} />
          </IonButton>
        </IonItem>
      ))}
    </IonList>
  </>

              )}

              <IonButton
                expand="block"
                onClick={handleSave}
                className="ion-margin-top"
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonModal>

      <IonLoading isOpen={isLoading} message="Saving changes..." />
    </>
  );
};

export default EditProjectModal;
