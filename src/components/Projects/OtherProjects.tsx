import {
  IonCol,
  IonGrid,
  IonLoading,
  IonRow,
  IonToast,
  IonContent,
  IonPage,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonHeader,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import Projects from './Projects';
import { api } from '../../apis/api';
import FilterSearchBar from '../ui/FilterSearchBar';

const OtherProjects: React.FC = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const memberId = localStorage.getItem('userId');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/getprojectsbyMemberId/${memberId}`,);
      setProjects(res.data.projects || []);
      setFilteredProjects(res.data.projects || [])
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch other projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <IonPage>
        <IonHeader >
              <IonToolbar style={{
  '--background': 'linear-gradient(to right, #d122cc, #ff9966)',
  color: 'white'}}>
                <IonButtons slot="start">
                  <IonBackButton defaultHref='/app/myprojects'  color="light"></IonBackButton>
                </IonButtons>
                <IonTitle>Shared Projects</IonTitle>
              </IonToolbar>
              <FilterSearchBar 
          
          data={projects}
          filterField="name"
          onFiltered={setFilteredProjects}
        />
            </IonHeader>
      <IonContent className="ion-padding">
      <IonGrid>
        <IonRow>
          {filteredProjects.map((project: any) => (
            <IonCol  size="12" sizeSm='6' sizeMd="4" sizeLg="3" sizeXl='3' sizeXs='12' key={project._id}>
              <Projects project={project} />
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>

      <IonLoading isOpen={loading} message="Loading..." />
      <IonToast isOpen={!!error} message={error} duration={3000} onDidDismiss={() => setError('')} />
    </IonContent>
    </IonPage>
  );
};

export default OtherProjects;
