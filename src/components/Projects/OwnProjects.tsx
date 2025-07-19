import {
  IonButton,
  IonCol,
  IonGrid,
  IonLoading,
  IonRow,
  IonToast,
  IonContent,
  IonIcon,
  IonPage,
  IonRoute,
  IonRouterOutlet,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
} from "@ionic/react";
import { useEffect, useState } from "react";
import Projects from "./Projects";
import { api } from "../../apis/api";
import { useIonRouter } from "@ionic/react";
import { addOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import FilterSearchBar from "../ui/FilterSearchBar";
import "./OwnProjects.css";

const OwnProjects: React.FC = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useIonRouter();
  const history = useHistory();
  const ownerId = localStorage.getItem("userId");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/getprojectsbyOwnerId/${ownerId}`);
      setProjects(res.data.projects || []);
      setFilteredProjects(res.data.projects || [])
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch my projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    history.push("/app/projects/createproject");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar  >
         <div className="title-bar">
           <IonTitle >OwnProjects</IonTitle>
         </div>
        </IonToolbar>
          <FilterSearchBar 
          
          data={projects}
          filterField="name"
          onFiltered={setFilteredProjects}
        />
      </IonHeader>
      <IonContent className="ion-padding">
        <button className="btn" onClick={handleCreateProject}>
          <IonIcon icon={addOutline} slot="start"></IonIcon>
          Create New Project
        </button>

        <button className="btn" onClick={() => router.push('/app/otherprojects')}>
          <IonIcon slot="start"></IonIcon>
          Shared Projects
        </button>
        
        <IonGrid className="ion-margin-top">
          <IonRow>
            {filteredProjects.map((project: any) => (
              <IonCol
                size="12"
                sizeSm="6"
                sizeMd="4"
                sizeLg="3"
                sizeXl="3"
                sizeXs="12"
                key={project._id}
              >
                <Projects project={project} />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonLoading isOpen={loading} message="Loading..." />
        <IonToast
          isOpen={!!error}
          message={error}
          duration={3000}
          onDidDismiss={() => setError("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default OwnProjects;
