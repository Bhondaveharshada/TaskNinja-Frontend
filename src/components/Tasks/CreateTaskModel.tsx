import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonItem,
  IonLabel,
  IonToast,
  IonLoading,
  IonDatetimeButton,
  IonButtons
} from '@ionic/react';
import { use, useEffect, useState } from 'react';
import { api } from '../../apis/api';

interface CreateTaskModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  createdBy: String; // Assuming createdBy is a string ID
  projectId: string;
  onTaskCreated: (task: any) => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  showModal,
  setShowModal,
  projectId,
  createdBy, // This is not used in the component but can be passed if needed
  onTaskCreated
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Todo' | 'pending' | 'in-progress' | 'completed'>('Todo');
  const [deadline, setDeadline] = useState<string>('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/projects/getmembers/${projectId}`);
      setUsers(res.data.members || []);
      console.log("Fetched users:", res.data.members);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  useEffect(() => {
    if (showModal) {
      setTitle('');
      setDescription('');
      setStatus('Todo');
      setDeadline('');
      setPriority('medium');
      setAssignedTo('');
      fetchUsers();
    }
  }, [showModal]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/task/create', {
        title,
        description,
        status,
        deadline: deadline || undefined,
        priority,
        createdBy,
        assignedTo: assignedTo || undefined,
        projectId
      });
      onTaskCreated(res.data.task);
      window.location.reload(); // Refresh to get the latest tasks
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
      <IonHeader>
        <IonToolbar style={{'--background': 'linear-gradient(to right, #d122cc, #ff9966)',
  color: 'white'}}>
          <IonTitle>Create New Task</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Title*</IonLabel>
          <IonInput
            value={title}
            onIonChange={(e) => setTitle(e.detail.value!)}
            required
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Description</IonLabel>
          <IonTextarea
            value={description}
            onIonChange={(e) => setDescription(e.detail.value!)}
            rows={3}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Status</IonLabel>
          <IonSelect
            value={status}
            onIonChange={(e) => setStatus(e.detail.value)}
          >
            <IonSelectOption value="Todo">Todo</IonSelectOption>
            <IonSelectOption value="pending">Pending</IonSelectOption>
            <IonSelectOption value="in-progress">In Progress</IonSelectOption>
            <IonSelectOption value="completed">Completed</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Priority</IonLabel>
          <IonSelect
            value={priority}
            onIonChange={(e) => setPriority(e.detail.value)}
          >
            <IonSelectOption value="low">Low</IonSelectOption>
            <IonSelectOption value="medium">Medium</IonSelectOption>
            <IonSelectOption value="high">High</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Deadline</IonLabel>
         <IonDatetimeButton datetime="datetime">
         
                                  <IonModal keepContentsMounted={true}>
                                   <IonDatetime
                                     id="datetime"
                                     onIonChange={(e) => {
                                       const value = e.detail.value;
                                       if (typeof value === 'string') {
                                         setDeadline(value);
                                       } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
                                         setDeadline(value[0]);
                                       }
                                     }}
                                   ></IonDatetime>
               
                             </IonModal>
                             </IonDatetimeButton>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Assign To</IonLabel>
          <IonSelect
            value={assignedTo}
            onIonChange={(e) => setAssignedTo(e.detail.value)}
            interface="popover"
            onIonFocus={fetchUsers}
          >
            <IonSelectOption value="">Unassigned</IonSelectOption>
            {users.map((user) => (
              <IonSelectOption key={user._id} value={user._id}>
                {user.Name}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <div className="ion-margin-top">
          <IonButton expand="block" onClick={handleSubmit} disabled={!title.trim()}>
            Create Task
          </IonButton>
        </div>

        <IonLoading isOpen={loading} message="Creating task..." />
        <IonToast
          isOpen={!!error}
          message={error}
          duration={3000}
          onDidDismiss={() => setError('')}
          color="danger"
        />
      </IonContent>
    </IonModal>
  );
};

export default CreateTaskModal;