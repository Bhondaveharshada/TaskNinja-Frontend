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
import { useState, useEffect } from 'react';
import { api } from '../../apis/api';

interface EditTaskModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  task: {
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
  };
  onTaskUpdated: (updatedTask: any) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  showModal,
  setShowModal,
  task,
  onTaskUpdated
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState<'Todo' | 'pending' | 'in-progress' | 'completed'>(task.status);
  const [deadline, setDeadline] = useState<string>(task.deadline || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(task.priority);
  const [assignedTo, setAssignedTo] = useState<string>(task.assignedTo?.Name || '');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form when task prop changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setDeadline(task.deadline || '');
      setPriority(task.priority);
      setAssignedTo(task.assignedTo?.Name || '');
    }
    ;
  }, [task]);

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/projects/getmembers/${task.projectId}`);
      setUsers(res.data.members || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      const res = await api.patch(`/task/update/${task._id}`, {
        title,
        description,
        status,
        deadline: deadline || undefined,
        priority,
        assignedTo: assignedTo || undefined
      });
      onTaskUpdated(res.data.task);
      setShowModal(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
      <IonHeader>
        <IonToolbar style={{'--background': 'linear-gradient(to right, #d122cc, #ff9966)',
  color: 'white'}}>
          <IonTitle>Edit Task</IonTitle>
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
                value={task.deadline}
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
        

        <div className="ion-margin-top">
          <IonButton expand="block" onClick={handleSubmit} disabled={!title.trim()}>
            Update Task
          </IonButton>
        </div>

        <IonLoading isOpen={loading} message="Updating task..." />
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

export default EditTaskModal;