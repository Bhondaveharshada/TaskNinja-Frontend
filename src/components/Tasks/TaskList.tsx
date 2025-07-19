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
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonList,
  IonFab,
  IonFabButton,
  useIonRouter
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { addOutline } from 'ionicons/icons';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModel';
import { api } from '../../apis/api';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'Todo' | 'pending' | 'in-progress' | 'completed';
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
  assignedTo?: {
    _id: string;
    Name: string;
  };
  projectId: string;
}

const TaskList: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useIonRouter();
  const userId = localStorage.getItem('userId');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/task/gettasks/${projectId}`);
      setTasks(res.data.tasks || []);
      console.log("task ", res.data.tasks )
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const handleTaskCreated = (newTask: Task) => {
    setTasks([...tasks, newTask]);
    setShowModal(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{
  '--background': 'linear-gradient(to right, #d122cc, #ff9966)',
  color: 'white'}}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/myprojects" color="light" />
          </IonButtons>
          <IonTitle>Project Tasks</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowModal(true)}>
              <IonIcon icon={addOutline} slot="start" />
              New Task
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            {tasks.map((task) => (
              <IonCol  size="12" sizeSm='6' sizeMd="4" sizeLg="3" sizeXl='3' sizeXs='12' key={task._id}>
                <TaskCard task={task} onTaskUpdated={fetchTasks} />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <CreateTaskModal
          showModal={showModal}
          setShowModal={setShowModal}
          createdBy={userId || ''}
          projectId={projectId}
          onTaskCreated={handleTaskCreated}
        />

        <IonFab  vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton style={{'--background': 'linear-gradient(to right, #d122cc, #ff9966)',
  color: 'white'}}  onClick={() => setShowModal(true)} >
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        <IonLoading isOpen={loading} message="Loading tasks..." />
        <IonToast
          isOpen={!!error}
          message={error}
          duration={3000}
          onDidDismiss={() => setError('')}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default TaskList;