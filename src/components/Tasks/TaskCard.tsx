import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonCardSubtitle,
  IonBadge,
  IonChip,
  IonIcon,
  useIonRouter,
  IonAlert,
  IonItem,
  IonLabel
} from '@ionic/react';
import { timeOutline, personOutline, flagOutline, createOutline, trashOutline } from 'ionicons/icons';
import { useState } from 'react';
import { api } from '../../apis/api';
import EditTaskModal from './EditTaskModal';
import "./TaskCard.css"

interface TaskCardProps {
  task: {
    _id: string;
    title: string;
    description?: string;
    status: 'Todo' | 'pending' | 'in-progress' | 'completed';
    deadline?: string;
    priority: 'low' | 'medium' | 'high';
    createdBy: string; // Assuming createdBy is a string ID
    assignedTo?: {
      _id: string;
      Name: string;
    };
    projectId: string;
  };
  onTaskUpdated: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskUpdated }) => {
  const router = useIonRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const currentUser = localStorage.getItem('userId');

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'primary';
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'pending': return 'danger';
      default: return 'primary';
    }
  };

  const handleEdit = () => {
     setShowEditModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/task/deletetask/${task._id}`);
      onTaskUpdated();
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

   const handleTaskUpdated = (updatedTask: any) => {
    onTaskUpdated();
  };


  return (
    <>
      <IonCard className='card card--glass'>
        <IonCardHeader>
          <IonCardTitle>{task.title}</IonCardTitle>
          <IonCardSubtitle>
            <IonBadge color={getStatusColor()}>{task.status}</IonBadge>
            <IonChip color={getPriorityColor()} style={{ marginLeft: '8px' }}>
              <IonIcon icon={flagOutline} />
              {task.priority}
            </IonChip>
          </IonCardSubtitle>
        </IonCardHeader>

        <IonCardContent>
          {task.description && <p>{task.description}</p>}

          <IonItem lines="none">
            <IonIcon icon={personOutline} slot="start" />
            <IonLabel>
              {task.assignedTo?.Name || 'Unassigned'}
            </IonLabel>
          </IonItem>

          {task.deadline && (
            <IonItem lines="none">
              <IonIcon icon={timeOutline} slot="start" />
              <IonLabel>Due: {formatDate(task.deadline)}</IonLabel>
            </IonItem>
          )}

          <div className="ion-margin-top">
            <IonButton  onClick={handleEdit}>
              <IonIcon icon={createOutline} slot='' />
              
            </IonButton>

            <IonButton 
             
              color="danger" 
              onClick={() => setShowDeleteAlert(true)}
            >
              <IonIcon icon={trashOutline} slot='' />
            
            </IonButton>
          </div>
        </IonCardContent>
      </IonCard>

      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlert(false)}
        header={'Confirm Delete'}
        message={'Are you sure you want to delete this task?'}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Delete',
            handler: handleDelete
          }
        ]}
      />

        <EditTaskModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        task={task}
        onTaskUpdated={handleTaskUpdated}
      />
    </>
  );
};

export default TaskCard;